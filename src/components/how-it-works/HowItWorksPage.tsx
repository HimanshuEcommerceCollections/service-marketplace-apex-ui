'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from './Hero';
import Process from './Process';
import Journey from './Journey';
import Effortless from './Effortless';
import AllServices from './AllServices';
import Testimonials from '../shared/Testimonials';
import Faq from './Faq';
import FinalCta from './FinalCta';
import SiteFooter from '../shared/SiteFooter';
import { mountHowItWorks } from '../../lib/how-it-works/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountTestimonials } from '../../lib/shared/testimonials';
// Reuse the existing (identical) testimonial set + portraits rather than a
// page-local copy — same five Wake County reviewers as the cleaning page.
import { testimonials } from '../../data/cleaning/testimonials';
import { testimonialsHead } from '../../data/how-it-works/content';

export default function HowItWorksPage() {
  useEffect(() => {
    // how-it-works runtime (reveal, stat count-up, FAQ, ripple, process progress,
    // journey fill) + shared chrome (nav scroll-state + footer reveal) + the shared
    // testimonials carousel driver. Compose all teardowns.
    const disposeHiw = mountHowItWorks();
    const disposeChrome = mountChrome();
    const disposeTst = mountTestimonials(
      testimonials.map((t) => ({ name: t.name, role: t.tag, quote: t.quote, portrait: t.portrait }))
    );
    return () => {
      disposeHiw();
      disposeChrome();
      disposeTst();
    };
  }, []);

  return (
    <div className="pg-hiw">
      <SiteNav />
      <Hero />
      <Process />
      <Journey />
      <Effortless />
      <AllServices />
      <Testimonials
        eyebrow={testimonialsHead.eyebrow}
        titleLead={testimonialsHead.titleLead}
        titleHighlight={testimonialsHead.titleHighlight}
        blurb={testimonialsHead.blurb}
      />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
