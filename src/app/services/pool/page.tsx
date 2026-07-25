import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { content } from '../../../data/services/pool/content';

// TODO(design): update metadata when the Pool Service design is delivered.
export const metadata: Metadata = {
  title: 'Pool Service — Apex Total Home Services',
  description: 'Skimming, vacuuming, brushing and chemical balancing on a schedule that fits your pool.',
};

export default function Page() {
  return <ServicePage config={content} />;
}
