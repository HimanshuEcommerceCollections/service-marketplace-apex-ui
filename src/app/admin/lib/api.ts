// Admin API client: the console's envelope + pagination helpers layered over
// the SHARED session in app/lib/api-client.
//
// It deliberately does NOT own an access token or its own refresh. There is one
// sign-in (/login) and one session for the whole app; a second in-memory token
// here would mean two providers racing to rotate the same refresh cookie, and
// the server treats a replayed refresh token as a compromised family — revoke
// every session and bump tokenVersion. Token storage and rotation live in
// app/lib/api-client; this module only adds `meta` unwrapping on top.
//
// API_BASE is imported from there too, so console calls go through the same
// same-origin proxy path. Pointing them at the API's own origin instead would make
// them cross-site, and the SameSite=Strict refresh cookie would not ride along on
// the retry after a 401.

import { API_BASE, ApiError, getAccessToken, refresh } from "../../lib/api-client";

export { ApiError, refresh, setAccessToken, getAccessToken } from "../../lib/api-client";

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

async function rawFetch(path: string, opts: ApiOptions): Promise<Response> {
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    credentials: "include",
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PageMeta;
  errors?: { code?: string };
}

async function request<T>(path: string, opts: ApiOptions): Promise<Envelope<T>> {
  let res = await rawFetch(path, opts);

  // Auto-refresh once on expiry — but never for /auth/* (a 401 there is real).
  if (res.status === 401 && !path.startsWith("/auth")) {
    if (await refresh()) res = await rawFetch(path, opts);
  }

  const json = (await res.json().catch(() => ({}))) as Envelope<T>;
  if (!res.ok || json?.success === false) {
    throw new ApiError(json?.message ?? `Request failed (${res.status})`, res.status, json?.errors?.code);
  }
  return json;
}

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  return (await request<T>(path, opts)).data;
}

/** List variant that also returns pagination meta. */
export async function apiWithMeta<T>(
  path: string,
  opts: ApiOptions = {},
): Promise<{ data: T; meta?: PageMeta }> {
  const json = await request<T>(path, opts);
  return { data: json.data, meta: json.meta };
}
