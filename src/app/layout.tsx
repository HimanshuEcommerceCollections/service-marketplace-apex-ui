import type { Metadata } from 'next';
import './globals.css';
import DemoBanner from '../components/HomeComponents/DemoBanner';
import Navbar from '../components/HomeComponents/Navbar';
import Footer from '../components/HomeComponents/Footer';

export const metadata: Metadata = {
  title: 'Apex Total Home Services',
  description: 'Wake County home services marketplace with transparent pricing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemoBanner />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
