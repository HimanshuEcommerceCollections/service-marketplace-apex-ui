import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import CleaningPage from '../../../components/cleaning/CleaningPage';
import { getRecurringSection, livePrice } from '../../../lib/catalog';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Cleaning — Apex Total Home Services',
  description:
    'Recurring or one-time cleans, priced by beds and baths, handled by the same trusted team every visit.',
};

export default async function HouseCleaningPage() {
  return (
    <CleaningPage heroPrice={await livePrice('cleaning')} recurring={await getRecurringSection('cleaning')} />
  );
}
