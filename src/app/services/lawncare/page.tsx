import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import LawnCarePage from '../../../components/lawncare/LawnCarePage';
import { livePrice } from '../../../lib/catalog';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Lawn Care — Apex Total Home Services',
  description:
    'Mowing, edging and full lawn care, priced by lot size, handled by the same crew on the schedule you set.',
};

export default async function Page() {
  return <LawnCarePage heroPrice={await livePrice('lawn-care')} />;
}
