"use client";

// The console reads the SAME session as the rest of the app.
//
// There used to be a second AuthProvider here with its own access token and its
// own refresh-on-mount. Because CustomerAuthProvider lives in the root layout it
// also mounts on /admin/*, so both providers refreshed the same rotating cookie
// on every console page load — and the server treats a replayed refresh token as
// a compromised family (revoke + tokenVersion bump), which signs the user out.
// One sign-in, one provider, one token.
//
// This module stays as the console's import surface so the pages that already
// call useAuth() don't each have to know where the session comes from.

import { useCustomerAuth, type CustomerUser } from "../../lib/customer-auth";

export type { Role } from "../../lib/post-login-redirect";

/** The console's view of the session user (the app-wide user; alias kept for clarity). */
export type AdminUser = CustomerUser;

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const { user, loading, logout } = useCustomerAuth();
  return { user, loading, logout };
}
