// Live ZIP availability lookup, shared by the /service-area page and the /book
// wizard's step-4 gate.
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
 *
 * `service` (a catalog slug) asks the per-service question instead of the general
 * one: coverage is granted per area and then overridden per ZIP, so a ZIP can be
 * inside an active area yet excluded for one service. The booking wizard always
 * passes it — it knows which service is being configured, and the general answer
 * would tell a customer "we serve you" only for the submit to waitlist them for
 * that service a step later.
 */
export async function checkZipAvailability(
  zip: string,
  opts: { service?: string; signal?: AbortSignal } = {},
): Promise<Availability> {
  const query = new URLSearchParams({ zip });
  if (opts.service) query.set('service', opts.service);
  const res = await fetch(`${API_BASE}/service-area/validate?${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: opts.signal,
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
  /**
   * Where the signup came from. `booking-flow` marks the highest-intent leads —
   * someone who configured a whole job before the ZIP gate turned them away — so
   * staff prioritising expansion can tell them apart from a drive-by ZIP check.
   */
  source?: 'service-area-miss' | 'service-area-page' | 'booking-flow';
}

/**
 * POST /waitlist. Idempotent server-side via @@unique([email, zip]): a repeat
 * signup resolves with created:false rather than erroring, so a double submit
 * is never punished with a failure state. The server emails an acknowledgement
 * on a genuinely new row (and only then).
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
