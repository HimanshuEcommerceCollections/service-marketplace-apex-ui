"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import { STAFF_ROLES } from "../lib/permissions";

/** Gate: only authenticated staff (coordinator/admin) may see the console. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading) return <div className="admin"><div className="ax-center">Loading…</div></div>;
  if (!user) return <div className="admin"><div className="ax-center">Redirecting…</div></div>;
  if (!STAFF_ROLES.includes(user.role)) {
    return <div className="admin"><div className="ax-center">This console is for Apex staff only.</div></div>;
  }
  return <>{children}</>;
}
