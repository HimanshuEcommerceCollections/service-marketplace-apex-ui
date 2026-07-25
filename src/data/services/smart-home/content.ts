// TODO(design): placeholder content for Smart Home. Replace copy, price, media,
// testimonials and recurring plans when the Smart Home design is delivered. All UI
// comes from the shared components — this file is the only thing to change.
import type { ServiceConfig } from '../../serviceContent';
import { placeholderTiles, placeholderBigMedia, placeholderCtaVideo, placeholderTestimonials } from '../placeholder';

export const content: ServiceConfig = {
  slug: 'smart-home',
  content: {
    hero: {
      breadcrumb: 'Smart Home',
      eyebrow: 'Smart Home',
      titleLead: 'A smarter home,',
      titleEm: 'set up in an afternoon.',
      description: 'Thermostats, lighting, locks and cameras configured, connected and explained.',
      priceLabel: 'Priced from',
      price: '$149',
      bookingSlug: 'smart-home',
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
      subheading: 'No surprises — here is exactly how smart home works with Apex.',
      cards: [
        { icon: 'clipboard', title: 'What we do', body: 'Thermostats, lighting, locks and cameras configured, connected and explained.' },
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
      { name: 'One-time', freq: 'Single visit', amount: '$149', choose: 'Choose one-time' },
      { name: 'Weekly', freq: 'Every week', amount: '$149', unit: '/visit', disc: 'Save 15%', best: true, choose: 'Choose weekly' },
      { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$149', unit: '/visit', disc: 'Save 10%', choose: 'Choose biweekly' },
    ],
  },
  finalCta: {
    blurb: 'Thermostats, lighting, locks and cameras configured, connected and explained.',
    ctaVideo: placeholderCtaVideo,
  },
  testimonials: placeholderTestimonials,
};
