import type { Metadata } from 'next';
import BookingFlow from './BookingFlow';

export const metadata: Metadata = {
  title: 'Book a Service — Apex Total Home Services',
  description:
    "Book any of Apex's home services: sign in, configure, see live pricing, and request your booking.",
};

// API-driven booking flow (login-gated, live server pricing, real submit).
// The customer session comes from the root layout's CustomerAuthProvider — this
// route must NOT mount its own, or it would run a second, independent session.
// The earlier GSAP/vanilla-JS design (BookingPage.tsx + lib/booking/runtime.js)
// is retained for future re-skinning but no longer wired to this route.
export default function Page() {
  return <BookingFlow />;
}
