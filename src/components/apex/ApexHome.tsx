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
import Cta from './Cta';
import SiteFooter from '../shared/SiteFooter';
import { mountApex } from '../../lib/apex/runtime';
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

    return () => {
      disposed = true;
      if (dispose) dispose();
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
      <Cta />
      <SiteFooter />
    </div>
  );
}
