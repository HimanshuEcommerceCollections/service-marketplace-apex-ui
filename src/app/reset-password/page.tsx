"use client";

import "../auth.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "../lib/api-client";

export default function ResetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token"));
  }, []);

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
