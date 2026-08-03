// THE API client for the whole app — customer surface and staff console alike:
// in-memory access token + refresh-on-401 + envelope unwrap.
//
// There is one sign-in (/login) and therefore one session. The access token and
// the refresh rotation must live in exactly one module: the refresh cookie
// rotates on every use and the server treats a replayed refresh token as a
// compromised family (revoke + tokenVersion bump — auth.service.ts refresh()),
// so two clients each holding their own token would eventually race on the same
// cookie and log the user out. The admin client layers its pagination helpers
// over this module rather than duplicating it.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => {
  accessToken = t;
};
export const getAccessToken = () => accessToken;

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

export async function refresh(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "X-Apex-Client": "web" },
  });
  if (!res.ok) {
    accessToken = null;
    return false;
  }
  const json = await res.json();
  accessToken = json?.data?.accessToken ?? null;
  return accessToken !== null;
}

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  let res = await rawFetch(path, opts);
  if (res.status === 401 && !path.startsWith("/auth")) {
    if (await refresh()) res = await rawFetch(path, opts);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    throw new ApiError(json?.message ?? `Request failed (${res.status})`, res.status, json?.errors?.code);
  }
  return json.data as T;
}
