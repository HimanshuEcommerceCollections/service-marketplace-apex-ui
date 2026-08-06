import type { Metadata } from 'next';
import { Suspense } from 'react';
import '../auth-pro.css';
import AcceptInviteView from './AcceptInviteView';

export const metadata: Metadata = {
  title: 'Set Up Your Account | Apex Total Home Services',
  description: 'Activate your Apex staff account.',
  robots: { index: false, follow: false },
};

export default function Page() {
  // AcceptInviteView reads ?token= via useSearchParams, which needs a Suspense
  // boundary. The fallback keeps the shell's background rather than flashing white.
  return (
    <Suspense fallback={<div className="apexauth" />}>
      <AcceptInviteView />
    </Suspense>
  );
}
