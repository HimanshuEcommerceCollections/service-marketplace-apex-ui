"use client";

// Customer session context. Mounted ONCE in the root layout (src/app/layout.tsx)
// so that every page — including the shared <SiteNav/> on the marketing pages —
// can read the session and render the Sign in link vs the account avatar.
//
// On mount it attempts a silent cookie refresh; `loading` stays true until that
// settles, which is what the nav uses to avoid flashing "Sign in" at a user who
// is in fact signed in.

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, onSessionLost, refresh, setAccessToken } from "./api-client";
import type { Role } from "./post-login-redirect";

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  emailVerified: boolean;
  /** Set once professional onboarding ships; absent means not verified. */
  professionalVerified?: boolean;
}

interface CustomerAuthState {
  user: CustomerUser | null;
  loading: boolean;
  /** Resolves with the signed-in user so callers can route on role immediately. */
  login: (email: string, password: string) => Promise<CustomerUser>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<CustomerUser>;
  logout: () => Promise<void>;
  /**
   * Re-read the session user from the server.
   *
   * Needed because `user` is fetched ONCE on mount, so any server-side change to
   * the profile is invisible to a tab that stays open. The concrete case is email
   * verification: /verify-email flips `emailVerifiedAt`, and without this the
   * "please verify your email" banner would keep nagging a customer who has just
   * verified, until they happened to reload.
   *
   * Silent on failure — this only ever refines what's already rendered, so a
   * dropped request must not clear a live session or surface an error.
   */
  refreshUser: () => Promise<void>;
}

/** Avatar label: first + last initial ("Ada Lovelace" → "AL"), single name → first two letters. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Ctx = createContext<CustomerAuthState | null>(null);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (await refresh()) {
          const me = await api<CustomerUser>("/me");
          if (active) setUser(me);
        }
      } catch {
        /* anonymous */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // A refresh can fail for a session this provider still believes is live — an
  // expired or revoked refresh token, or a tokenVersion bump. Without this the nav
  // would keep showing the account avatar for a session the server has already
  // thrown away, and every subsequent call would 401.
  useEffect(() => onSessionLost(() => setUser(null)), []);

  const login = async (email: string, password: string) => {
    const data = await api<{ user: CustomerUser; accessToken: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    const data = await api<{ user: CustomerUser; accessToken: string }>("/auth/register", {
      method: "POST",
      body: phone ? { name, email, password, phone } : { name, email, password },
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  // Stable identity: consumers call this from effects (the /verify-email page
  // does), and an inline function would re-fire them on every provider render.
  const refreshUser = useCallback(async () => {
    try {
      const me = await api<CustomerUser>("/me");
      setUser(me);
    } catch {
      /* leave the current user in place — see the doc comment */
    }
  }, []);

  const logout = async () => {
    try {
      // POST /auth/logout is behind `authenticate`, and api() never refreshes for
      // /auth/* paths — so an access token that expired mid-session would 401 and
      // the server would never revoke the refresh family. Rotate to a fresh access
      // token first (single-flight, so no loop), THEN log out so the family is
      // actually revoked. If the refresh fails the session is already dead
      // server-side, so there's nothing left to revoke — just clear local state.
      if (await refresh()) {
        await api("/auth/logout", { method: "POST" });
      }
    } catch {
      /* best-effort — local state is cleared regardless in finally */
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout, refreshUser }}>{children}</Ctx.Provider>
  );
}

export function useCustomerAuth(): CustomerAuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCustomerAuth must be used within <CustomerAuthProvider>");
  return ctx;
}
