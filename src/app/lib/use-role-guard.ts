'use client';

// Role gate for the customer-side surfaces, the counterpart to the console's
// <RequireAuth>. Typing a URL you have no business on — a professional opening
// /my-bookings, a coordinator opening /pro — sends you to your own surface
// instead of leaving you on a page that will only ever fail to load.
//
// Returned as a discriminated union so `status === 'allowed'` narrows `user` to
// non-null: callers get the session user without a second useCustomerAuth call,
// and can hold their data fetches until the role actually checks out.
//
// This is a UX gate, not a security boundary — same as <RequireAuth>. The real
// enforcement is the API's authenticate + authorize pair; every /me/* route is
// ownership-scoped server-side regardless of what the client renders.

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCustomerAuth, type CustomerUser } from './customer-auth';
import { destinationFor } from './post-login-redirect';

export type RoleGuard =
  | { status: 'loading'; user: null }
  | { status: 'redirecting'; user: null }
  | { status: 'allowed'; user: CustomerUser };

/**
 * Guard the current page to `allowed` roles.
 *
 * Pass a module-scope constant for `allowed` — an inline array literal is a new
 * identity every render and re-runs the effect needlessly.
 */
export function useRoleGuard(allowed: readonly string[]): RoleGuard {
  const { user, loading } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();

  // `user` also drops to null when the navbar menu logs out, and that redirects
  // home on its own. Without this the signed-out branch would race it and win,
  // bouncing to /login instead. Only guard the arrive-signed-out case.
  const everSignedIn = useRef(false);
  useEffect(() => {
    if (user) everSignedIn.current = true;
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      if (!everSignedIn.current) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allowed.includes(user.role)) router.replace(destinationFor(user));
  }, [loading, user, router, pathname, allowed]);

  if (loading) return { status: 'loading', user: null };
  if (!user || !allowed.includes(user.role)) return { status: 'redirecting', user: null };
  return { status: 'allowed', user };
}
