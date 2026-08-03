"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import { STAFF_ROLES } from "../lib/permissions";
import { destinationFor } from "../../lib/post-login-redirect";

/**
 * Gate: only authenticated staff (coordinator/admin) may see the console.
 *
 * There is a single sign-in for the whole app, so an unauthenticated visitor
 * goes to /login with `next` set — which routes them straight back here once
 * they authenticate as staff, and to their own surface if they aren't.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    // Signed in, wrong surface: send them to the one that is theirs instead of
    // stranding them on a "staff only" message with nowhere to go.
    if (!STAFF_ROLES.includes(user.role)) router.replace(destinationFor(user));
  }, [loading, user, router, pathname]);

  if (loading) return <div className="admin"><div className="ax-center">Loading…</div></div>;
  if (!user || !STAFF_ROLES.includes(user.role)) {
    return <div className="admin"><div className="ax-center">Redirecting…</div></div>;
  }
  return <>{children}</>;
}
