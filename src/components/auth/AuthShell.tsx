/* eslint-disable @next/next/no-img-element */
'use client';

// Split-screen shell shared by /login and /signup: the dark showcase panel on the
// left, the card on the right. The segmented Sign In / Create Account control is
// real routing (two <Link>s) rather than in-page view swapping, so both routes,
// their metadata and any deep links keep working — the pill just slides based on
// `mode`.

import Link from 'next/link';
import { useEffect } from 'react';
import { mountAuth } from '../../lib/auth/runtime';

const CHIPS = [
  {
    title: 'Trusted Local Professionals',
    body: 'Vetted Wake County pros.',
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: 'Secure Account',
    body: 'Your details stay protected.',
    icon: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  {
    title: 'Manage Your Services',
    body: 'Requests in one place.',
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    title: 'Fast Booking',
    body: 'Schedule in minutes.',
    icon: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  },
];

export default function AuthShell({
  mode,
  children,
}: {
  mode: 'login' | 'signup';
  children: React.ReactNode;
}) {
  useEffect(() => mountAuth(), []);

  return (
    <div className="apexauth">
      <div className="apexauth-grid">
        {/* ---------- left showcase ---------- */}
        <aside className="show">
          <div className="show-grid" aria-hidden="true" />
          <div className="show-grain" aria-hidden="true" />
          <canvas className="show-particles" aria-hidden="true" />

          <Link href="/" className="brand" aria-label="Apex Total Home Services home">
            <span className="bmark" aria-hidden="true">
              <img src="/assets/images/image-1.png" alt="" />
            </span>
            <span className="bname">
              Apex<small>Total Home Services</small>
            </span>
          </Link>

          <div className="show-mid">
            <p className="eyebrow reveal" style={{ color: 'rgba(255,255,255,.85)' }}>
              Your Home, Handled
            </p>
            <h2 className="reveal">
              Every home service.
              <br />
              One trusted account.
            </h2>
            <p className="reveal">
              Book services, manage requests, and track appointments with professionals across Wake County.
            </p>
            <div className="show-chips">
              {CHIPS.map((c) => (
                <div className="chip reveal" key={c.title}>
                  <span className="chip-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      {c.icon}
                    </svg>
                  </span>
                  <div>
                    <h4>{c.title}</h4>
                    <p>{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="show-foot">
            <span>© 2026 Apex Total Home Services</span>
            <span className="dot" />
            <span>Wake County, NC</span>
            <span className="dot" />
            <span>Licensed · Bonded · Insured</span>
          </div>
        </aside>

        {/* ---------- right pane ---------- */}
        <main className="pane">
          <div className="auth-card">
            <div className={`seg${mode === 'signup' ? ' signup' : ''}`}>
              <span className="seg-pill" aria-hidden="true" />
              <Link href="/login" className={mode === 'login' ? 'on' : ''} aria-current={mode === 'login' ? 'page' : undefined}>
                Sign In
              </Link>
              <Link href="/signup" className={mode === 'signup' ? 'on' : ''} aria-current={mode === 'signup' ? 'page' : undefined}>
                Create Account
              </Link>
            </div>
            <section className="view">{children}</section>
          </div>
        </main>
      </div>
    </div>
  );
}
