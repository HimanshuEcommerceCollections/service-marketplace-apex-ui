"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, refresh, setAccessToken } from "../lib/api-client";

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
}

interface CustomerAuthState {
  user: CustomerUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

  const login = async (email: string, password: string) => {
    const data = await api<{ user: CustomerUser; accessToken: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await api<{ user: CustomerUser; accessToken: string }>("/auth/register", {
      method: "POST",
      body: { name, email, password },
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

  return <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>;
}

export function useCustomerAuth(): CustomerAuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCustomerAuth must be used within <CustomerAuthProvider>");
  return ctx;
}
