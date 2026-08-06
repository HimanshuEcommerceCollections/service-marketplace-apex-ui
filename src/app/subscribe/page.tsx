import type { Metadata } from 'next';
import { Suspense } from 'react';
import '../chrome.css';
import '../book/booking.css';
import SubscribeView from './SubscribeView';

export const metadata: Metadata = {
  title: 'Subscribe — Apex Total Home Services',
  description: 'Start an Apex membership plan: pick your details and subscribe with secure checkout.',
  robots: { index: false, follow: false },
};

export default function Page() {
  // SubscribeView reads ?plan= via useSearchParams — Suspense required.
  return (
    <Suspense fallback={<div className="pg-book" />}>
      <SubscribeView />
    </Suspense>
  );
}
