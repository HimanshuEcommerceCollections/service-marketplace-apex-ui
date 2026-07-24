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
import Testimonials from './Testimonials';
import Faq from './Faq';
import FinalCta from './FinalCta';
import SiteFooter from '../shared/SiteFooter';
import { mountMembership } from '../../lib/membership/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { testimonials } from '../../data/membership/testimonials';

export default function MembershipPage() {
  useEffect(() => {
    // membership runtime (reveal, calculator, carousel, timeline, CTA video, FAQ)
    // + shared chrome (nav scroll-state + footer reveal). Compose both teardowns.
    const disposeMembership = mountMembership(testimonials);
    const disposeChrome = mountChrome();
    return () => {
      disposeMembership();
      disposeChrome();
    };
  }, []);

  return (
    <div className="pg-membership">
      <SiteNav />
      <Hero />
      <WhyChoose />
      <Plans />
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
