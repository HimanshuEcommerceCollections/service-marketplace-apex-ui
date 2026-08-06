// TODO(design): placeholder content for Pool Service. Replace copy, price, media,
// testimonials and recurring plans when the Pool Service design is delivered. All UI
// comes from the shared components — this file is the only thing to change.
import type { ServiceConfig } from '../../serviceContent';
import { placeholderTestimonials } from '../placeholder';
import { heroBig, heroTiles } from './media';

export const content: ServiceConfig = {
  slug: 'pool',
  content: {
    hero: {
      breadcrumb: 'Pool Service',
      eyebrow: 'Pool Service',
      titleLead: 'A crystal-clear pool,',
      titleEm: 'all season long.',
      description: 'Skimming, vacuuming, brushing and chemical balancing on a schedule that fits your pool.',
      priceLabel: 'Priced from',
      price: '$119',
      bookingSlug: 'pool',
      ctaPrimary: 'Book now',
      ctaSecondary: 'Estimate my price',
      badges: [
        { icon: 'star', label: '4.9 (1.2k reviews)' },
        { icon: 'shield', label: 'Vetted & insured' },
        { icon: 'clock', label: '~90-sec booking' },
      ],
      bigMedia: heroBig,
      tiles: heroTiles,
    },
    expect: {
      heading: 'Straightforward from start to finish.',
      subheading: 'No surprises. Here is exactly how pool service works with Apex.',
      cards: [
        { icon: 'clipboard', title: 'What we do', body: 'Skimming, vacuuming, brushing and chemical balancing on a schedule that fits your pool.' },
        { icon: 'clock', title: 'How it works', body: 'Configure the details, pick a window, and the same trusted pro arrives ready to go.' },
        { icon: 'shield', title: 'Our promise', body: 'Not happy with the result? Tell us within 24 hours and we come back to make it right, free.' },
      ],
      included: ['Upfront, transparent pricing', 'Vetted, insured professionals', 'The same trusted team', 'Satisfaction guarantee'],
      excluded: ['Anything quoted separately on site'],
    },
  },
  recurring: {
    heading: 'Book once. Never think about it again.',
    plans: [
      { name: 'One-time', freq: 'Single visit', amount: '$119' },
      { name: 'Weekly', freq: 'Every week', amount: '$119', unit: '/visit', disc: 'Save 15%', best: true },
      { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$119', unit: '/visit', disc: 'Save 10%' },
    ],
  },
  finalCta: {
    blurb: 'Skimming, vacuuming, brushing and chemical balancing on a schedule that fits your pool.',
  },
  testimonials: placeholderTestimonials,
};
