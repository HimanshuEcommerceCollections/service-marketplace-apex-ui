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
import CtaBand from '../shared/CtaBand';
import SiteFooter from '../shared/SiteFooter';
import { mountMembership } from '../../lib/membership/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountCtaBand } from '../../lib/shared/cta-band';
import { mountTestimonials } from '../../lib/shared/testimonials';
import { testimonials } from '../../data/membership/testimonials';
import type { MembershipPlan } from '../../data/membership/plans';

export default function MembershipPage({ plans }: { plans?: MembershipPlan[] }) {
  useEffect(() => {
    // membership runtime (reveal, calculator, carousel, timeline, FAQ) + shared
    // chrome (nav scroll-state + footer reveal) + the shared closing-CTA band.
    // Compose all teardowns.
    const disposeMembership = mountMembership(testimonials);
    const disposeChrome = mountChrome();
    const disposeCta = mountCtaBand();
    const disposeTst = mountTestimonials(
      testimonials.map((t) => ({ name: t.name, role: t.tag, quote: t.quote, portrait: t.portrait }))
    );
    return () => {
      disposeMembership();
      disposeChrome();
      disposeCta();
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
      <CtaBand
        heading="Join the club that keeps your home effortless."
        body="Start a plan in about 90 seconds. Member pricing, the same trusted pros, and zero contracts."
        primary={{ label: 'Book a plan', href: '/book?plan=recurring' }}
        secondary={{ label: 'Contact our team', href: 'tel:+19195550100' }}
      />
      <SiteFooter />
    </div>
  );
}
