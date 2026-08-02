import type { Metadata } from 'next';
import '../chrome.css';
import './my-bookings.css';
import MyBookingsView from './MyBookingsView';

export const metadata: Metadata = {
  title: 'My Bookings — Apex Total Home Services',
  description: 'Your Apex booking history: services requested, references, schedule and status.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MyBookingsView />;
}
