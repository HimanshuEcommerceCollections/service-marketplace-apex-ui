import type { Metadata } from 'next';
import '../chrome.css';
import './booking.css';
import BookingPage from '../../components/booking/BookingPage';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Book a Service — Apex Total Home Services',
  description:
    "Book any of Apex's 11 home services in a few steps. Configure, see live pricing, and request your booking.",
};

export default function Page() {
  return <BookingPage />;
}
