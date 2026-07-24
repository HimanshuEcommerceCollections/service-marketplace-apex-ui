import type { Metadata } from 'next';
import '../chrome.css';
import './membership.css';
import '../testimonials.css';
import MembershipPage from '../../components/membership/MembershipPage';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Membership Plans — Apex Total Home Services',
  description:
    'One membership for cleaning, lawn, pool and pest — the same trusted pros on an automatic schedule at member pricing. No contracts.',
};

export default function Page() {
  return <MembershipPage />;
}
