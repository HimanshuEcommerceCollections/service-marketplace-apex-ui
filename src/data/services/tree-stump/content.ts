// TODO(design): placeholder content for Tree & Stump. Replace copy, price, media,
// testimonials and recurring plans when the Tree & Stump design is delivered. All UI
// comes from the shared components — this file is the only thing to change.
import type { ServiceConfig } from '../../serviceContent';
import { placeholderTiles, placeholderBigMedia, placeholderCtaVideo, placeholderTestimonials } from '../placeholder';

export const content: ServiceConfig = {
  slug: 'tree-stump',
  content: {
    hero: {
      breadcrumb: 'Tree & Stump',
      eyebrow: 'Tree & Stump',
      titleLead: 'Trees and stumps,',
      titleEm: 'cleared safely.',
      description: 'Trimming, removal and stump grinding by insured crews with the right equipment.',
      priceLabel: 'Priced from',
      price: '$199',
      bookingSlug: 'tree-stump',
      ctaPrimary: 'Book now',
      ctaSecondary: 'Estimate my price',
      badges: [
        { icon: 'star', label: '4.9 (1.2k reviews)' },
        { icon: 'shield', label: 'Vetted & insured' },
        { icon: 'clock', label: '~90-sec booking' },
      ],
      bigMedia: placeholderBigMedia,
      tiles: placeholderTiles,
    },
    expect: {
      heading: 'Straightforward from start to finish.',
      subheading: 'No surprises — here is exactly how tree & stump works with Apex.',
      cards: [
        { icon: 'clipboard', title: 'What we do', body: 'Trimming, removal and stump grinding by insured crews with the right equipment.' },
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
      { name: 'One-time', freq: 'Single visit', amount: '$199', choose: 'Choose one-time' },
      { name: 'Weekly', freq: 'Every week', amount: '$199', unit: '/visit', disc: 'Save 15%', best: true, choose: 'Choose weekly' },
      { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$199', unit: '/visit', disc: 'Save 10%', choose: 'Choose biweekly' },
    ],
  },
  finalCta: {
    blurb: 'Trimming, removal and stump grinding by insured crews with the right equipment.',
    ctaVideo: placeholderCtaVideo,
  },
  testimonials: placeholderTestimonials,
};
