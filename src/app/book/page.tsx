import type { Metadata } from 'next';
import { Suspense } from 'react';
import '../chrome.css';
import './booking.css';
import '../../components/payments/pay.css';
import BookingFlow from './BookingFlow';

export const metadata: Metadata = {
  // Preserved from the source document (apex-booking.html).
  title: 'Book a Service | Apex Total Home Services',
  description:
    "Book any of Apex's home services in a few steps. Configure, see live pricing, and request your booking.",
};

// API-driven booking flow (login-gated, live server pricing, real submit) on the
// apex-booking.html design: booking.css is that document's <style> block scoped
// under .pg-book, and BookingFlow renders its 5-step markup against the real
// endpoints. Its own nav/footer are dropped for the shared <SiteNav/>/<SiteFooter/>
// (chrome.css), per the porting rules in CLAUDE.md.
//
// The customer session comes from the root layout's CustomerAuthProvider — this
// route must NOT mount its own, or it would run a second, independent session.
export default function Page() {
  // BookingFlow reads ?service=/?plan= via useSearchParams — Suspense required.
  return (
    <Suspense fallback={<div className="pg-book" />}>
      <BookingFlow />
    </Suspense>
  );
}
