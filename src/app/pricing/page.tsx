import type { Metadata } from 'next';
import '../chrome.css';
import '../cta-band.css';
import './pricing.css';
import PricingPage from '../../components/pricing/PricingPage';
import {
  services as staticServices,
  comparisonRows as staticRows,
} from '../../data/pricing/services';
import { getServices, formatFromPrice } from '../../lib/catalog';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Pricing | Apex Total Home Services',
  description:
    'Simple, transparent pricing for every Apex home service. Compare plans, estimate your cost, and book with no hidden fees.',
};

// The book CTA carries the canonical slug (/book?service=<slug>), which matches
// Service.slug on the API — the join key for overlaying live prices.
const slugOf = (bookHref: string) =>
  new URLSearchParams(bookHref.split('?')[1] ?? '').get('service') ?? '';
const IS_NUMERIC = /^\$\d/; // only overlay real dollar prices; keep "Custom Estimate" etc.

export default async function Page() {
  const live = await getServices();
  const svcBySlug = new Map((live ?? []).map((s) => [s.slug, s]));
  const priceLabel = (slug: string) => {
    const s = svcBySlug.get(slug);
    return s?.fromPrice != null ? formatFromPrice(s.fromPrice, s.currency) : undefined;
  };

  const services = staticServices.map((s) => {
    const label = priceLabel(slugOf(s.bookHref));
    return label && IS_NUMERIC.test(s.price.main) ? { ...s, price: { ...s.price, main: label } } : s;
  });
  // Compare rows: overlay live starting price (numeric only), typical duration, and recurring discount.
  const comparisonRows = staticRows.map((r) => {
    const svc = svcBySlug.get(slugOf(r.bookHref));
    if (!svc) return r;
    const label = svc.fromPrice != null ? formatFromPrice(svc.fromPrice, svc.currency) : undefined;
    return {
      ...r,
      start: label && IS_NUMERIC.test(r.start) ? label : r.start,
      duration: svc.typicalDuration ?? r.duration,
      discount: svc.recurringDiscount,
    };
  });

  return <PricingPage services={services} comparisonRows={comparisonRows} />;
}
