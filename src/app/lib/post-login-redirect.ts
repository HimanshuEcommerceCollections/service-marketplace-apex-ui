// Single source of truth for "where does this user belong after signing in?".
//
// There is ONE sign-in for every role: /login. The server's POST /auth/login is
// role-blind, so the destination is decided here, from the role that comes back
// in the login response — no extra round trip needed.
//
// Shared by /login, the customer-side useRoleGuard, and the console's
// RequireAuth gate, so the rules can't drift between surfaces.

export type Role = 'CUSTOMER' | 'PROFESSIONAL' | 'COORDINATOR' | 'ADMIN';

/** Roles that belong in the operations console. Mirrors STAFF_ROLES on the server. */
export const STAFF_ROLES: readonly string[] = ['COORDINATOR', 'ADMIN'];

export const ADMIN_HOME = '/admin';
export const CUSTOMER_HOME = '/my-bookings';
export const PRO_HOME = '/pro';
export const SITE_HOME = '/';

/**
 * The slice of the session user this module needs.
 *
 * `professionalVerified` is NOT sent by the server yet — professional
 * onboarding (pro submits a signup request, an admin or coordinator marks them
 * verified) is still to be built. Until that schema lands the field is absent,
 * which reads as unverified, so professionals go to the public site rather than
 * the pro dashboard. Once the server starts sending the flag this file needs no
 * change: that is the whole point of routing through one predicate.
 */
export interface RoutableUser {
  role: string;
  professionalVerified?: boolean;
}

/**
 * Reject anything that isn't a clean same-origin relative path so `?next=` can't
 * be turned into an open redirect. "//evil.com" is protocol-relative, and
 * "/\evil.com" is normalised to "//evil.com" by browsers — both escape the
 * origin. We reject those, backslashes, and control characters, then resolve the
 * remainder against a dummy origin and confirm it stayed local, returning the
 * cleaned path (pathname + search + hash).
 */
export function safeNext(next: string | null | undefined): string | null {
  if (!next) return null;
  if (!next.startsWith('/') || next.startsWith('//')) return null;
  if (next.includes('\\')) return null;
  // Strip-then-resolve parsers (and the URL constructor) drop control chars,
  // which can change what the path resolves to — reject them outright.
  for (let i = 0; i < next.length; i++) {
    const code = next.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) return null;
  }
  // Belt and braces: resolve against a dummy origin and confirm it stayed local.
  try {
    const url = new URL(next, 'http://localhost');
    if (url.origin !== 'http://localhost') return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}

export function isStaff(role: string): boolean {
  return STAFF_ROLES.includes(role);
}

export function isVerifiedPro(user: RoutableUser): boolean {
  return user.role === 'PROFESSIONAL' && user.professionalVerified === true;
}

/**
 * Where `user` goes after a successful sign-in.
 *
 * `next` — the page they were heading for before being bounced to sign-in —
 * wins for customers. For staff it only wins when it already points into the
 * console, otherwise an admin arriving via /login?next=/book would land on the
 * customer site instead of the dashboard they signed in to reach.
 */
export function destinationFor(user: RoutableUser, next?: string | null): string {
  const target = safeNext(next);

  if (isStaff(user.role)) {
    return target && target.startsWith(ADMIN_HOME) ? target : ADMIN_HOME;
  }

  if (user.role === 'PROFESSIONAL') {
    // Unverified pros land on the public site; /pro itself explains that
    // verification is pending if they navigate there directly.
    return isVerifiedPro(user) ? PRO_HOME : SITE_HOME;
  }

  // CUSTOMER — and any role we don't recognise — is treated as a customer.
  return target ?? CUSTOMER_HOME;
}
