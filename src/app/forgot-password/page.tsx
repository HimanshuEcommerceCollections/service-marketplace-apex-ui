"use client";

import "../auth.css";
import { useState } from "react";
import Link from "next/link";
import { api, ApiError } from "../lib/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await api("/auth/forgot-password", { method: "POST", body: { email: email.trim() } });
      setSent(true);
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Forgot password</h1>
          <p className="sub">We&apos;ll email you a reset link.</p>
          {sent ? (
            <>
              <div className="auth-alert ok">If an account exists for that email, a reset link is on its way.</div>
              <p className="auth-foot"><Link href="/login">Back to sign in</Link></p>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              {err && <div className="auth-alert err">{err}</div>}
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input id="email" className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button className="auth-btn" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
              <p className="auth-foot"><Link href="/login">Back to sign in</Link></p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
