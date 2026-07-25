// Pricing page — the 11 services shown in the "All services" overview grid and
// the "Compare" table. Ported verbatim from apex-pricing_extracted.html.
// Card "Learn more" → the service's real route; "Book now" → /book?service=<slug>
// (route + slug mapping matches SiteNav / the membership plan hrefs).
import type { IconKey } from '../../components/pricing/icons';

export interface PricingService {
  id: string;
  name: string;
  icon: IconKey;
  image: string;
  badge?: string; // e.g. "Recurring"
  // Price label: `lead` renders inside a <small> before `main`
  // ("From $149"); omit `lead` for label-only prices ("Custom Estimate").
  price: { lead?: string; main: string };
  type: string;
  learnHref: string; // /services/<route>
  bookHref: string; // /book?service=<slug>
}

export const services: PricingService[] = [
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    icon: 'cleaning',
    image: '/assets/pricing/images/card-cleaning.webp',
    badge: 'Recurring',
    price: { lead: 'From', main: '$149' },
    type: 'Fixed · per visit',
    learnHref: '/services/house-cleaning',
    bookHref: '/book?service=cleaning',
  },
  {
    id: 'lawn',
    name: 'Lawn Care',
    icon: 'lawn',
    image: '/assets/pricing/images/card-lawn.webp',
    badge: 'Recurring',
    price: { lead: 'From', main: '$79' },
    type: 'Variable · by lot',
    learnHref: '/services/lawncare',
    bookHref: '/book?service=lawn-care',
  },
  {
    id: 'power-washing',
    name: 'Power Washing',
    icon: 'power',
    image: '/assets/pricing/images/card-power-washing.webp',
    price: { lead: 'From', main: '$199' },
    type: 'By area',
    learnHref: '/services/power-washing',
    bookHref: '/book?service=power-washing',
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: 'paint',
    image: '/assets/pricing/images/card-painting.webp',
    price: { main: 'Custom Estimate' },
    type: 'Quote',
    learnHref: '/services/painting',
    bookHref: '/book?service=painting',
  },
  {
    id: 'junk-removal',
    name: 'Junk Removal',
    icon: 'junk',
    image: '/assets/pricing/images/card-junk-removal.webp',
    price: { main: 'Based on Load Size' },
    type: 'By load',
    learnHref: '/services/junk-removal',
    bookHref: '/book?service=junk-removal',
  },
  {
    id: 'pool',
    name: 'Pool Service',
    icon: 'pool',
    image: '/assets/pricing/images/card-pool.webp',
    badge: 'Recurring',
    price: { lead: 'From', main: '$99' },
    type: 'Fixed · per visit',
    learnHref: '/services/pool',
    bookHref: '/book?service=pool',
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    icon: 'pest',
    image: '/assets/pricing/images/card-pest-control.webp',
    badge: 'Recurring',
    price: { lead: 'From', main: '$89' },
    type: 'Fixed · per visit',
    learnHref: '/services/pest-control',
    bookHref: '/book?service=pest-control',
  },
  {
    id: 'home-security',
    name: 'Home Security',
    icon: 'security',
    image: '/assets/pricing/images/card-home-security.webp',
    price: { main: 'Free Consultation' },
    type: 'Consultation',
    learnHref: '/services/home-security',
    bookHref: '/book?service=home-security',
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    icon: 'smart',
    image: '/assets/pricing/images/card-smart-home.webp',
    badge: 'Recurring',
    price: { main: 'Based on Devices' },
    type: 'Variable · by devices',
    learnHref: '/services/smart-home',
    bookHref: '/book?service=smart-home',
  },
  {
    id: 'handyman',
    name: 'Handyman',
    icon: 'handyman',
    image: '/assets/pricing/images/card-handyman.webp',
    price: { main: 'Custom Estimate' },
    type: 'Quote',
    learnHref: '/services/handyman',
    bookHref: '/book?service=handyman',
  },
  {
    id: 'tree-stump',
    name: 'Tree & Stump',
    icon: 'tree',
    image: '/assets/pricing/images/card-tree-stump.webp',
    price: { main: 'Custom Estimate' },
    type: 'Quote',
    learnHref: '/services/tree-stump',
    bookHref: '/book?service=tree-stump',
  },
];

// "Compare" table rows. `discount: null` renders an em-dash. `recurring` adds the
// "Recurring" tag beside the name and the highlighted row background.
export interface ComparisonRow {
  name: string;
  recurring: boolean;
  start: string;
  discount: string | null;
  duration: string;
  model: string;
  bookHref: string;
}

export const comparisonRows: ComparisonRow[] = [
  { name: 'Home Cleaning', recurring: true, start: '$149', discount: 'up to 15%', duration: '2–3 hrs', model: 'Fixed', bookHref: '/book?service=cleaning' },
  { name: 'Lawn Care', recurring: true, start: '$79', discount: 'up to 15%', duration: '30–60 min', model: 'Variable', bookHref: '/book?service=lawn-care' },
  { name: 'Power Washing', recurring: false, start: '$199', discount: null, duration: '2–4 hrs', model: 'By area', bookHref: '/book?service=power-washing' },
  { name: 'Painting', recurring: false, start: 'Custom', discount: null, duration: '1–3 days', model: 'Quote', bookHref: '/book?service=painting' },
  { name: 'Junk Removal', recurring: false, start: '$99', discount: null, duration: '1–2 hrs', model: 'By load', bookHref: '/book?service=junk-removal' },
  { name: 'Pool Service', recurring: true, start: '$99', discount: 'up to 10%', duration: '45–60 min', model: 'Fixed', bookHref: '/book?service=pool' },
  { name: 'Pest Control', recurring: true, start: '$89', discount: 'up to 10%', duration: '~45 min', model: 'Fixed', bookHref: '/book?service=pest-control' },
  { name: 'Home Security', recurring: false, start: 'Free', discount: null, duration: 'Consultation', model: 'Consult', bookHref: '/book?service=home-security' },
  { name: 'Smart Home', recurring: true, start: 'By device', discount: '15% (3+)', duration: '1–4 hrs', model: 'Variable', bookHref: '/book?service=smart-home' },
  { name: 'Handyman', recurring: false, start: '$150', discount: null, duration: 'Per block', model: 'Hourly', bookHref: '/book?service=handyman' },
  { name: 'Tree & Stump', recurring: false, start: 'Custom', discount: null, duration: 'Varies', model: 'Quote', bookHref: '/book?service=tree-stump' },
];
