'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from './Hero';
import ZipChecker from './ZipChecker';
import Coverage from './Coverage';
import Cities from './Cities';
import Services from './Services';
import Waitlist from './Waitlist';
import WhyChoose from './WhyChoose';
import Faq from './Faq';
import FinalCta from './FinalCta';
import SiteFooter from '../shared/SiteFooter';
import { mountServiceArea } from '../../lib/service-area/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { servedZips } from '../../data/service-area/content';

export default function ServiceAreaPage() {
  useEffect(() => {
    // service-area runtime (reveal, stat count-up, map-pin scroll, ZIP checker,
    // waitlist, FAQ, ripple) + shared chrome (nav scroll-state + footer reveal).
    // Compose both teardowns. servedZips feeds the ZIP checker's lookup.
    const disposeServiceArea = mountServiceArea(servedZips);
    const disposeChrome = mountChrome();
    return () => {
      disposeServiceArea();
      disposeChrome();
    };
  }, []);

  return (
    <div className="pg-service-area">
      <SiteNav />
      <Hero />
      <ZipChecker />
      <Coverage />
      <Cities />
      <Services />
      <Waitlist />
      <WhyChoose />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
