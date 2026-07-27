"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomerAuth } from "../customer-auth";
import { ApiError } from "../../lib/api-client";

export default function CustomerSignupPage() {
  const { signup, user, loading } = useCustomerAuth();
  const router = useRouter();
  const [name, setName] = useState("");
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
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      await signup(name.trim(), email.trim(), password);
      router.replace("/account");
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Sign up failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p className="sub">Book and manage Apex home services</p>
          {err && <div className="auth-alert err">{err}</div>}
          <form onSubmit={onSubmit}>
            <div className="auth-field">
              <label htmlFor="name">Full name</label>
              <input id="name" className="auth-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input id="email" className="auth-input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input id="password" className="auth-input" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <button className="auth-btn" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
          </form>
          <p className="auth-foot">Already have an account? <Link href="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
