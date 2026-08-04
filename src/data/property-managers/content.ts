// Copy + structure for the /property-managers B2B page, ported from
// property-managers.html. Text only — icons live in components/property-managers/icons.
// Kept in one module (same shape as data/how-it-works/content.ts) so the section
// components stay presentational.

export interface IconCard {
  icon: string;
  title: string;
  body: string;
}

export const hero = {
  eyebrow: 'For property managers & real estate teams',
  titleLead: 'Complete property turnover. ',
  titleEm: 'One trusted local partner.',
  lede: 'From move-out cleaning to repairs, landscaping, pressure washing, junk removal and final listing preparation, Apex coordinates every service your property needs.',
  primary: { label: 'Request a quote', href: '#quote' },
  secondary: { label: 'See turnover services', href: '#bundle' },
};

export const whyHead = {
  eyebrow: 'Why property managers choose Apex',
  title: 'One partner. Every trade. Full accountability.',
  lede: 'Stop juggling vendors. Apex coordinates the work, the schedule, and the quality — so your team can focus on occupancy.',
};

export const whyCards: IconCard[] = [
  {
    icon: 'user',
    title: 'One Point of Contact',
    body: 'A single coordinator manages every service request, update, and handoff — no chasing five different vendors.',
  },
  {
    icon: 'grid',
    title: 'Multiple Home Services',
    body: 'Cleaning, repairs, painting, lawn care, junk removal, pressure washing and more — bundled under one roof.',
  },
  {
    icon: 'shield-check',
    title: 'Reliable Local Professionals',
    body: 'Vetted Wake County pros working under one trusted brand, with consistent standards on every job.',
  },
  {
    icon: 'clock',
    title: 'Faster Turnovers',
    body: 'Trades are sequenced back-to-back — cleaning, repairs, paint — so units are rent-ready in days, not weeks.',
  },
  {
    icon: 'chat',
    title: 'Transparent Communication',
    body: 'Clear scopes, clear quotes, and proactive status updates from scheduling through final walkthrough.',
  },
  {
    icon: 'star',
    title: 'Professional Quality Standards',
    body: 'Every job is delivered to a documented standard and inspected before we call it done.',
  },
];

export const bundleHead = {
  eyebrow: 'The turnover bundle',
  title: 'Every step between tenants, handled in sequence',
  lede: 'One coordinated workflow takes a unit from move-out to move-in ready — no scheduling gaps, no vendor handoff failures.',
};

/** The 7-link turnover chain. The last entry renders as the green "done" node. */
export const bundleSteps: { icon: string; title: string; caption: string }[] = [
  { icon: 'broom', title: 'Move-Out Cleaning', caption: 'Deep clean, top to bottom.' },
  { icon: 'trash', title: 'Junk Removal', caption: 'Abandoned items hauled out.' },
  { icon: 'wrench', title: 'Handyman Repairs', caption: 'Fixtures, doors, small fixes.' },
  { icon: 'roller', title: 'Painting Touch-ups', caption: 'Walls patched and refreshed.' },
  { icon: 'spray', title: 'Power Washing', caption: 'Entries and exteriors renewed.' },
  { icon: 'carpet', title: 'Optional Carpet Cleaning', caption: 'Hot-water extraction on request.' },
  { icon: 'check', title: 'Ready for Next Tenant', caption: 'Inspected and move-in ready.' },
];

export const listingHead = {
  eyebrow: 'Listing preparation',
  title: 'Make every listing photo-ready',
  lede: 'For realtors and investors preparing a property for market, Apex bundles the finishing work into one coordinated visit — so the home shows at its absolute best.',
};

/** Icon + label tiles; `wide` spans both columns (the final-presentation row). */
export const listingItems: { icon: string; label: string; wide?: boolean }[] = [
  { icon: 'home', label: 'Exterior Cleaning' },
  { icon: 'broom', label: 'Interior Cleaning' },
  { icon: 'roller', label: 'Painting Touch-ups' },
  { icon: 'leaf', label: 'Lawn Care' },
  { icon: 'spray', label: 'Pressure Washing' },
  { icon: 'wrench', label: 'Handyman Repairs' },
  { icon: 'star', label: 'Professional Final Presentation', wide: true },
];

export const listingChips = [
  { icon: 'check', title: 'Photo-Ready', caption: 'Coordinated in one visit', tone: 'confirm' as const },
  { icon: 'clock', title: 'Days, Not Weeks', caption: 'Trades sequenced together', tone: 'blue' as const },
];

export const processHead = {
  eyebrow: 'How it works',
  title: 'From property details to scheduled services',
  lede: 'A simple, coordinator-led process. No online booking to configure — just a conversation and a clear quote.',
};

export const processSteps: { title: string; body: string }[] = [
  { title: 'Submit Property Details', body: 'Share the address, unit count, and scope of work.' },
  { title: 'Coordinator Review', body: 'A dedicated coordinator reviews the property and requirements.' },
  { title: 'Customized Quote', body: 'Receive a clear, itemized quote for the full bundle.' },
  { title: 'Schedule Services', body: 'We sequence the trades and manage the work end to end.' },
];

export const statsHead = {
  eyebrow: 'Business benefits',
  title: 'Built for portfolios, not just single homes',
};

