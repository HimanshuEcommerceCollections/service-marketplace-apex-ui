"use client";

import "../auth.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "../lib/api-client";

export default function AcceptInvitePage() {
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
      await api("/auth/accept-invite", { method: "POST", body: { token, password } });
      setDone(true);
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Failed to activate account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Set up your account</h1>
          <p className="sub">Choose a password to activate your Apex staff account.</p>
          {!token ? (
            <div className="auth-alert err">This invite link is invalid or incomplete.</div>
          ) : done ? (
            <>
              <div className="auth-alert ok">Account activated. You can sign in now.</div>
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
              <button className="auth-btn" disabled={busy}>{busy ? "Activating…" : "Activate account"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
