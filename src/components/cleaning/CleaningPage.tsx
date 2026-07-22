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
import { mountCleaning } from '../../lib/cleaning/runtime';
import { mountChrome } from '../../lib/shared/chrome';

export default function CleaningPage() {
  useEffect(() => {
    // mountCleaning wires the configurator engine, testimonial carousel, nav,
    // footer reveal and final-CTA spotlight, and returns a teardown fn. The
    // 'cleaning' slug selects which configurator spec is active (the source read
    // this from <body data-service>). Safe under StrictMode double-invoke.
    const disposeCleaning = mountCleaning('cleaning');
    const disposeChrome = mountChrome();
    return () => {
      disposeCleaning();
      disposeChrome();
    };
  }, []);

  return (
    <>
      <SiteNav />
      <Hero />
      <Expect />
      <Configurator />
      <Recurring />
      <Testimonials />
      <FinalCta />
      <SiteFooter />
    </>
  );
}
