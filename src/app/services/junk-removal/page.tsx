import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { overlayHeroPrice } from '../../../lib/catalog';
import { content } from '../../../data/services/junk-removal/content';

// TODO(design): update metadata when the Junk Removal design is delivered.
export const metadata: Metadata = {
  title: 'Junk Removal — Apex Total Home Services',
  description: 'Furniture, appliances and debris lifted, loaded and hauled away — you point, we do the rest.',
};

export default async function Page() {
  return <ServicePage config={await overlayHeroPrice(content, 'junk-removal')} />;
}