/** `count` tiles animate via the runtime; `word` tiles render a static display word. */
export const stats: {
  count?: number;
  suffix?: string;
  word?: string;
  label: string;
  sub: string;
}[] = [
  { count: 250, suffix: '+', label: 'Properties Supported', sub: 'Across Wake County' },
  { count: 11, label: 'Service Categories', sub: 'Under one vendor' },
  { word: 'Fast', label: 'Response', sub: 'Coordinator replies quickly' },
  { word: 'Single', label: 'Trusted Vendor', sub: 'One invoice, one standard' },
];

export const coverageHead = {
  eyebrow: 'Service coverage',
  title: 'Local coordination across Wake County',
  lede: 'Our professionals live and work here — which means faster scheduling and coordinators who know the area.',
};

// The source design's decorative map pins are gone: the coverage frame holds the
// coverage video (see data/property-managers/media.ts → coverageVideo).

export const coverageAreas: IconCard[] = [
  {
    icon: 'pin',
    title: 'Apex — Home Base',
    body: "Headquartered where we started, serving the town we're named for.",
  },
  {
    icon: 'home',
    title: 'Cary & Morrisville',
    body: 'Full turnover and listing prep coverage for high-demand rental corridors.',
  },
  {
    icon: 'building',
    title: 'Raleigh',
    body: 'Multi-unit and single-family support across the city and suburbs.',
  },
  {
    icon: 'shield',
    title: 'Wake Forest & Nearby Areas',
    body: 'Holly Springs, Fuquay-Varina, Garner, Knightdale and surrounding communities.',
  },
];

export const testimonialsHead = {
  eyebrow: 'Client testimonials',
  titleLead: 'Trusted by property teams ',
  titleHighlight: 'across the county.',
  blurb: 'Regional managers, realtors and portfolio owners who replaced four vendors with one coordinator.',
};

export const quoteHead = {
  eyebrow: 'Request a quote',
  title: 'Tell us about your property',
  lede: 'Share the basics and a coordinator will follow up with a customized quote. No online booking, no obligation.',
};

export const quoteAside: IconCard[] = [
  {
    icon: 'user',
    title: 'A coordinator, not a call center',
    body: 'Your request goes to a local coordinator who reviews the property and scopes the work personally.',
  },
  {
    icon: 'clipboard-check',
    title: 'Itemized, transparent quotes',
    body: "You'll see exactly which services are included and what each costs before anything is scheduled.",
  },
  {
    icon: 'grid',
    title: 'Built for multi-property teams',
    body: 'Managing a portfolio? We support recurring turnovers and volume scheduling across Wake County.',
  },
];

// `value` is what POST /pm-requests receives as units_est (an integer): the low end
// of the range, which is what a coordinator sizes the job from. The label is kept
// verbatim in scope_notes so the range itself is never lost.
export const unitRanges: { label: string; value: number }[] = [
  { label: '1 unit', value: 1 },
  { label: '2–10 units', value: 2 },
  { label: '11–50 units', value: 11 },
  { label: '51–200 units', value: 51 },
  { label: '200+ units', value: 200 },
];

export const timelines = [
  'As soon as possible',
  'Within 2 weeks',
  'Within a month',
  'Planning ahead',
];

// `value` matches the server's PMBundle enum exactly — the endpoint's preprocess
// only uppercases and swaps "-" for "_", so "Listing Preparation" would not match.
export const bundleOptions: { value: 'TURNOVER' | 'LISTING_PREP'; title: string; body: string }[] = [
  {
    value: 'TURNOVER',
    title: 'Turnover',
    body: 'Full move-out to move-in preparation between tenants.',
  },
  {
    value: 'LISTING_PREP',
    title: 'Listing Preparation',
    body: 'Finishing work to get a property photo- and market-ready.',
  },
];

export const faqHead = { eyebrow: 'FAQ', title: 'Questions, answered' };

export const faqs: { q: string; a: string }[] = [
  {
    q: 'What property sizes do you support?',
    a: 'Everything from a single rental home to multi-building apartment communities. Whether you manage one door or two hundred, a coordinator scopes the work to your portfolio.',
  },
  {
    q: 'Can multiple services be scheduled together?',
    a: "Yes — that's the point of the bundle. Cleaning, junk removal, repairs, painting, and pressure washing are sequenced back-to-back so the unit is never waiting on a vendor handoff.",
  },
  {
    q: 'How quickly can projects begin?',
    a: 'Once you approve a quote, we schedule promptly — timing depends on scope and current demand. Your coordinator will give you a realistic start date up front, not a guess.',
  },
  {
    q: 'Do you support recurring maintenance?',
    a: 'Yes. Many property teams set up recurring lawn care, cleaning, or seasonal services alongside on-demand turnovers. Mention it in your scope notes and your coordinator will build it into the quote.',
  },
  {
    q: 'How does the quote process work?',
    a: 'Submit the form with your property details. A coordinator reviews the scope, follows up with any questions, and sends an itemized quote. Nothing is scheduled or charged until you approve it.',
  },
];

export const finalCta = {
  title: 'Simplify every property turnover',
  lede: 'Let Apex coordinate every trade so your team can focus on occupancy and growth.',
  primary: { label: 'Request a property manager quote', href: '#quote' },
  secondary: { label: 'Talk to a coordinator', href: 'tel:+19195550100' },
  trust: ['Licensed', 'Bonded', 'Insured', 'Wake County, NC'],
};
