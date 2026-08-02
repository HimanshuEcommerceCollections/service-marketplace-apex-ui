import type { Metadata } from 'next';
import { Archivo, Inter } from 'next/font/google';
import { CustomerAuthProvider } from './lib/customer-auth';

// Self-hosted equivalents of the original Google Fonts <link>:
//   Archivo (display) + Inter (body). Exposed as CSS variables that
// apex.css maps onto --font-display / --font-body.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-archivo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Apex Total Home Services',
  description: 'Premium home services, professionally delivered across Wake County, NC.',
};

// The layout stays chrome-free (no nav/footer markup) — it only wires fonts and
// the customer session provider. The provider has to live here rather than in the
// (customer) route group because the shared <SiteNav/> renders on every marketing
// page and needs the session to decide between "Sign in" and the account avatar.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <CustomerAuthProvider>{children}</CustomerAuthProvider>
      </body>
    </html>
  );
}
