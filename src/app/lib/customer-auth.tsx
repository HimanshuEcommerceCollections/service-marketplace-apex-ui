"use client";

// Customer session context. Mounted ONCE in the root layout (src/app/layout.tsx)
// so that every page — including the shared <SiteNav/> on the marketing pages —
// can read the session and render the Sign in link vs the account avatar.
//
// On mount it attempts a silent cookie refresh; `loading` stays true until that
// settles, which is what the nav uses to avoid flashing "Sign in" at a user who
// is in fact signed in.

import { createContext, useContext, useEffect, useState } from "react";
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

  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setAccessToken(null);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>;
}

export function useCustomerAuth(): CustomerAuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCustomerAuth must be used within <CustomerAuthProvider>");
  return ctx;
}
