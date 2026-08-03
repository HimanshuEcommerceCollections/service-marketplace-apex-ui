import type { Metadata } from 'next';
import '../../chrome.css';
import '../../cta-band.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { overlayServicePage } from '../../../lib/catalog';
import { content } from '../../../data/services/handyman/content';

// TODO(design): update metadata when the Handyman design is delivered.
export const metadata: Metadata = {
  title: 'Handyman — Apex Total Home Services',
  description: 'Repairs, mounting, assembly and odd jobs around the house, booked by the block of time.',
};

export default async function Page() {
  return <ServicePage config={await overlayServicePage(content, 'handyman')} />;
}
