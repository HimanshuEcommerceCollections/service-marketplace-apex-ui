// Copy + structure for the /become-a-pro page, ported from become-a-pro.html.
// Text only — icons live in components/become-a-pro/icons.

export interface IconCard {
  icon: string;
  title: string;
  body: string;
}

export const hero = {
  eyebrow: 'For local trade professionals',
  titleLead: 'Become an ',
  titleEm: 'Apex Pro.',
  lede: 'Join a trusted network of local professionals delivering exceptional home services across Wake County.',
  primary: { label: 'Apply now', href: '#apply' },
  secondary: { label: 'See requirements', href: '#requirements' },
};

export const whyHead = {
  eyebrow: 'Why join Apex',
  title: 'Built for professionals who take pride in the work',
  lede: 'We handle the customers, the requests, and the brand, so you can focus on doing great work and growing.',
};

export const whyCards: IconCard[] = [
  {
    icon: 'building',
    title: 'Consistent local work',
    body: 'A dependable stream of jobs from homeowners in your area, not one-off leads you have to chase.',
  },
  {
    icon: 'clipboard-check',
    title: 'Transparent job requests',
    body: 'See the details up front (scope, location, and timing) before you decide to take a job.',
  },
  {
    icon: 'chart',
    title: 'Grow your business',
    body: 'Build a steady reputation and a loyal customer base as part of a network homeowners already trust.',
  },
  {
    icon: 'shield-check',
    title: 'One trusted brand',
    body: 'Work under the Apex name: professional, insured, and recognized across Wake County.',
  },
];

export const processHead = {
  eyebrow: 'How it works',
  title: 'From application to first job in four steps',
  lede: 'A simple, transparent path to joining the network.',
};

export const processSteps: { title: string; body: string }[] = [
  { title: 'Choose your trades', body: 'Select the services you offer. You can pick more than one.' },
  { title: 'Submit application', body: 'Share your experience and availability in a few short fields.' },
  { title: 'Review & onboarding', body: 'Our team reviews your details and walks you through onboarding.' },
  { title: 'Start receiving opportunities', body: 'Get matched with local job requests that fit your trades.' },
];

export const tradesHead = {
  eyebrow: 'Available trades',
  title: 'Select the services you offer',
  lede: 'Choose one or more trades. Your selections carry straight through to your application.',
};

/**
 * The eleven trades. `slug` is the SERVICE SLUG the API stores and validates
 * against (POST /pro-applications rejects any trade that is not a known service),
 * so these must stay in step with the catalog — never send the display label.
 */
export interface Trade {
  slug: string;
  label: string;
  icon: string;
  blurb: string;
  /** Expectations shown in the Trade Requirements accordion. */
  requirements: string[];
  /** Optional licence flag rendered as a clay pill above the list. */
  licence?: string;
}

export const trades: Trade[] = [
  {
    slug: 'cleaning',
    label: 'Cleaning',
    icon: 'broom',
    blurb: 'Residential & recurring home cleaning.',
    requirements: [
      'Your own cleaning supplies and equipment',
      'Reliable transportation to job sites',
      'Experience with residential cleaning',
    ],
  },
  {
    slug: 'lawn-care',
    label: 'Lawn Care',
    icon: 'leaf',
    blurb: 'Mowing, edging & seasonal upkeep.',
    requirements: [
      'Your own mowing and landscaping equipment',
      'Reliable transportation, ideally with a trailer',
      'Experience with seasonal lawn maintenance',
    ],
  },
  {
    slug: 'power-washing',
    label: 'Power Washing',
    icon: 'spray',
    blurb: 'Driveways, siding & exteriors.',
    requirements: [
      'Professional pressure-washing equipment',
      'Knowledge of safe surface and detergent handling',
      'Reliable transportation to job sites',
    ],
  },
  {
    slug: 'painting',
    label: 'Painting',
    icon: 'roller',
    blurb: 'Interior & exterior finishes.',
    requirements: [
      'Professional painting equipment and tools',
      'Experience with interior and exterior finishes',
      'Proper surface prep and cleanup practices',
    ],
  },
  {
    slug: 'junk-removal',
    label: 'Junk Removal',
    icon: 'trash',
    blurb: 'Hauling & property cleanouts.',
    requirements: [
      'A truck or trailer suitable for hauling',
      'Ability to lift and move heavy items safely',
      'Knowledge of proper disposal and recycling',
    ],
  },
  {
    slug: 'pool',
    label: 'Pool Service',
    icon: 'pool',
    blurb: 'Cleaning, balancing & maintenance.',
    requirements: [
      'Hands-on pool maintenance experience',
      'Understanding of water chemistry and balancing',
      'Your own testing and cleaning equipment',
    ],
  },
  {
    slug: 'pest-control',
    label: 'Pest Control',
    icon: 'bug',
    blurb: 'Treatment & prevention services.',
    licence: 'NC Pest Control License expected',
    requirements: [
      'A valid North Carolina pest control license',
      'Safe handling and application of treatments',
      'Your own equipment and protective gear',
    ],
  },
  {
    slug: 'home-security',
    label: 'Home Security',
    icon: 'shield',
    blurb: 'Alarm & camera installation.',
    licence: 'NC Alarm License expected',
    requirements: [
      'A valid North Carolina alarm/low-voltage license',
      'Experience installing alarm and camera systems',
      'Your own installation tools',
    ],
  },
  {
    slug: 'smart-home',
    label: 'Smart Home',
    icon: 'smart-home',
    blurb: 'Devices, hubs & automation setup.',
    requirements: [
      'Experience installing and configuring smart devices',
      'Familiarity with home networks and hubs',
      'Your own basic installation tools',
    ],
  },
  {
    slug: 'handyman',
    label: 'Handyman',
    icon: 'wrench',
    blurb: 'Repairs & general home fixes.',
    requirements: [
      'General home maintenance and repair experience',
      'Your own hand and power tools',
      'Awareness of when a licensed specialist is required',
    ],
  },
  {
    slug: 'tree-stump',
    label: 'Tree & Stump',
    icon: 'tree',
    blurb: 'Trimming, removal & stump work.',
    requirements: [
      'Proper safety equipment and protective gear',
      'Experience with trimming, removal, and stump work',
      'Appropriate insurance for higher-risk work',
    ],
  },
];

