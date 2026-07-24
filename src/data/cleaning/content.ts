// Cleaning page content — Hero + Expect. Values transcribed verbatim from the
// previous cleaning/Hero.tsx and cleaning/Expect.tsx so output is unchanged.
import type { ServiceContent } from '../serviceContent';
import { heroVideo, heroTiles } from './media';

export const content: ServiceContent = {
  hero: {
    breadcrumb: 'Cleaning',
    eyebrow: 'Cleaning',
    titleLead: 'A spotless home,',
    titleEm: 'on your schedule.',
    description:
      'Recurring or one-time cleans, priced by beds and baths, handled by the same trusted team every visit.',
    priceLabel: 'Priced from',
    price: '$129',
    bookingSlug: 'cleaning',
    ctaPrimary: 'Book now',
    ctaSecondary: 'Estimate my price',
    badges: [
      { icon: 'star', label: '4.9 (1.2k reviews)' },
      { icon: 'shield', label: 'Vetted & insured' },
      { icon: 'clock', label: '~90-sec booking' },
    ],
    bigMedia: { type: 'video', src: heroVideo.src },
    tiles: heroTiles,
  },
  expect: {
    heading: 'Straightforward from start to finish.',
    subheading: 'No surprises — here is exactly how cleaning works with Apex.',
    cards: [
      { icon: 'clipboard', title: 'What we clean', body: 'Kitchens, baths, floors, dusting and surfaces top to bottom — every room on your plan.' },
      { icon: 'clock', title: 'How it works', body: 'Pick beds, baths and frequency, choose a window, and the same crew arrives ready to go.' },
      { icon: 'shield', title: 'Our promise', body: 'Not happy with a spot? Tell us within 24 hours and we come back to fix it, free.' },
    ],
    included: ['Full kitchen & bathrooms', 'Dusting & surface wipe-down', 'Floors vacuumed & mopped', 'Trash removed', 'Same team each visit'],
    excluded: ['Exterior windows', 'Carpet shampooing', 'Post-construction debris'],
  },
};
