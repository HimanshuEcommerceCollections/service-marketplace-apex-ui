'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from './Hero';
import Expect from './Expect';
import Configurator from './Configurator';
import Recurring from './Recurring';
import Testimonials from '../shared/Testimonials';
import FinalCta from './FinalCta';
import SiteFooter from '../shared/SiteFooter';
import { mountService } from '../../lib/service/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountTestimonials } from '../../lib/shared/testimonials';
import { testimonials } from '../../data/lawncare/testimonials';

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
