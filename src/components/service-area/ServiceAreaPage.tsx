'use client';

import { useEffect, useState } from 'react';
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

export default function ServiceAreaPage() {
  // A ZIP miss offers "Join the waitlist"; that ZIP is handed to the waitlist
  // form through React rather than by writing into its input from the outside,
  // now that both sections are components rather than runtime-driven DOM.
  const [waitlistZip, setWaitlistZip] = useState('');

  useEffect(() => {
    // service-area runtime (videos, reveal, stat count-up, FAQ, ripple) +
    // shared chrome (nav scroll-state + footer reveal). Compose both teardowns.
    // The ZIP checker and the waitlist form are NOT here — both talk to the API
    // and live in their own components.
    const disposeServiceArea = mountServiceArea();
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
      <ZipChecker onWaitlistPrefill={setWaitlistZip} />
      <Coverage />
      <Cities />
      <Services />
      <Waitlist prefillZip={waitlistZip} />
      <WhyChoose />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
