import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import CleaningPage from '../../../components/cleaning/CleaningPage';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Cleaning — Apex Total Home Services',
  description:
    'Recurring or one-time cleans, priced by beds and baths, handled by the same trusted team every visit.',
};

export default function HouseCleaningPage() {
  return <CleaningPage />;
}
