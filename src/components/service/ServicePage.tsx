'use client';
// Shared SERVICE PAGE composition. Every service route renders this with its
// ServiceConfig — no per-service page markup. Composes the shared sections and
// wires the shared runtimes (configurator engine, chrome, testimonials carousel).
//
// Adding a service = a data/services/<slug>/content.ts + a 1-line route that
// renders <ServicePage config={content} />. No new components or CSS.
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
import type { ServiceConfig } from '../../data/serviceContent';

export default function ServicePage({ config }: { config: ServiceConfig }) {
  useEffect(() => {
    // mountService(slug) selects this service's configurator spec + live pricing.
    const disposeService = mountService(config.slug, config.testimonials);
    const disposeChrome = mountChrome();
    const disposeTst = mountTestimonials(config.testimonials);
    return () => {
      disposeService();
      disposeChrome();
      disposeTst();
    };
  }, [config]);

  return (
    <div className="pg-service">
      <SiteNav />
      <Hero content={config.content.hero} />
      <Expect content={config.content.expect} />
      <Configurator />
      <Recurring heading={config.recurring.heading} plans={config.recurring.plans} serviceSlug={config.slug} />
      <Testimonials />
      <FinalCta blurb={config.finalCta.blurb} serviceSlug={config.slug} ctaVideo={config.finalCta.ctaVideo} />
      <SiteFooter />
    </div>
  );
}
