'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from './Hero';
import Expect from './Expect';
import Configurator from './Configurator';
import Recurring from './Recurring';
import Testimonials from './Testimonials';
import FinalCta from './FinalCta';
import SiteFooter from '../shared/SiteFooter';
import { mountService } from '../../lib/service/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { testimonials } from '../../data/lawncare/testimonials';

export default function LawnCarePage() {
  useEffect(() => {
    // 'lawn-care' selects the configurator spec; testimonials feed the carousel.
    const disposeService = mountService('lawn-care', testimonials);
    const disposeChrome = mountChrome();
    return () => {
      disposeService();
      disposeChrome();
    };
  }, []);

  return (
    <div className="pg-service">
      <SiteNav />
      <Hero />
      <Expect />
      <Configurator />
      <Recurring />
      <Testimonials />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
