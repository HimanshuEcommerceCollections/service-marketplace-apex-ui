import type { Metadata } from 'next';
import '../../chrome.css';
import '../../cta-band.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { overlayServicePage } from '../../../lib/catalog';
import { content } from '../../../data/services/tree-stump/content';

// TODO(design): update metadata when the Tree & Stump design is delivered.
export const metadata: Metadata = {
  title: 'Tree & Stump — Apex Total Home Services',
  description: 'Trimming, removal and stump grinding by insured crews with the right equipment.',
};

export default async function Page() {
  return <ServicePage config={await overlayServicePage(content, 'tree-stump')} />;
}
