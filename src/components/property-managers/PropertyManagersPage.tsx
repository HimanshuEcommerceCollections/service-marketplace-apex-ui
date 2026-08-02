'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from './Hero';
import Why from './Why';
import Bundle from './Bundle';
import ListingPrep from './ListingPrep';
import HowItWorks from './HowItWorks';
import Stats from './Stats';
import Coverage from './Coverage';
import Testimonials from '../shared/Testimonials';
import QuoteForm from './QuoteForm';
import Faq from './Faq';
import FinalCta from './FinalCta';
import SiteFooter from '../shared/SiteFooter';
import { mountPropertyManagers } from '../../lib/property-managers/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountTestimonials } from '../../lib/shared/testimonials';
// Reuse the existing (identical) testimonial set + portraits rather than a
// page-local copy — same convention as the how-it-works page.
import { testimonials } from '../../data/cleaning/testimonials';
import { testimonialsHead } from '../../data/property-managers/content';

export default function PropertyManagersPage() {
  useEffect(() => {
    // page runtime (reveal, stat count-up, FAQ, ripple, turnover chain, timeline
    // progress, hero particles) + shared chrome (nav scroll-state + footer reveal)
    // + the shared testimonials carousel driver. Compose all teardowns.
    const disposePm = mountPropertyManagers();
    const disposeChrome = mountChrome();
    const disposeTst = mountTestimonials(
      testimonials.map((t) => ({ name: t.name, role: t.tag, quote: t.quote, portrait: t.portrait }))
    );
    return () => {
      disposePm();
      disposeChrome();
      disposeTst();
    };
  }, []);

  return (
    <div className="pg-pm">
      <SiteNav />
      <Hero />
      <Why />
      <Bundle />
      <ListingPrep />
      <HowItWorks />
      <Stats />
      <Coverage />
      <Testimonials
        eyebrow={testimonialsHead.eyebrow}
        titleLead={testimonialsHead.titleLead}
        titleHighlight={testimonialsHead.titleHighlight}
        blurb={testimonialsHead.blurb}
      />
      <QuoteForm />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
