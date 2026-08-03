import type { Metadata } from 'next';
import '../chrome.css';
import './pro.css';
import ProDashboardView from './ProDashboardView';

export const metadata: Metadata = {
  title: 'Pro Dashboard — Apex Total Home Services',
  description: 'Assigned jobs and schedule for verified Apex professionals.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ProDashboardView />;
}
