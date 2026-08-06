// Lawn care page content — Hero + Expect. Values transcribed verbatim from the
// previous lawncare/Hero.tsx and lawncare/Expect.tsx so output is unchanged.
// Note: the hero's large mosaic cell is an image here (cleaning used a video).
import type { ServiceContent } from '../serviceContent';
import { heroBig, heroTiles } from './media';

export const content: ServiceContent = {
  hero: {
    breadcrumb: 'Lawn Care',
    eyebrow: 'Lawn Care',
    titleLead: 'A sharper lawn,',
    titleEm: 'every single week.',
    description:
      'Mowing, edging and full lawn care, priced by lot size, handled by the same crew on the schedule you set.',
    priceLabel: 'Priced from',
    price: '$39',
    bookingSlug: 'lawn-care',
    ctaPrimary: 'Book now',
    ctaSecondary: 'Estimate my price',
    badges: [
      { icon: 'star', label: '4.9 (1.2k reviews)' },
      { icon: 'shield', label: 'Vetted & insured' },
      { icon: 'clock', label: '~90-sec booking' },
    ],
    bigMedia: { type: 'image', src: heroBig.src, alt: heroBig.alt },
    tiles: heroTiles,
  },
  expect: {
    heading: 'Straightforward from first cut to last.',
    subheading: 'No surprises. Here is exactly how lawn care works with Apex.',
    cards: [
      { icon: 'clipboard', title: 'What we do', body: 'Mow at the ideal height, crisp edging, string-trimming and a full blow-down of clippings.' },
      { icon: 'clock', title: 'How it works', body: 'Pick your lot size and frequency. The same crew shows up on schedule, week after week.' },
      { icon: 'shield', title: 'Our promise', body: 'Missed an edge or a patch? Tell us within 24 hours and we come back to fix it, free.' },
    ],
    included: [
      'Mowing at the ideal height',
      'Edging & string-trimming',
      'Clippings blown off hard surfaces',
      'Seasonal height adjustments',
      'Same crew each visit',
    ],
    excluded: ['Leaf haul-away (fall add-on)', 'Fertilization & weed control', 'Irrigation repair'],
  },
};
