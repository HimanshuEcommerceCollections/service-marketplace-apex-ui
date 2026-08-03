import type { Metadata } from 'next';
import { Suspense } from 'react';
import '../../auth-pro.css';
import SignInView from './SignInView';

export const metadata: Metadata = {
  title: 'Sign In — Apex Total Home Services',
  description: 'Sign in to your Apex account to manage bookings and service requests.',
  robots: { index: false, follow: false },
};

export default function Page() {
  // SignInView reads ?next= via useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense fallback={<div className="apexauth" />}>
      <SignInView />
    </Suspense>
  );
}
