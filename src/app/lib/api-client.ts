// THE API client for the whole app — customer surface and staff console alike:
// in-memory access token + single-flight refresh-on-401 + envelope unwrap.
//
// There is one sign-in (/login) and therefore one session. The access token and
// the refresh rotation must live in exactly one module: the refresh cookie
// rotates on every use and the server treats a replayed refresh token as a
// compromised family (revoke + tokenVersion bump — auth.service.ts refresh()),
// so two clients each holding their own token would eventually race on the same
// cookie and log the user out. The admin client layers its pagination helpers
// over this module rather than duplicating it.

const API_PATH = "/api/v1";

/** Absolute API origin, for calls made outside a browser (see API_BASE). */
function serverApiOrigin(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (base) {
    try {
      return new URL(base).origin;
    } catch {
      /* malformed — fall through to the dev default */
    }
  }
  return "http://localhost:4000";
}

/**
 * Base for every session-bearing call.
 *
 * In the browser this is a SAME-ORIGIN path, proxied to the API by the rewrite in
 * next.config.ts. That is what keeps authentication working across tabs: the
 * refresh cookie is SameSite=Strict, and a browser withholds Strict cookies from
 * cross-site requests — which is what the app↔API pair is on Vercel, since
 * `vercel.app` is on the Public Suffix List. Calling the API through the app's own
 * origin keeps the cookie attached, so a new tab or a reload can rotate it.
 *
 * Outside a browser — a client component being server-rendered — a relative URL
 * has no origin to resolve against, so fall back to the absolute API origin.
 */
export const API_BASE = typeof window === "undefined" ? `${serverApiOrigin()}${API_PATH}` : API_PATH;

let accessToken: string | null = null;

/**
 * Incremented whenever the session is deliberately dropped. A refresh that was
 * already in flight at that moment must not resurrect the token afterwards.
 */
let epoch = 0;

export const setAccessToken = (t: string | null) => {
  accessToken = t;
  if (t === null) epoch += 1;
};
export const getAccessToken = () => accessToken;

/**
 * Session-loss subscribers. A refresh can fail for a session the UI currently
 * believes is live (rotated-token reuse, an expired or revoked refresh token, a
 * tokenVersion bump). Without this the provider would keep rendering the account
 * avatar for a session the server has already thrown away; the auth provider
 * subscribes and clears `user`.
 */
type SessionLostListener = () => void;
const sessionLostListeners = new Set<SessionLostListener>();

/** Subscribe to session loss. Returns an unsubscribe function. */
export function onSessionLost(listener: SessionLostListener): () => void {
  sessionLostListeners.add(listener);
  return () => sessionLostListeners.delete(listener);
}

function emitSessionLost(): void {
  // Copy first: a listener may unsubscribe itself while we iterate.
  for (const listener of [...sessionLostListeners]) {
    try {
      listener();
    } catch {
      /* a broken subscriber must not break the refresh path */
    }
  }
}

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

async function rawFetch(path: string, opts: ApiOptions): Promise<Response> {
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  return fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    credentials: "include",
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
}

async function performRefresh(): Promise<boolean> {
  const startedAt = epoch;
  // Distinguishes "an anonymous visitor has no cookie" (normal, silent) from
  // "a live session just died" (must notify subscribers).
  const hadToken = accessToken !== null;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "X-Apex-Client": "web" },
    });
  } catch {
    // Network/DNS failure, not a rejected session. Keep the token — it may still
    // be valid — and let the caller surface its own error.
    return false;
  }

  // Logged out while this was in flight: discard the result either way.
  if (epoch !== startedAt) return false;

  if (!res.ok) {
    accessToken = null;
    if (hadToken) emitSessionLost();
    return false;
  }

  const json = await res.json().catch(() => null);
  const next = (json?.data?.accessToken as string | undefined) ?? null;
  if (epoch !== startedAt) return false;
  accessToken = next;
  return next !== null;
}

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Rotate the session from the refresh cookie. Resolves to whether we now hold an
 * access token; never rejects.
 *
 * SINGLE-FLIGHT: concurrent callers share one request. The server rotates the
 * refresh cookie on every use and treats a second presentation of an
 * already-rotated token as a compromised family — it revokes the family and bumps
 * tokenVersion, killing every live access token (auth.service.ts refresh()). So
 * two parallel refreshes do not merely waste a round trip, they sign the user out
 * of every tab. De-duplicating here is the only thing preventing that whenever
 * several requests 401 at once, or when React Strict Mode double-invokes the
 * provider's mount effect in development.
 *
 * This is also why nothing may fetch /auth/refresh directly — go through here.
 */
export function refresh(): Promise<boolean> {
  refreshInFlight ??= performRefresh().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  let res = await rawFetch(path, opts);
  // Refresh once on expiry, then replay the request with the new token. Never for
  // /auth/* — a 401 there is a real credential failure, and routing /auth/refresh
  // back through here would recurse.
  if (res.status === 401 && !path.startsWith("/auth")) {
    if (await refresh()) res = await rawFetch(path, opts);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    throw new ApiError(json?.message ?? `Request failed (${res.status})`, res.status, json?.errors?.code);
  }
  return json.data as T;
}
