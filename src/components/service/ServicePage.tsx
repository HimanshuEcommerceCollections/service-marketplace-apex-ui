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
import CtaBand from '../shared/CtaBand';
import SiteFooter from '../shared/SiteFooter';
import { mountService } from '../../lib/service/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountCtaBand } from '../../lib/shared/cta-band';
import { mountTestimonials } from '../../lib/shared/testimonials';
import type { ServiceConfig } from '../../data/serviceContent';
import type { RecurringOptionView } from '../../lib/catalog';

export default function ServicePage({
  config,
  recurringOptions = [],
}: {
  config: ServiceConfig;
  /** Admin's payment-frequency grid — drives the estimator's Frequency control. */
  recurringOptions?: RecurringOptionView[];
}) {
  useEffect(() => {
    // mountService(slug) selects this service's configurator spec + live pricing;
    // the grid overrides its hardcoded frequency options and discounts.
    const disposeService = mountService(config.slug, config.testimonials, recurringOptions);
    const disposeChrome = mountChrome();
    const disposeCta = mountCtaBand();
    const disposeTst = mountTestimonials(config.testimonials);
    return () => {
      disposeService();
      disposeChrome();
      disposeCta();
      disposeTst();
    };
  }, [config, recurringOptions]);

  return (
    <div className="pg-service">
      <SiteNav />
      <Hero content={config.content.hero} />
      <Expect content={config.content.expect} />
      <Configurator />
      <Recurring heading={config.recurring.heading} plans={config.recurring.plans} />
      <Testimonials />
      <CtaBand
        heading="One call. Whole house handled."
        body={config.finalCta.blurb}
        primary={{ label: 'Book this service', href: `/book?service=${config.slug}` }}
        secondary={{ label: 'Call (919) 555-0100', href: 'tel:+19195550100' }}
      />
      <SiteFooter />
    </div>
  );
}
