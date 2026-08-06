import type { Metadata } from 'next';
import { Suspense } from 'react';
import '../chrome.css';
import './my-bookings.css';
import '../../components/payments/pay.css';
import MyBookingsView from './MyBookingsView';

export const metadata: Metadata = {
  title: 'My Bookings | Apex Total Home Services',
  description: 'Your Apex booking history: services requested, references, schedule and status.',
  robots: { index: false, follow: false },
};

export default function Page() {
  // MyBookingsView reads Stripe redirect params via useSearchParams — Suspense required.
  return (
    <Suspense fallback={<div className="pg-mybookings" />}>
      <MyBookingsView />
    </Suspense>
  );
}
