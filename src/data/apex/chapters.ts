// Cinematic showcase chapters (section#showcase). Transcribed verbatim from
// apex-hero-extracted.html; driving them from data produces DOM identical to the
// 11 hand-written <section class="chapter"> blocks.

export type BadgeKind = 'priced' | 'from' | 'quote';

export interface ChapterSpec {
  /** value line (rendered in <b>); num = true adds the .num class */
  value: string;
  num?: boolean;
  /** caption line (rendered in <span>) */
  caption: string;
}

export interface Chapter {
  side: 'left' | 'right';
  last?: boolean;
  index: string;
  category: string;
  badge: BadgeKind;
  badgeLabel: string;
  title: string;
  /** canonical Service.slug — join key for live pricing from the catalog API */
  slug: string;
  /** service name used inside the image alt text */
  altName: string;
  image: string;
  rating: string;
  reviews: string;
  story: string;
  specs: ChapterSpec[];
  cta: string;
}

export const chapters: Chapter[] = [
  {
    side: 'left',
    index: '01',
    category: 'Recurring core',
    badge: 'priced',
    badgeLabel: 'Priced instantly',
    title: 'Cleaning',
    slug: 'cleaning',
    altName: 'Cleaning',
    image: '/assets/images/image-2.webp',
    rating: '4.9',
    reviews: '1.2k reviews',
    story:
      'A spotless home on your schedule, configured by beds, baths and how often you want us back.',
    specs: [
      { value: 'Beds × baths', caption: 'Configuration' },
      { value: 'from $129', num: true, caption: 'Priced instantly' },
      { value: 'Save 15%', caption: 'On a plan' },
    ],
    cta: 'Configure cleaning',
  },
  {
    side: 'right',
    index: '02',
    category: 'Recurring core',
    badge: 'priced',
    badgeLabel: 'Priced instantly',
    title: 'Lawn Care',
    slug: 'lawn-care',
    altName: 'Lawn Care',
    image: '/assets/images/image-3.webp',
    rating: '4.8',
    reviews: '860 reviews',
    story:
      'Crisp, even stripes every visit, priced by your lot and kept on a rhythm that suits the season.',
    specs: [
      { value: 'By lot size', caption: 'Configuration' },
      { value: '$59', num: true, caption: 'Per visit' },
      { value: 'Weekly / biweekly', caption: 'Recurring' },
    ],
    cta: 'Configure lawn care',
  },
  {
    side: 'left',
    index: '03',
    category: 'Recurring core',
    badge: 'priced',
    badgeLabel: 'Priced instantly',
    title: 'Pool Service',
    slug: 'pool',
    altName: 'Pool Service',
    image: '/assets/images/image-4.webp',
    rating: '4.9',
    reviews: '540 reviews',
    story:
      'Balanced water and a spotless pool all season: skimmed, tested and treated on a steady cadence.',
    specs: [
      { value: 'By pool size', caption: 'Configuration' },
      { value: '$119', num: true, caption: 'Per visit' },
      { value: 'Weekly / biweekly', caption: 'Recurring' },
    ],
    cta: 'Configure pool service',
  },
  {
    side: 'right',
    index: '04',
    category: 'Recurring core',
    badge: 'priced',
    badgeLabel: 'Priced instantly',
    title: 'Pest Control',
    slug: 'pest-control',
    altName: 'Pest Control',
    image: '/assets/images/image-5.webp',
    rating: '4.7',
    reviews: '430 reviews',
    story:
      'Quarterly, licensed and thorough. A protected perimeter you never have to think about.',
    specs: [
      { value: 'Quarterly', caption: 'Cadence' },
      { value: '$89', num: true, caption: 'Per visit' },
      { value: 'NC-licensed', caption: 'Compliance' },
    ],
    cta: 'Configure pest control',
  },
  {
    side: 'left',
    index: '05',
    category: 'Exterior',
    badge: 'from',
    badgeLabel: 'Starting price',
    title: 'Power Washing',
    slug: 'power-washing',
    altName: 'Power Washing',
    image: '/assets/images/image-6.webp',
    rating: '4.8',
    reviews: '720 reviews',
    story:
      'Driveways, siding and decks brought back to new. The grime lifts and the surface stays.',
    specs: [
      { value: 'Surface & area', caption: 'Configuration' },
      { value: 'from $199', num: true, caption: 'Starting price' },
      { value: 'Drives · siding', caption: 'Scope' },
    ],
    cta: 'Configure power washing',
  },
  {
    side: 'right',
    index: '06',
    category: 'Haul-away',
    badge: 'priced',
    badgeLabel: 'Priced instantly',
    title: 'Junk Removal',
    slug: 'junk-removal',
    altName: 'Junk Removal',
    image: '/assets/images/image-7.webp',
    rating: '4.8',
    reviews: '610 reviews',
    story:
      'Point at what has to go, a quarter load or a full truck, and we clear it the same visit.',
    specs: [
      { value: 'Visual load size', caption: 'Configuration' },
      { value: 'from $99', num: true, caption: 'Priced instantly' },
      { value: 'We load it', caption: 'Full haul' },
    ],
    cta: 'Configure junk removal',
  },
  {
    side: 'left',
    index: '07',
    category: 'Installed',
    badge: 'priced',
    badgeLabel: 'Priced instantly',
    title: 'Smart Home',
    slug: 'smart-home',
    altName: 'Smart Home',
    image: '/assets/images/image-8.webp',
    rating: '4.9',
    reviews: '390 reviews',
    story:
      'Cameras, sensors and switches installed and linked. Three devices or more and the price drops.',
    specs: [
      { value: 'Device checklist', caption: 'Configuration' },
      { value: 'from $199', num: true, caption: 'Priced instantly' },
      { value: '3+ = save 15%', num: true, caption: 'Volume' },
    ],
    cta: 'Configure smart home',
  },
  {
    side: 'right',
    index: '08',
    category: 'On-demand',
    badge: 'from',
    badgeLabel: 'Starting price',
    title: 'Handyman',
    slug: 'handyman',
    altName: 'Handyman',
    image: '/assets/images/image-9.webp',
    rating: '4.9',
    reviews: '980 reviews',
    story:
      'The whole to-do list handled in one visit: mounting, repairs and the odd jobs that pile up.',
    specs: [
      { value: 'By the hour', caption: 'Configuration' },
      { value: 'from $95/hr', num: true, caption: 'Starting price' },
      { value: '1–8 hours', num: true, caption: 'Scope' },
    ],
    cta: 'Configure handyman',
  },
  {
    side: 'left',
    index: '09',
    category: 'Project',
    badge: 'quote',
    badgeLabel: 'Free estimate',
    title: 'Painting',
    slug: 'painting',
    altName: 'Painting',
    image: '/assets/images/image-10.webp',
    rating: '5.0',
    reviews: '510 reviews',
    story:
      'Interior or exterior, cut in clean and rolled even, for a finish that looks factory-fresh.',
    specs: [
      { value: 'Interior · exterior', caption: 'Scope' },
      { value: 'Custom estimate', caption: 'Quoted' },
      { value: 'Prep included', caption: 'Finish' },
    ],
    cta: 'Request painting quote',
  },
  {
    side: 'right',
    index: '10',
    category: 'Protected',
    badge: 'quote',
    badgeLabel: 'Free consult',
    title: 'Home Security',
    slug: 'home-security',
    altName: 'Home Security',
    image: '/assets/images/image-11.webp',
    rating: '4.8',
    reviews: '280 reviews',
    story:
      'Cameras, alarms and smart locks designed around your home, planned in a free consult first.',
    specs: [
      { value: 'Site walkthrough', caption: 'Consult' },
      { value: 'Free consult', caption: 'No pressure' },
      { value: 'NC alarm-licensed', caption: 'Compliance' },
    ],
    cta: 'Book security consult',
  },
  {
    side: 'left',
    last: true,
    index: '11',
    category: 'Exterior',
    badge: 'quote',
    badgeLabel: 'Free estimate',
    title: 'Tree & Stump',
    slug: 'tree-stump',
    altName: 'Tree & Stump',
    image: '/assets/images/image-12.webp',
    rating: '4.7',
    reviews: '190 reviews',
    story:
      'Overgrown limbs cleared and stumps ground flush. Heavy work done clean and hauled away.',
    specs: [
      { value: 'On-site assessment', caption: 'Scope' },
      { value: 'Custom estimate', caption: 'Quoted' },
      { value: 'Full haul-away', caption: 'Cleanup' },
    ],
    cta: 'Request tree quote',
  },
];
