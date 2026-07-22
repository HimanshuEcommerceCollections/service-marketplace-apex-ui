import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import LawnCarePage from '../../../components/lawncare/LawnCarePage';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Lawn Care — Apex Total Home Services',
  description:
    'Mowing, edging and full lawn care, priced by lot size, handled by the same crew on the schedule you set.',
};

export default function Page() {
  return <LawnCarePage />;
}
