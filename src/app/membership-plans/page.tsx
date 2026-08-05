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

// Plan cards join to live Plans (ServicePlan, served on the membership wire) by
// the service slug in their book CTA (/book?service=<slug>). The price AND the
// feature bullets overlay from live data — the price is the plan's BINDING
// per-cycle amount, and bullets are admin-written in /admin/plans — with the
// static card as the fallback. Image and cadence tag stay static.
const slugOf = (bookHref: string) =>
  new URLSearchParams(bookHref.split('?')[1] ?? '').get('service') ?? '';

export default async function Page() {
  const live = await getMembershipPlans();
  const bySlug = new Map(
    (live ?? [])
      .filter((p) => p.service && p.fromPrice != null)
      .map((p) => [p.service!.slug, p] as const),
  );

  const plans = staticPlans.map((p) => {
    const match = bySlug.get(slugOf(p.bookHref));
    if (!match) return p;
    return {
      ...p,
      price: formatFromPrice(match.fromPrice as number, match.currency),
      features: match.bullets?.length ? match.bullets : p.features,
    };
  });

  return <MembershipPage plans={plans} />;
}
