// How It Works — all copy for the page, ported verbatim from
// apex-how-it-works_extracted.html. Links are remapped to real routes:
//   apex-booking.html        → /book
//   apex-pricing.html        → /pricing
//   apex-membership-plans.html → /membership-plans
import type { IconKey } from '../../components/how-it-works/icons';

export interface Cta {
  label: string;
  href: string;
}

/* ---------------- HERO ---------------- */
export const hero = {
  eyebrow: 'How it works',
  titleLead: 'From booking to a perfect home—',
  titleEm: 'it’s that simple.',
  lede:
    'Whether you need a one-time service or recurring home maintenance, Apex makes every step simple, transparent, and stress-free.',
  primary: { label: 'Book a service', href: '/book' } as Cta,
  secondary: { label: 'View pricing', href: '/pricing' } as Cta,
  card: {
    label: 'Book in ~90 seconds',
    steps: ['Choose your service', 'Customize the details', 'Book online', 'We handle everything'],
    cta: { label: 'Get started', href: '/book' } as Cta,
  },
};

/* ---------------- PROCESS (vertical 5-step timeline) ---------------- */
export interface ProcessStep {
  icon: IconKey;
  side: 'left' | 'right';
  title: string;
  points: string[];
  cta: Cta;
}

export const processHead = {
  eyebrow: 'The Apex process',
  title: 'Your home service journey.',
  lede: 'Five simple steps from tap to a home you love.',
};

export const processSteps: ProcessStep[] = [
  {
    icon: 'clipboardCheck',
    side: 'left',
    title: 'Choose your service',
    points: ['Browse all 11 services', 'Select the one you need', 'View pricing or request a quote'],
    cta: { label: 'View pricing', href: '/pricing' },
  },
  {
    icon: 'sliders',
    side: 'right',
    title: 'Customize your service',
    points: ['Configure service details', 'Select frequency', 'Choose property size', 'Add optional services'],
    cta: { label: 'Start customizing', href: '/book' },
  },
  {
    icon: 'calendarCheck',
    side: 'left',
    title: 'Book online',
    points: ['Enter your contact details', 'Confirm your address', 'Review booking summary', 'Submit request'],
    cta: { label: 'Book online', href: '/book' },
  },
  {
    icon: 'security',
    side: 'right',
    title: 'Professional visit',
    points: ['Licensed professionals arrive', 'Equipment included', 'Quality inspection', 'Job completion'],
    cta: { label: 'See what’s included', href: '/pricing' },
  },
  {
    icon: 'home',
    side: 'left',
    title: 'Relax & enjoy',
    points: ['Your home looks great', 'Satisfaction guarantee', 'Easy rebooking', 'Membership recommendations'],
    cta: { label: 'Explore membership', href: '/membership-plans' },
  },
];

/* ---------------- JOURNEY (horizontal 6-milestone timeline) ---------------- */
export interface Milestone {
  icon: IconKey;
  title: string;
  caption: string;
}

export const journeyHead = {
  eyebrow: 'The journey',
  title: 'One smooth path, start to finish.',
};

export const milestones: Milestone[] = [
  { icon: 'cleaning', title: 'Choose service', caption: 'Pick from 11 services' },
  { icon: 'paint', title: 'Customize', caption: 'Set frequency & size' },
  { icon: 'security', title: 'Book', caption: 'Confirm & submit' },
  { icon: 'handyman', title: 'Professional visit', caption: 'Vetted pros arrive' },
  { icon: 'power', title: 'Complete', caption: 'Quality-checked finish' },
  { icon: 'pool', title: 'Recurring membership', caption: 'Lock in savings' },
];

/* ---------------- WHY / EFFORTLESS (4 cards + 4 stats) ---------------- */
export interface EffortCard {
  icon: IconKey;
  title: string;
  body: string;
}

export const effortlessHead = {
  eyebrow: 'Why homeowners choose Apex',
  title: 'Built to be effortless.',
};

export const effortlessCards: EffortCard[] = [
  { icon: 'dollar', title: 'Transparent pricing', body: 'See the full breakdown before you ever book — no hidden fees.' },
  { icon: 'security', title: 'Trusted local experts', body: 'Vetted, insured, background-checked pros who know Wake County.' },
  { icon: 'dollar', title: 'Recurring savings', body: 'Members save up to 15% every visit with locked-in pricing.' },
  { icon: 'calendar', title: 'Easy scheduling', body: 'Book, reschedule, or skip in seconds — no calls, no contracts.' },
];

export interface Stat {
  value: number;
  dec: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 12000, dec: 0, suffix: '+', label: 'Homes served' },
  { value: 4.9, dec: 1, suffix: '', label: 'Average rating' },
  { value: 98, dec: 0, suffix: '%', label: 'On-time visits' },
  { value: 3400, dec: 0, suffix: '+', label: 'Recurring members' },
];

/* ---------------- ALL SERVICES head ---------------- */
export const servicesHead = {
  eyebrow: 'All services',
  title: 'Explore every Apex service.',
};

/* ---------------- TESTIMONIALS head ---------------- */
export const testimonialsHead = {
  eyebrow: 'Testimonials',
  titleLead: 'Loved by Wake County ',
  titleHighlight: 'homes.',
  blurb: 'Real homeowners, one accountable team — booked in seconds and done right the first time.',
};

/* ---------------- FAQ ---------------- */
export interface Faq {
  q: string;
  a: string;
}

export const faqHead = {
  eyebrow: 'Questions',
  title: 'Good to know.',
};

export const faqs: Faq[] = [
  {
    q: 'How long does booking take?',
    a: 'About 90 seconds. Pick a service, configure it, add your details, and submit — you’ll see transparent pricing the whole way.',
  },
  {
    q: 'Can I reschedule?',
    a: 'Anytime, with no fees. Move, skip, or cancel a visit from your account — recurring plans are month-to-month with no lock-in.',
  },
  {
    q: 'Do I need to be home?',
    a: 'Not necessarily. Many services can be completed with access instructions. For anything requiring entry, your coordinator will arrange the details with you.',
  },
  {
    q: 'How do recurring plans work?',
    a: 'You choose a frequency and we lock in a discounted per-visit rate with the same trusted crew. Pause, switch, or cancel whenever you like.',
  },
];

/* ---------------- FINAL CTA ---------------- */
export const cta = {
  title: 'Ready to experience the Apex difference?',
  body: 'Book your first service today and discover why homeowners trust Apex for every part of their home.',
  primary: { label: 'Book now', href: '/book' } as Cta,
  secondary: { label: 'Explore services', href: '/pricing' } as Cta,
};
