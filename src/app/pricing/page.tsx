import type { Metadata } from 'next';
import '../chrome.css';
import './pricing.css';
import PricingPage from '../../components/pricing/PricingPage';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Pricing — Apex Total Home Services',
  description:
    'Simple, transparent pricing for every Apex home service. Compare plans, estimate your cost, and book with no hidden fees.',
};

export default function Page() {
  return <PricingPage />;
}
