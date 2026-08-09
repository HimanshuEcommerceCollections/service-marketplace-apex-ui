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
import { onSessionLost } from './api-client';

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

  // A deliberate logout clears `user` directly and navigates home itself; an
  // expired/revoked refresh instead fires onSessionLost. Tracking that lets us
  // tell the two apart: on an involuntary loss we send the user to /login rather
  // than stranding the page on "Redirecting…" forever, without racing logout's
  // own navigation.
  const sessionLost = useRef(false);
  useEffect(() => onSessionLost(() => { sessionLost.current = true; }), []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Arrived signed-out, or a live session died mid-visit — either way there's
      // nothing to render, so route to /login (never loop /login onto itself).
      const involuntary = !everSignedIn.current || sessionLost.current;
      if (involuntary && pathname !== '/login') {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
      return;
    }
    if (!allowed.includes(user.role)) router.replace(destinationFor(user));
  }, [loading, user, router, pathname, allowed]);

  if (loading) return { status: 'loading', user: null };
  if (!user || !allowed.includes(user.role)) return { status: 'redirecting', user: null };
  return { status: 'allowed', user };
}
