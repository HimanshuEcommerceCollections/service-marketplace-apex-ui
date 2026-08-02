'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '../../../components/auth/AuthShell';
import Field, { useField } from '../../../components/auth/Field';
import SocialRow from '../../../components/auth/SocialRow';
import { useCustomerAuth } from '../../lib/customer-auth';
import { ApiError } from '../../lib/api-client';

const emailOK = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const phoneOK = (v: string) => v.replace(/[^0-9]/g, '').length >= 10;

const STRENGTH_LABELS = ['Password strength', 'Weak', 'Fair', 'Good', 'Strong'];
function strength(v: string): number {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v) && v.length >= 10) s++;
  return s;
}

export default function SignUpView() {
  const { signup, user, loading } = useCustomerAuth();
  const router = useRouter();

  const name = useField((v) => v.trim().length >= 2);
  const email = useField(emailOK);
  const phone = useField(phoneOK);
  const password = useField((v) => v.length >= 8);
  // Confirm re-reads `password.value` on every render, so editing the first field
  // re-evaluates the match without any extra wiring.
  const confirm = useField((v) => v.length > 0 && v === password.value);

  const [agree, setAgree] = useState(false);
  const [agreeErr, setAgreeErr] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const s = strength(password.value);

  useEffect(() => {
    if (!loading && user) router.replace('/my-bookings');
  }, [loading, user, router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    // Evaluate every field (no short-circuit) so all invalid ones shake at once.
    const fieldsOK = [name.force(), email.force(), phone.force(), password.force(), confirm.force()].every(Boolean);
    setAgreeErr(!agree);
    if (!fieldsOK || !agree) return;

    setBusy(true);
    try {
      await signup(name.value.trim(), email.value.trim(), password.value, phone.value.trim());
      router.replace('/my-bookings');
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : 'Sign up failed. Please try again.');
      setBusy(false);
    }
  }

  return (
    <AuthShell mode="signup">
      <div className="auth-head">
        <h1>Create Your Apex Account</h1>
        <p>Create an account to book services, manage requests, and track appointments.</p>
      </div>

      <form className="auth-body" onSubmit={onSubmit} noValidate>
        {err && (
          <div className="auth-alert" role="alert">
            {err}
          </div>
        )}

        <Field field={name} id="suName" label="Full Name" autoComplete="name" message="Please enter your full name." />
        <Field field={email} id="suEmail" label="Email Address" type="email" autoComplete="email" message="Please enter a valid email address." />
        <Field field={phone} id="suPhone" label="Phone Number" type="tel" autoComplete="tel" message="Please enter a valid phone number." />

        <Field field={password} id="suPass" label="Password" autoComplete="new-password" toggle tick={false} message="Use at least 8 characters.">
          <div className="meter" data-s={s} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="meter-lab">{STRENGTH_LABELS[s]}</div>
        </Field>

        <Field field={confirm} id="suPass2" label="Confirm Password" autoComplete="new-password" toggle message="Passwords don't match." />

        <label className={`chk${agreeErr ? ' err' : ''}`}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              if (e.target.checked) setAgreeErr(false);
            }}
          />
          <span className="box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          {/* Placeholder targets, matching the footer's Privacy/Terms links —
              there are no legal routes yet. */}
          <span className="txt">
            I agree to the <a className="link" href="#">Privacy Policy</a> and{' '}
            <a className="link" href="#">Terms</a>.
          </span>
        </label>

        <button type="submit" className="btn btn-brand btn-block" disabled={busy}>
          <span className="btn-inner">
            {busy ? (
              <span className="spin" aria-hidden="true" />
            ) : (
              <>
                <span className="btn-label">Create Account</span>
                <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            )}
          </span>
        </button>

        <SocialRow />

        <p className="auth-foot">
          Already have an account?{' '}
          <Link className="link" href="/login">
            Sign In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
