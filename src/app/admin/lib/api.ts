// Admin API client: attaches the in-memory access token, transparently refreshes
// on 401, and unwraps the { success, message, data } envelope. The refresh token
// lives in an httpOnly cookie (credentials: "include"); the access token is held
// in memory only (never localStorage) — matches the server auth design (07 §3).

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

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

/** Exchange the refresh cookie for a fresh access token. Returns success. */
export async function refresh(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "X-Apex-Client": "admin" },
  });
  if (!res.ok) {
    accessToken = null;
    return false;
  }
  const json = await res.json();
  accessToken = json?.data?.accessToken ?? null;
  return accessToken !== null;
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
