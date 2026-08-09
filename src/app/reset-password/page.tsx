"use client";

import "../auth.css";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "../lib/api-client";

function ResetPasswordForm() {
  // Read synchronously from the URL so a valid link never flashes the
  // invalid-token error on first render (the old mount-effect read left `token`
  // null for one render). useSearchParams is available on the client render;
  // the Suspense boundary below keeps static prerendering happy.
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords don't match.");
    setBusy(true);
    try {
      await api("/auth/reset-password", { method: "POST", body: { token, password } });
      setDone(true);
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Reset password</h1>
          <p className="sub">Choose a new password for your account.</p>
          {!token ? (
            <div className="auth-alert err">This reset link is invalid or has expired.</div>
          ) : done ? (
            <>
              <div className="auth-alert ok">Password updated. Please sign in again.</div>
              <p className="auth-foot"><Link href="/login">Go to sign in →</Link></p>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              {err && <div className="auth-alert err">{err}</div>}
              <div className="auth-field">
                <label htmlFor="pw">New password</label>
                <input id="pw" className="auth-input" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
              <div className="auth-field">
                <label htmlFor="cf">Confirm password</label>
                <input id="cf" className="auth-input" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <button className="auth-btn" disabled={busy}>{busy ? "Updating…" : "Update password"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="auth" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
