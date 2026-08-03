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
import { testimonials } from '../../data/cleaning/testimonials';
import { content } from '../../data/cleaning/content';

// Fallback recurring plans (used only if the API is unreachable / not configured).
const recurringPlans: ServicePlan[] = [
  { name: 'One-time', freq: 'Single visit', amount: '$170', choose: 'Choose one-time' },
  { name: 'Weekly', freq: 'Every week', amount: '$133', unit: '/visit', disc: 'Save 22%', best: true, choose: 'Choose weekly' },
  { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$145', unit: '/visit', disc: 'Save 15%', choose: 'Choose biweekly' },
  { name: 'Monthly', freq: 'Every month', amount: '$156', unit: '/visit', disc: 'Save 8%', choose: 'Choose monthly' },
];
const RECURRING_HEADING = 'Book once. Never think about it again.';
const finalBlurb =
  'Recurring or one-time cleans, priced by beds and baths, handled by the same trusted team every visit.';

export default function CleaningPage({
  heroPrice,
  recurring,
}: {
  heroPrice?: string;
  recurring?: RecurringSection | null;
}) {
  useEffect(() => {
    // mountService wires the configurator engine and testimonial carousel,
    // returning a teardown fn. 'cleaning' selects the configurator spec;
    // testimonials feed the carousel. Safe under StrictMode.
    const disposeService = mountService('cleaning', testimonials);
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
        serviceSlug="cleaning"
      />
      <Testimonials />
      <CtaBand
        heading="One call. Whole house handled."
        body={finalBlurb}
        primary={{ label: 'Book this service', href: '/book?service=cleaning' }}
        secondary={{ label: 'Call (919) 555-0100', href: 'tel:+19195550100' }}
      />
      <SiteFooter />
    </div>
  );
}
