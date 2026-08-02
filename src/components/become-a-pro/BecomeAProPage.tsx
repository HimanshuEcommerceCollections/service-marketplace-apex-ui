'use client';

import { useCallback, useEffect, useState } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from './Hero';
import Why from './Why';
import HowItWorks from './HowItWorks';
import Trades from './Trades';
import Requirements from './Requirements';
import ApplyForm from './ApplyForm';
import Stats from './Stats';
import Testimonials from '../shared/Testimonials';
import Faq from './Faq';
import FinalCta from './FinalCta';
import SiteFooter from '../shared/SiteFooter';
import { mountBecomeAPro } from '../../lib/become-a-pro/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountTestimonials } from '../../lib/shared/testimonials';
// Reuse the existing (identical) testimonial set + portraits rather than a
// page-local copy — same convention as the how-it-works page.
import { testimonials } from '../../data/cleaning/testimonials';
import { testimonialsHead } from '../../data/become-a-pro/content';

export default function BecomeAProPage() {
  // Single source of truth for the trade selection, shared by the Available
  // Trades grid and the application form (chips + acknowledgement rows). The
  // source design hand-synced three DOM copies of this; lifting it removes that.
  const [selected, setSelected] = useState<string[]>([]);
  const toggleTrade = useCallback((slug: string) => {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  useEffect(() => {
    // page runtime (reveal, stat count-up, FAQ, ripple, timeline progress, hero
    // particles) + shared chrome (nav scroll-state + footer reveal) + the shared
    // testimonials carousel driver. Compose all teardowns.
    const disposePro = mountBecomeAPro();
    const disposeChrome = mountChrome();
    const disposeTst = mountTestimonials(
      testimonials.map((t) => ({ name: t.name, role: t.tag, quote: t.quote, portrait: t.portrait }))
    );
    return () => {
      disposePro();
      disposeChrome();
      disposeTst();
    };
  }, []);

  return (
    <div className="pg-pro">
      <SiteNav />
      <Hero />
      <Why />
      <HowItWorks />
      <Trades selected={selected} onToggle={toggleTrade} />
      <Requirements />
      <ApplyForm selected={selected} onToggle={toggleTrade} />
      <Stats />
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
