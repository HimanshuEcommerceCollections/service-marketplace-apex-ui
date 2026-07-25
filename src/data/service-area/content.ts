// Typed content for the Service Area page (/service-area).
// Ported from apex-service-area_extracted.html: the served-ZIP set that powers the
// ZIP checker, the eight covered cities (with hero-map pin positions), the eleven
// services offered area-wide, the "why Apex" cards, the coverage stat counters, and
// the FAQ. Keeping this in the data layer (like data/pricing/content.ts) means the
// runtime + components stay content-free.

import type { ServiceIconKey } from '../../components/service-area/icons';

export type City = {
  slug: string;
  name: string;
  zips: number; // renders the "N ZIPs" tag
  blurb: string;
  pin: { left: string; top: string }; // hero/coverage map pin position
};

export type AreaService = {
  name: string;
  icon: ServiceIconKey;
  learnMore: string; // real service route
  bookSlug: string; // /book?service=<bookSlug>
};

export type WhyCard = { icon: ServiceIconKey; title: string; text: string };
export type Faq = { q: string; a: string };
export type Stat = { count: number; suffix?: string; label: string };

// ZIP codes Apex currently serves. Fed to mountServiceArea() → the checker.
// (Deduplicated from the source list.)
export const servedZips: string[] = [
  '27601', '27603', '27604', '27605', '27606', '27607', '27608', '27609', '27610',
  '27612', '27613', '27614', '27615', '27616', '27617',
  '27511', '27513', '27518', '27519',
  '27502', '27523',
  '27587', '27588',
  '27560',
  '27540',
  '27526',
  '27529',
  '27545',
  '27591',
];

export const cities: City[] = [
  { slug: 'raleigh', name: 'Raleigh', zips: 15, blurb: 'The capital city — our largest coverage zone.', pin: { left: '58%', top: '44%' } },
  { slug: 'cary', name: 'Cary', zips: 4, blurb: 'Full service across all of Cary.', pin: { left: '42%', top: '54%' } },
  { slug: 'apex', name: 'Apex', zips: 2, blurb: 'Peak-of-good-living, fully covered.', pin: { left: '34%', top: '63%' } },
  { slug: 'wake-forest', name: 'Wake Forest', zips: 2, blurb: 'Northern Wake, same-week availability.', pin: { left: '60%', top: '18%' } },
  { slug: 'morrisville', name: 'Morrisville', zips: 1, blurb: 'Tech-triangle homes, all services.', pin: { left: '36%', top: '45%' } },
  { slug: 'holly-springs', name: 'Holly Springs', zips: 1, blurb: 'Growing fast — we grew with it.', pin: { left: '38%', top: '74%' } },
  { slug: 'fuquay-varina', name: 'Fuquay-Varina', zips: 1, blurb: 'Southern Wake coverage.', pin: { left: '43%', top: '86%' } },
  { slug: 'garner', name: 'Garner', zips: 1, blurb: 'Southeast Wake, fully served.', pin: { left: '57%', top: '66%' } },
];

export const services: AreaService[] = [
  { name: 'Home Cleaning', icon: 'cleaning', learnMore: '/services/house-cleaning', bookSlug: 'cleaning' },
  { name: 'Lawn Care', icon: 'lawn', learnMore: '/services/lawncare', bookSlug: 'lawn-care' },
  { name: 'Power Washing', icon: 'power', learnMore: '/services/power-washing', bookSlug: 'power-washing' },
  { name: 'Painting', icon: 'paint', learnMore: '/services/painting', bookSlug: 'painting' },
  { name: 'Junk Removal', icon: 'junk', learnMore: '/services/junk-removal', bookSlug: 'junk-removal' },
  { name: 'Pool Service', icon: 'pool', learnMore: '/services/pool', bookSlug: 'pool' },
  { name: 'Pest Control', icon: 'pest', learnMore: '/services/pest-control', bookSlug: 'pest-control' },
  { name: 'Home Security', icon: 'security', learnMore: '/services/home-security', bookSlug: 'home-security' },
  { name: 'Smart Home', icon: 'smart', learnMore: '/services/smart-home', bookSlug: 'smart-home' },
  { name: 'Handyman', icon: 'handyman', learnMore: '/services/handyman', bookSlug: 'handyman' },
  { name: 'Tree & Stump', icon: 'tree', learnMore: '/services/tree-stump', bookSlug: 'tree-stump' },
];

export const whyCards: WhyCard[] = [
  { icon: 'security', title: 'Trusted professionals', text: 'Vetted, insured, background-checked pros in your neighborhood.' },
  { icon: 'price', title: 'Transparent pricing', text: 'See the full breakdown before you ever book — no surprises.' },
  { icon: 'fast', title: 'Fast response', text: 'Same-week availability with ~90-minute average response.' },
  { icon: 'home', title: 'Complete home solutions', text: 'All 11 services under one trusted local team.' },
];

export const coverageStats: Stat[] = [
  { count: 8, label: 'Cities covered' },
  { count: 40, suffix: '+', label: 'ZIP codes supported' },
  { count: 12000, suffix: '+', label: 'Active customers' },
  { count: 90, label: 'Min. response' },
];

export const faqs: Faq[] = [
  {
    q: 'Which areas do you currently serve?',
    a: 'We cover all of Wake County, NC — including Raleigh, Cary, Apex, Wake Forest, Morrisville, Holly Springs, Fuquay-Varina, and Garner, across 40+ ZIP codes.',
  },
  {
    q: 'How does the waitlist work?',
    a: 'If your ZIP isn’t covered yet, add your details to the waitlist. The moment we expand into your neighborhood, you’ll be the first to know — with a welcome offer.',
  },
  {
    q: 'When will Apex expand?',
    a: 'We’re growing across the Triangle every quarter. Waitlist demand directly shapes where we launch next, so signing up genuinely helps.',
  },
  {
    q: 'Can I book multiple services?',
    a: 'Absolutely. Bundle cleaning, lawn, pool, and more into one schedule — and members save on every visit.',
  },
];
