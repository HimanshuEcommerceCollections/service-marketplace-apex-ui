"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomerAuth } from "../customer-auth";
import { ApiError } from "../../lib/api-client";

export default function CustomerLoginPage() {
  const { login, user, loading } = useCustomerAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/account");
  }, [loading, user, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
      router.replace("/account");
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="sub">Sign in to your Apex account</p>
          {err && <div className="auth-alert err">{err}</div>}
          <form onSubmit={onSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input id="email" className="auth-input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input id="password" className="auth-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="auth-btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
          <p className="auth-foot"><Link href="/forgot-password">Forgot password?</Link></p>
          <p className="auth-foot">New to Apex? <Link href="/signup">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
