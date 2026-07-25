import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { content } from '../../../data/services/power-washing/content';

// TODO(design): update metadata when the Power Washing design is delivered.
export const metadata: Metadata = {
  title: 'Power Washing — Apex Total Home Services',
  description: 'Driveways, siding, decks and walkways restored to like-new — priced up front, booked in about 90 seconds.',
};

export default function Page() {
  return <ServicePage config={content} />;
}
