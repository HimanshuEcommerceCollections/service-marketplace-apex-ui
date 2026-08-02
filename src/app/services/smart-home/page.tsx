import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { overlayHeroPrice } from '../../../lib/catalog';
import { content } from '../../../data/services/smart-home/content';

// TODO(design): update metadata when the Smart Home design is delivered.
export const metadata: Metadata = {
  title: 'Smart Home — Apex Total Home Services',
  description: 'Thermostats, lighting, locks and cameras configured, connected and explained.',
};

export default async function Page() {
  return <ServicePage config={await overlayHeroPrice(content, 'smart-home')} />;
}
