import type { Metadata } from 'next';
import '../chrome.css';
import '../cta-band.css';
import './become-a-pro.css';
import '../testimonials.css';
import BecomeAProPage from '../../components/become-a-pro/BecomeAProPage';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Become an Apex Pro | Apex Total Home Services',
  description:
    'Join a trusted network of local trade professionals delivering home services across Wake County. Choose your trades, apply in minutes, and start receiving local job opportunities.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BecomeAProPage />;
}