export const requirementsHead = {
  eyebrow: 'Trade requirements',
  title: 'What we expect from our professionals',
  lede: 'These are the standards you should meet for each trade before joining the network.',
};

export const requirementsNote =
  "These are professional expectations, not automatic checks. You're responsible for holding any licenses, insurance, and certifications your trade and local regulations require. We may ask you to confirm them during onboarding.";

export const applyHead = {
  eyebrow: 'Apply to join',
  title: 'Start your application',
  lede: 'Tell us a little about your work. It takes just a couple of minutes.',
};

export const experienceOptions = [
  'Less than 1 year',
  '1–2 years',
  '3–5 years',
  '6–10 years',
  '10+ years',
];

export const availabilityOptions = ['Full-time', 'Part-time', 'Weekends only', 'Flexible / on-call'];

export const startOptions = [
  'As soon as possible',
  'Within 2 weeks',
  'Within a month',
  'Just exploring',
];

/**
 * ZIPs we currently serve. A ZIP outside this list is a soft warning only — the
 * application still submits, matching the source design.
 */
export const wakeZips = [
  '27601', '27603', '27604', '27605', '27606', '27607', '27608', '27609', '27610', '27612',
  '27613', '27614', '27615', '27617', '27519', '27523', '27529', '27539', '27540', '27560',
  '27587', '27591', '27502', '27511', '27513', '27518', '27526', '27545', '27571', '27597',
];

export const statsHead = {
  eyebrow: 'Why professionals choose Apex',
  title: 'A network built on steady, local demand',
};

export const stats: {
  count?: number;
  suffix?: string;
  word?: string;
  label: string;
  sub: string;
}[] = [
  { count: 100, suffix: '+', label: 'Weekly Requests', sub: 'Across Wake County' },
  { count: 11, label: 'Service Categories', sub: 'One place to grow' },
  { word: 'Local', label: 'Wake County Coverage', sub: 'Work close to home' },
  { word: 'Trusted', label: 'Single Brand', sub: 'Recognized & insured' },
];

export const testimonialsHead = {
  eyebrow: 'From our professionals',
  titleLead: 'Trusted by tradespeople ',
  titleHighlight: 'across the county.',
  blurb: 'Lawn crews, cleaners and handymen who filled their week without chasing leads.',
};

export const faqHead = { eyebrow: 'FAQ', title: 'Questions, answered' };

export const faqs: { q: string; a: string }[] = [
  {
    q: 'Can I apply for multiple trades?',
    a: "Yes. Select every trade you're qualified to offer during the application. Many of our professionals work across more than one. You'll be matched with requests that fit any of your selected trades.",
  },
  {
    q: 'Do I need my own equipment?',
    a: "For most trades, yes. You should have the tools, supplies, and reliable transportation your work requires. The Trade Requirements section above lists what's expected for each service.",
  },
  {
    q: 'How are jobs assigned?',
    a: "Requests are matched to professionals based on trade, location, and availability. You'll see the scope, area, and timing up front, so you can decide whether a job is a good fit before taking it.",
  },
  {
    q: 'Which areas do you serve?',
    a: 'We currently serve homeowners across Wake County, North Carolina, including Raleigh, Cary, Apex, Morrisville, Wake Forest, Holly Springs, and surrounding communities.',
  },
  {
    q: 'How long does approval take?',
    a: "After you apply, our team reviews your details and follows up to walk you through onboarding. Timing varies with the trade and current demand, and we'll keep you informed at each step.",
  },
];

export const finalCta = {
  title: 'Grow your business with Apex',
  lede: 'Join a trusted local network serving homeowners across Wake County.',
  primary: { label: 'Become an Apex Pro', href: '#apply' },
  secondary: { label: 'See requirements', href: '#requirements' },
  trust: ['Licensed', 'Bonded', 'Insured', 'Wake County, NC'],
};
