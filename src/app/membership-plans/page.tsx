import type { Metadata } from 'next';
import '../chrome.css';
import '../cta-band.css';
import './membership.css';
import '../testimonials.css';
import MembershipPage from '../../components/membership/MembershipPage';
import { plans as staticPlans } from '../../data/membership/plans';
import { getMembershipPlans, formatFromPrice } from '../../lib/catalog';

export const metadata: Metadata = {
  // Preserved from the source document.
  title: 'Membership Plans — Apex Total Home Services',
  description:
    'One membership for cleaning, lawn, pool and pest — the same trusted pros on an automatic schedule at member pricing. No contracts.',
};

// Plan cards join to live plans by the service slug in their book CTA
// (/book?service=<slug>). Only the price is overlaid; features/image/tag stay static.
const slugOf = (bookHref: string) =>
  new URLSearchParams(bookHref.split('?')[1] ?? '').get('service') ?? '';

export default async function Page() {
  const live = await getMembershipPlans();
  const priceBySlug = new Map(
    (live ?? [])
      .filter((p) => p.service && p.fromPrice != null)
      .map((p) => [p.service!.slug, formatFromPrice(p.fromPrice as number, p.currency)] as const),
  );

  const plans = staticPlans.map((p) => {
    const label = priceBySlug.get(slugOf(p.bookHref));
    return label ? { ...p, price: label } : p;
  });

  return <MembershipPage plans={plans} />;
}
