'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from '../service/Hero';
import Expect from '../service/Expect';
import Configurator from '../service/Configurator';
import Recurring, { type ServicePlan } from '../service/Recurring';
import Testimonials from '../shared/Testimonials';
import CtaBand from '../shared/CtaBand';
import SiteFooter from '../shared/SiteFooter';
import { mountService } from '../../lib/service/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountCtaBand } from '../../lib/shared/cta-band';
import { mountTestimonials } from '../../lib/shared/testimonials';
import type { RecurringSection } from '../../lib/catalog';
import { testimonials } from '../../data/lawncare/testimonials';
import { content } from '../../data/lawncare/content';

// Fallback recurring plans (used only if the API is unreachable / not configured).
const recurringPlans: ServicePlan[] = [
  { name: 'One-time', freq: 'Single visit', amount: '$59', choose: 'Choose one-time' },
  { name: 'Weekly', freq: 'Every week', amount: '$53', unit: '/visit', disc: 'Save 10%', best: true, choose: 'Choose weekly' },
  { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$56', unit: '/visit', disc: 'Save 5%', choose: 'Choose biweekly' },
];
const RECURRING_HEADING = 'Book once. Never chase a mow again.';
const finalBlurb =
  'Mowing, edging and full lawn care, priced by lot size, handled by the same crew on the schedule you set.';

export default function LawnCarePage({
  heroPrice,
  recurring,
}: {
  heroPrice?: string;
  recurring?: RecurringSection | null;
}) {
  useEffect(() => {
    // 'lawn-care' selects the configurator spec; testimonials feed the carousel.
    const disposeService = mountService('lawn-care', testimonials);
    const disposeChrome = mountChrome();
    const disposeCta = mountCtaBand();
    const disposeTst = mountTestimonials(
      testimonials.map((t) => ({ name: t.name, role: t.tag, quote: t.quote, portrait: t.portrait }))
    );
    return () => {
      disposeService();
      disposeChrome();
      disposeCta();
      disposeTst();
    };
  }, []);

  return (
    <div className="pg-service">
      <SiteNav />
      <Hero content={heroPrice ? { ...content.hero, price: heroPrice } : content.hero} />
      <Expect content={content.expect} />
      <Configurator />
      <Recurring
        heading={recurring?.heading || RECURRING_HEADING}
        plans={recurring?.plans ?? recurringPlans}
        serviceSlug="lawn-care"
      />
      <Testimonials />
      <CtaBand
        heading="One call. Whole house handled."
        body={finalBlurb}
        primary={{ label: 'Book this service', href: '/book?service=lawn-care' }}
        secondary={{ label: 'Call (919) 555-0100', href: 'tel:+19195550100' }}
      />
      <SiteFooter />
    </div>
  );
}
