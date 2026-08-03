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
import CtaBand from '../shared/CtaBand';
import SiteFooter from '../shared/SiteFooter';
import { mountServiceArea } from '../../lib/service-area/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountCtaBand } from '../../lib/shared/cta-band';

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
    const disposeCta = mountCtaBand();
    return () => {
      disposeServiceArea();
      disposeChrome();
      disposeCta();
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
      <CtaBand
        heading="Your home deserves the Apex experience."
        body="Check availability today and schedule trusted professionals for your home."
        primary={{ label: 'Check my ZIP', href: '#zip' }}
        secondary={{ label: 'Book a service', href: '/book' }}
      />
      <SiteFooter />
    </div>
  );
}
