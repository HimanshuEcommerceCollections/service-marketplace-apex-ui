'use client';

// /accept-invite?token=… — a staff member completing their invite.
//
// Previously rendered on the legacy auth.css sheet (generic teal card), which
// looked nothing like /login and /signup after those were redesigned. It now
// uses the same AuthShell + Field the customer auth pages do, minus the
// Sign In / Create Account switcher: this account already exists, and there is
// nowhere for an invitee to switch to.

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '../../components/auth/AuthShell';
import Field, { useField } from '../../components/auth/Field';
import { api, ApiError } from '../lib/api-client';

export default function AcceptInviteView() {
  const token = useSearchParams().get('token');
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const password = useField((v) => v.length >= 8);
  const confirm = useField((v) => v.length > 0 && v === password.value);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    // force() on every field first — && would short-circuit and skip the shake.
    const ok = [password.force(), confirm.force()].every(Boolean);
    if (!ok) return;

    setBusy(true);
    try {
      await api('/auth/accept-invite', { method: 'POST', body: { token, password: password.value } });
      setDone(true);
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : 'Failed to activate account.');
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <div className="auth-head">
        <h1>Set Up Your Account</h1>
        <p>Choose a password to activate your Apex staff account.</p>
      </div>

      {!token ? (
        <div className="auth-body">
          <div className="auth-alert" role="alert">
            This invite link is invalid or incomplete. Ask an administrator to send a new invitation.
          </div>
        </div>
      ) : done ? (
        <div className="auth-body">
          <div className="auth-alert ok" role="status">
            Account activated. You can sign in now.
          </div>
          <p className="auth-foot">
            <Link className="link" href="/login">
              Go to sign in →
            </Link>
          </p>
        </div>
      ) : (
        <form className="auth-body" onSubmit={onSubmit} noValidate>
          {err && (
            <div className="auth-alert" role="alert">
              {err}
            </div>
          )}

          <Field
            field={password}
            id="ivPass"
            label="New password"
            autoComplete="new-password"
            toggle
            message="Use at least 8 characters."
          />
          <Field
            field={confirm}
            id="ivConfirm"
            label="Confirm password"
            autoComplete="new-password"
            toggle
            message="Passwords don’t match."
          />

          <button type="submit" className="btn btn-brand btn-block" disabled={busy}>
            <span className="btn-inner">
              {busy ? (
                <span className="spin" aria-hidden="true" />
              ) : (
                <>
                  <span className="btn-label">Activate account</span>
                  <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </span>
          </button>

          <p className="auth-foot">
            Already activated?{' '}
            <Link className="link" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
