// Live ZIP availability lookup for the service-area page.
//
// GET /service-area/validate?zip= resolves the ZIP against the ZipCode table,
// so the answer tracks whatever staff maintain in /admin/zip-codes. The page
// previously matched against a hardcoded array in data/service-area/content.ts,
// which had drifted to 29 ZIPs against 90 active in the database — real
// customers in served ZIPs were being told they were out of area.
//
// Public endpoint: no auth, so this deliberately does not go through
// app/lib/api-client (Bearer + refresh-on-401 buys nothing here).

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export interface Availability {
  zip: string;
  eligible: boolean;
  area: { name: string; slug: string } | null;
  reason: string | null;
}

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Throws on network failure or a non-2xx response. Callers must surface that as
 * "we couldn't check right now" — never as "not served", which would send a
 * serviceable customer to the waitlist on the strength of a dropped request.
 */
export async function checkZipAvailability(zip: string, signal?: AbortSignal): Promise<Availability> {
  const res = await fetch(`${API_BASE}/service-area/validate?zip=${encodeURIComponent(zip)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });
  const json = (await res.json().catch(() => null)) as Envelope<Availability> | null;
  if (!res.ok || !json?.success || !json.data) {
    throw new Error(json?.message ?? `ZIP lookup failed (${res.status})`);
  }
  return json.data;
}

export interface WaitlistInput {
  email: string;
  zip: string;
  name?: string;
  phone?: string;
  source?: 'service-area-miss' | 'service-area-page';
}

/**
 * POST /waitlist. Idempotent server-side via @@unique([email, zip]): a repeat
 * signup resolves with created:false rather than erroring, so a double submit
 * is never punished with a failure state.
 */
export async function joinWaitlist(
  input: WaitlistInput,
): Promise<{ created: boolean }> {
  const res = await fetch(`${API_BASE}/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(input),
  });
  const json = (await res.json().catch(() => null)) as
    | (Envelope<{ created: boolean }> & { errors?: { code?: string } })
    | null;
  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? `Could not join the waitlist (${res.status})`);
  }
  return { created: json.data?.created ?? true };
}
