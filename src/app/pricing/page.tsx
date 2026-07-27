import type { Metadata } from 'next';
import '../chrome.css';
import './pricing.css';
import PricingPage from '../../components/pricing/PricingPage';
import {
  services as staticServices,
  comparisonRows as staticRows,
} from '../../data/pricing/services';
import { getServices, formatFromPrice } from '../../lib/catalog';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Pricing — Apex Total Home Services',
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
  const priceBySlug = new Map(
    (live ?? [])
      .filter((s) => s.fromPrice != null)
      .map((s) => [s.slug, formatFromPrice(s.fromPrice as number, s.currency)]),
  );

  const services = staticServices.map((s) => {
    const label = priceBySlug.get(slugOf(s.bookHref));
    return label && IS_NUMERIC.test(s.price.main) ? { ...s, price: { ...s.price, main: label } } : s;
  });
  const comparisonRows = staticRows.map((r) => {
    const label = priceBySlug.get(slugOf(r.bookHref));
    return label && IS_NUMERIC.test(r.start) ? { ...r, start: label } : r;
  });

  return <PricingPage services={services} comparisonRows={comparisonRows} />;
}
