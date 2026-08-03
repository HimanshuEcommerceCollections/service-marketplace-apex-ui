'use client';

import { useEffect } from 'react';
import SiteNav from '../shared/SiteNav';
import Hero from './Hero';
import Overview from './Overview';
import Compare from './Compare';
import Estimator from './Estimator';
import Models from './Models';
import Included from './Included';
import Stats from './Stats';
import Faq from './Faq';
import CtaBand from '../shared/CtaBand';
import SiteFooter from '../shared/SiteFooter';
import { mountPricing } from '../../lib/pricing/runtime';
import { mountChrome } from '../../lib/shared/chrome';
import { mountCtaBand } from '../../lib/shared/cta-band';
import { estimatorConfig } from '../../data/pricing/content';
import type { PricingService, ComparisonRow } from '../../data/pricing/services';

interface PricingPageProps {
  services?: PricingService[];
  comparisonRows?: ComparisonRow[];
}

export default function PricingPage({ services, comparisonRows }: PricingPageProps) {
  useEffect(() => {
    // pricing runtime (reveal, stat count-up, cost estimator, FAQ, ripple, hero
    // video) + shared chrome (nav scroll-state + footer reveal). Compose both
    // teardowns. The estimatorConfig feeds the estimator's pricing math.
    const disposePricing = mountPricing(estimatorConfig);
    const disposeChrome = mountChrome();
    const disposeCta = mountCtaBand();
    return () => {
      disposePricing();
      disposeChrome();
      disposeCta();
    };
  }, []);

  return (
    <div className="pg-pricing">
      <SiteNav />
      <Hero />
      <Overview services={services} />
      <Compare rows={comparisonRows} />
      <Estimator />
      <Models />
      <Included />
      <Stats />
      <Faq />
      <CtaBand
        heading="Ready to book your service?"
        body="Choose your service, customize your requirements, and see transparent pricing before you submit."
        primary={{ label: 'Book now', href: '/book' }}
        secondary={{ label: 'Contact team', href: 'tel:+19195550100' }}
      />
      <SiteFooter />
    </div>
  );
}
