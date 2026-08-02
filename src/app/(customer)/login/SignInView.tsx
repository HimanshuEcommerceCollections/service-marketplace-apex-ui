'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '../../../components/auth/AuthShell';
import Field, { useField } from '../../../components/auth/Field';
import SocialRow from '../../../components/auth/SocialRow';
import { useCustomerAuth } from '../../lib/customer-auth';
import { ApiError } from '../../lib/api-client';

const emailOK = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function SignInView() {
  const { login, user, loading } = useCustomerAuth();
  const router = useRouter();
  const params = useSearchParams();
  // /login?next=/book returns the user where they were headed after signing in.
  const next = params.get('next');
  const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/my-bookings';

  const email = useField(emailOK);
  const password = useField((v) => v.length > 0);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace(dest);
  }, [loading, user, router, dest]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    // force() on every field first — && would short-circuit and skip the shake.
    const ok = [email.force(), password.force()].every(Boolean);
    if (!ok) return;

    setBusy(true);
    try {
      await login(email.value.trim(), password.value);
      router.replace(dest);
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : 'Sign in failed. Please try again.');
      setBusy(false);
    }
  }

  return (
    <AuthShell mode="login">
      <div className="auth-head">
        <h1>Welcome Back</h1>
        <p>Sign in to manage your bookings and service requests.</p>
      </div>

      <form className="auth-body" onSubmit={onSubmit} noValidate>
        {err && (
          <div className="auth-alert" role="alert">
            {err}
          </div>
        )}

        <Field field={email} id="liEmail" label="Email Address" type="email" autoComplete="email" message="Please enter a valid email address." />
        <Field field={password} id="liPass" label="Password" autoComplete="current-password" toggle tick={false} message="Please enter your password." />

        <div className="row-between" style={{ justifyContent: 'flex-end' }}>
          <Link className="link" href="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn btn-brand btn-block" disabled={busy}>
          <span className="btn-inner">
            {busy ? (
              <span className="spin" aria-hidden="true" />
            ) : (
              <>
                <span className="btn-label">Sign In</span>
                <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            )}
          </span>
        </button>

        <SocialRow />

        <p className="auth-foot">
          Don&apos;t have an account?{' '}
          <Link className="link" href="/signup">
            Create Account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
