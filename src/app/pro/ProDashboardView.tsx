'use client';

// /pro — placeholder dashboard for professionals.
//
// The real thing (assigned jobs from GET /me/... behind the server's
// booking:read:assigned capability) is not built yet, and neither is the
// onboarding that produces a verified professional: a pro submits a signup
// request and an admin or coordinator marks them verified. Until that ships
// `professionalVerified` is never sent by the server, so every professional
// sees the "verification pending" state here — which is the honest answer.
//
// The routing decision itself lives in lib/post-login-redirect so the sign-in
// forms and this page cannot disagree about who belongs where.

import { useEffect } from 'react';
import Link from 'next/link';
import SiteNav from '../../components/shared/SiteNav';
import SiteFooter from '../../components/shared/SiteFooter';
import { mountChrome } from '../../lib/shared/chrome';
import { useRoleGuard } from '../lib/use-role-guard';
import { isVerifiedPro } from '../lib/post-login-redirect';

/** Professionals only — customers and staff get routed to their own surface. */
const ALLOWED = ['PROFESSIONAL'] as const;

export default function ProDashboardView() {
  const { status, user } = useRoleGuard(ALLOWED);

  useEffect(() => {
    const dispose = mountChrome();
    return dispose;
  }, []);

  const body = () => {
    if (status !== 'allowed') {
      return <p className="pro-sub">{status === 'loading' ? 'Loading…' : 'Redirecting…'}</p>;
    }

    if (!isVerifiedPro(user)) {
      return (
        <div className="pro-panel">
          <span className="pro-badge">Verification pending</span>
          <h2>Your account is awaiting verification</h2>
          <p>
            An Apex coordinator reviews every professional before jobs can be assigned. You&apos;ll
            get an email as soon as your account is approved.
          </p>
          <Link className="pro-cta" href="/">
            Back to Apex
          </Link>
        </div>
      );
    }

    return (
      <div className="pro-panel">
        <span className="pro-badge is-verified">Verified</span>
        <h2>Your jobs are coming soon</h2>
        <p>Assigned bookings, schedule and job details will appear here.</p>
      </div>
    );
  };

  return (
    <div className="pg-pro">
      <SiteNav />
      <main className="pro-wrap">
        <div className="pro-head">
          <h1>Pro Dashboard</h1>
          <p className="pro-sub">Your assigned Apex jobs and schedule.</p>
        </div>
        {body()}
      </main>
      <SiteFooter />
    </div>
  );
}
