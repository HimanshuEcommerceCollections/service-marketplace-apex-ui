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
import { testimonials } from '../../data/cleaning/testimonials';
import { ctaVideo } from '../../data/cleaning/media';
import { content } from '../../data/cleaning/content';

const recurringPlans: ServicePlan[] = [
  { name: 'One-time', freq: 'Single visit', amount: '$170', choose: 'Choose one-time' },
  { name: 'Weekly', freq: 'Every week', amount: '$133', unit: '/visit', disc: 'Save 22%', best: true, choose: 'Choose weekly' },
  { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$145', unit: '/visit', disc: 'Save 15%', choose: 'Choose biweekly' },
  { name: 'Monthly', freq: 'Every month', amount: '$156', unit: '/visit', disc: 'Save 8%', choose: 'Choose monthly' },
];
const finalBlurb =
  'Recurring or one-time cleans, priced by beds and baths, handled by the same trusted team every visit.';

export default function CleaningPage({ heroPrice }: { heroPrice?: string }) {
  useEffect(() => {
    // mountService wires the configurator engine, testimonial carousel and
    // final-CTA spotlight, returning a teardown fn. 'cleaning' selects the
    // configurator spec; testimonials feed the carousel. Safe under StrictMode.
    const disposeService = mountService('cleaning', testimonials);
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
      <Hero content={heroPrice ? { ...content.hero, price: heroPrice } : content.hero} />
      <Expect content={content.expect} />
      <Configurator />
      <Recurring heading="Book once. Never think about it again." plans={recurringPlans} serviceSlug="cleaning" />
      <Testimonials />
      <FinalCta blurb={finalBlurb} serviceSlug="cleaning" ctaVideo={ctaVideo} />
      <SiteFooter />
    </div>
  );
}
