'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from './Hero';
import Bridge from './Bridge';
import Showcase from './Showcase';
import HowItWorks from './HowItWorks';
import Coverage from './Coverage';
import Testimonials from '../shared/Testimonials';
import Recurring from './Recurring';
import Faq from './Faq';
import CtaBand from '../shared/CtaBand';
import SiteFooter from '../shared/SiteFooter';
import { mountApex } from '../../lib/apex/runtime';
import { mountCtaBand } from '../../lib/shared/cta-band';
import type { Chapter } from '../../data/apex/chapters';
import type { CoverageTown } from './Coverage';

interface ApexHomeProps {
  chapters?: Chapter[];
  towns?: CoverageTown[];
  townCount?: number;
}

export default function ApexHome({ chapters, towns, townCount }: ApexHomeProps) {
  useEffect(() => {
    let disposed = false;
    let dispose: (() => void) | null = null;

    // mountApex loads GSAP/Lenis and wires everything up; it resolves to a
    // teardown fn. If the component unmounts before it resolves (StrictMode /
    // fast navigation), tear down immediately once it does.
    mountApex().then((d: () => void) => {
      if (disposed) d();
      else dispose = d;
    });

    // The closing CTA is the shared section; its film + cursor keyhole are wired
    // by mountCtaBand on every page, home included, rather than by mountApex.
    const disposeCta = mountCtaBand();

    return () => {
      disposed = true;
      if (dispose) dispose();
      disposeCta();
    };
  }, []);

  return (
    <div className="pg-home">
      <SiteNav />
      <Hero />
      <Bridge />
      <Showcase chapters={chapters} />
      <HowItWorks />
      <Coverage towns={towns} townCount={townCount} />
      <Testimonials />
      <Recurring />
      <Faq />
      <CtaBand
        heading="The whole house, handled by one team."
        body="Tell us what your home needs. We’ll bring the right trade, a clear price, and a coordinator who owns the outcome."
        primary={{ label: 'Book a Service', href: '/book' }}
      />
      <SiteFooter />
    </div>
  );
}
