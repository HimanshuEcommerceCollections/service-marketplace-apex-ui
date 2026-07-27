"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, refresh, setAccessToken } from "./api";

export type Role = "CUSTOMER" | "PROFESSIONAL" | "COORDINATOR" | "ADMIN";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  emailVerified: boolean;
  mfaEnabled: boolean;
}

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (await refresh()) {
          const me = await api<AdminUser>("/me");
          if (active) setUser(me);
        }
      } catch {
        /* unauthenticated */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api<{ user: AdminUser; accessToken: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
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

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
