import type { Metadata } from 'next';
import '../../auth-pro.css';
import SignUpView from './SignUpView';

export const metadata: Metadata = {
  title: 'Create Account | Apex Total Home Services',
  description: 'Create an Apex account to book services, manage requests, and track appointments.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SignUpView />;
}
