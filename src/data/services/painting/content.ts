// TODO(design): placeholder content for Painting. Replace copy, price, media,
// testimonials and recurring plans when the Painting design is delivered. All UI
// comes from the shared components — this file is the only thing to change.
import type { ServiceConfig } from '../../serviceContent';
import { placeholderCtaVideo, placeholderTestimonials } from '../placeholder';
import { heroBig, heroTiles } from './media';

export const content: ServiceConfig = {
  slug: 'painting',
  content: {
    hero: {
      breadcrumb: 'Painting',
      eyebrow: 'Painting',
      titleLead: 'Fresh color,',
      titleEm: 'flawlessly applied.',
      description: 'Interior and exterior painting with clean lines and tidy crews, priced up front before we start.',
      priceLabel: 'Priced from',
      price: '$349',
      bookingSlug: 'painting',
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
      subheading: 'No surprises — here is exactly how painting works with Apex.',
      cards: [
        { icon: 'clipboard', title: 'What we do', body: 'Interior and exterior painting with clean lines and tidy crews, priced up front before we start.' },
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
      { name: 'One-time', freq: 'Single visit', amount: '$349', choose: 'Choose one-time' },
      { name: 'Weekly', freq: 'Every week', amount: '$349', unit: '/visit', disc: 'Save 15%', best: true, choose: 'Choose weekly' },
      { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$349', unit: '/visit', disc: 'Save 10%', choose: 'Choose biweekly' },
    ],
  },
  finalCta: {
    blurb: 'Interior and exterior painting with clean lines and tidy crews, priced up front before we start.',
    ctaVideo: placeholderCtaVideo,
  },
  testimonials: placeholderTestimonials,
};
