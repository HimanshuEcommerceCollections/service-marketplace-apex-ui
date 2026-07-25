import type { Metadata } from 'next';
import '../chrome.css';
import './how-it-works.css';
import '../testimonials.css';
import HowItWorksPage from '../../components/how-it-works/HowItWorksPage';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'How It Works — Apex Total Home Services',
  description:
    'From booking to a perfect home — see exactly how Apex works, step by step. Choose, customize, book, and relax.',
};

export default function Page() {
  return <HowItWorksPage />;
}
