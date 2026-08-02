import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { overlayHeroPrice } from '../../../lib/catalog';
import { content } from '../../../data/services/painting/content';

// TODO(design): update metadata when the Painting design is delivered.
export const metadata: Metadata = {
  title: 'Painting — Apex Total Home Services',
  description: 'Interior and exterior painting with clean lines and tidy crews, priced up front before we start.',
};

export default async function Page() {
  return <ServicePage config={await overlayHeroPrice(content, 'painting')} />;
}
