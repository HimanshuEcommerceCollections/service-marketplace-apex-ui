import type { Metadata } from 'next';
import '../../chrome.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { content } from '../../../data/services/tree-stump/content';

// TODO(design): update metadata when the Tree & Stump design is delivered.
export const metadata: Metadata = {
  title: 'Tree & Stump — Apex Total Home Services',
  description: 'Trimming, removal and stump grinding by insured crews with the right equipment.',
};

export default function Page() {
  return <ServicePage config={content} />;
}
