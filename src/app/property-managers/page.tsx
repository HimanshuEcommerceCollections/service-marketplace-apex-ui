import type { Metadata } from 'next';
import '../chrome.css';
import '../cta-band.css';
import './property-managers.css';
import '../testimonials.css';
import PropertyManagersPage from '../../components/property-managers/PropertyManagersPage';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Property Managers | Apex Total Home Services',
  description:
    'Complete property turnover from one trusted local partner. Move-out cleaning, repairs, landscaping, pressure washing, junk removal and listing preparation, coordinated across Wake County.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PropertyManagersPage />;
}
