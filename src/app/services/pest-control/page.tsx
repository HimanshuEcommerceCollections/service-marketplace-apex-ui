import type { Metadata } from 'next';
import '../../chrome.css';
import '../../cta-band.css';
import '../service.css';
import '../../testimonials.css';
import ServicePage from '../../../components/service/ServicePage';
import { getRecurringOptions, overlayServicePage } from '../../../lib/catalog';
import { content } from '../../../data/services/pest-control/content';

// TODO(design): update metadata when the Pest Control design is delivered.
export const metadata: Metadata = {
  title: 'Pest Control | Apex Total Home Services',
  description: 'Interior and exterior treatments and ongoing protection, safe for family and pets.',
};

export default async function Page() {
  return (
    <ServicePage
      config={await overlayServicePage(content, 'pest-control')}
      recurringOptions={await getRecurringOptions('pest-control')}
    />
  );
}
