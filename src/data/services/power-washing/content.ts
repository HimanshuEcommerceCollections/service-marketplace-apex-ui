// TODO(design): placeholder COPY for Power Washing — replace copy, price, recurring
// plans and testimonials when the Power Washing design is delivered. All UI comes
// from the shared components — this file is the only thing to change.
// Hero media is real (see ./media.ts); the final-CTA film is still the placeholder.
import type { ServiceConfig } from '../../serviceContent';
import { placeholderTestimonials } from '../placeholder';
import { heroBig, heroTiles } from './media';

export const content: ServiceConfig = {
  slug: 'power-washing',
  content: {
    hero: {
      breadcrumb: 'Power Washing',
      eyebrow: 'Power Washing',
      titleLead: 'A cleaner exterior,',
      titleEm: 'blasted back to new.',
      description: 'Driveways, siding, decks and walkways restored to like-new — priced up front, booked in about 90 seconds.',
      priceLabel: 'Priced from',
      price: '$79',
      bookingSlug: 'power-washing',
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
      subheading: 'No surprises — here is exactly how power washing works with Apex.',
      cards: [
        { icon: 'clipboard', title: 'What we do', body: 'Driveways, siding, decks and walkways restored to like-new — priced up front, booked in about 90 seconds.' },
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
      { name: 'One-time', freq: 'Single visit', amount: '$79', choose: 'Choose one-time' },
      { name: 'Weekly', freq: 'Every week', amount: '$79', unit: '/visit', disc: 'Save 15%', best: true, choose: 'Choose weekly' },
      { name: 'Biweekly', freq: 'Every 2 weeks', amount: '$79', unit: '/visit', disc: 'Save 10%', choose: 'Choose biweekly' },
    ],
  },
  finalCta: {
    blurb: 'Driveways, siding, decks and walkways restored to like-new — priced up front, booked in about 90 seconds.',
  },
  testimonials: placeholderTestimonials,
};
