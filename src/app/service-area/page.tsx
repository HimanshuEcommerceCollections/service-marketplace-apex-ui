import type { Metadata } from 'next';
import '../chrome.css';
import '../cta-band.css';
import './service-area.css';
import ServiceAreaPage from '../../components/service-area/ServiceAreaPage';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Service Area — Apex Total Home Services',
  description:
    'Apex proudly serves Wake County, NC. Check your ZIP for availability, explore covered cities, or join the waitlist.',
};

export default function Page() {
  return <ServiceAreaPage />;
}
