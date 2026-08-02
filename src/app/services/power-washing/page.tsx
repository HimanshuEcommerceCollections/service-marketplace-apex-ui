import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { overlayHeroPrice } from '../../../lib/catalog';
import { content } from '../../../data/services/power-washing/content';

// TODO(design): update metadata when the Power Washing design is delivered.
export const metadata: Metadata = {
  title: 'Power Washing — Apex Total Home Services',
  description: 'Driveways, siding, decks and walkways restored to like-new — priced up front, booked in about 90 seconds.',
};

export default async function Page() {
  return <ServicePage config={await overlayHeroPrice(content, 'power-washing')} />;
}
