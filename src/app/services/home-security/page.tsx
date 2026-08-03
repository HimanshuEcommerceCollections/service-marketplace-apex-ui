import type { Metadata } from 'next';
import '../../chrome.css';
import '../../cta-band.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { overlayServicePage } from '../../../lib/catalog';
import { content } from '../../../data/services/home-security/content';

// TODO(design): update metadata when the Home Security design is delivered.
export const metadata: Metadata = {
  title: 'Home Security — Apex Total Home Services',
  description: 'Cameras, sensors and monitoring, tailored to your home and set up by trained pros.',
};

export default async function Page() {
  return <ServicePage config={await overlayServicePage(content, 'home-security')} />;
}
