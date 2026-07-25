'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from '../service/Hero';
import Expect from '../service/Expect';
import Configurator from '../service/Configurator';
import Recurring, { type ServicePlan } from '../service/Recurring';
import Testimonials from '../shared/Testimonials';
import FinalCta from '../service/FinalCta';
import SiteFooter from '../shared/SiteFooter';
import { mountService } from '../../lib/service/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountTestimonials } from '../../lib/shared/testimonials';
import { testimonials } from '../../data/lawncare/testimonials';
import { ctaVideo } from '../../data/lawncare/media';
import { content } from '../../data/lawncare/content';

const recurringPlans: ServicePlan[] = [
  { name: 'One-time', freq: 'Single visit', amount: '$59', choose: 'Choose one-time' },
  { name: 'Weekly', freq: 'Every week', amount: '$53', unit: '/visit', disc: 'Save 10%', best: true, choose: 'Choose weekly' },
  { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$56', unit: '/visit', disc: 'Save 5%', choose: 'Choose biweekly' },
];
const finalBlurb =
  'Mowing, edging and full lawn care, priced by lot size, handled by the same crew on the schedule you set.';

export default function LawnCarePage() {
  useEffect(() => {
    // 'lawn-care' selects the configurator spec; testimonials feed the carousel.
    const disposeService = mountService('lawn-care', testimonials);
    const disposeChrome = mountChrome();
    const disposeTst = mountTestimonials(
      testimonials.map((t) => ({ name: t.name, role: t.tag, quote: t.quote, portrait: t.portrait }))
    );
    return () => {
      disposeService();
      disposeChrome();
      disposeTst();
    };
  }, []);

  return (
    <div className="pg-service">
      <SiteNav />
      <Hero content={content.hero} />
      <Expect content={content.expect} />
      <Configurator />
      <Recurring heading="Book once. Never chase a mow again." plans={recurringPlans} serviceSlug="lawn-care" />
      <Testimonials />
      <FinalCta blurb={finalBlurb} serviceSlug="lawn-care" ctaVideo={ctaVideo} />
      <SiteFooter />
    </div>
  );
}
