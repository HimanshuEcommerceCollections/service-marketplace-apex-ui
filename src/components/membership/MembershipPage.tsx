'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from './Hero';
import WhyChoose from './WhyChoose';
import Plans from './Plans';
import Compare from './Compare';
import Calculator from './Calculator';
import Benefits from './Benefits';
import HowItWorks from './HowItWorks';
import Testimonials from '../shared/Testimonials';
import Faq from './Faq';
import FinalCta from './FinalCta';
import SiteFooter from '../shared/SiteFooter';
import { mountMembership } from '../../lib/membership/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountTestimonials } from '../../lib/shared/testimonials';
import { testimonials } from '../../data/membership/testimonials';
import type { MembershipPlan } from '../../data/membership/plans';

export default function MembershipPage({ plans }: { plans?: MembershipPlan[] }) {
  useEffect(() => {
    // membership runtime (reveal, calculator, carousel, timeline, CTA video, FAQ)
    // + shared chrome (nav scroll-state + footer reveal). Compose both teardowns.
    const disposeMembership = mountMembership(testimonials);
    const disposeChrome = mountChrome();
    const disposeTst = mountTestimonials(
      testimonials.map((t) => ({ name: t.name, role: t.tag, quote: t.quote, portrait: t.portrait }))
    );
    return () => {
      disposeMembership();
      disposeChrome();
      disposeTst();
    };
  }, []);

  return (
    <div className="pg-membership">
      <SiteNav />
      <Hero />
      <WhyChoose />
      <Plans plans={plans} />
      <Compare />
      <Calculator />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
