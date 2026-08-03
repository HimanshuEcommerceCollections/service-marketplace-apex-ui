// Shared content shape for service pages (cleaning, lawn care, and future ones).
// The shared service/Hero and service/Expect components render purely from this,
// so a new service is "a content module + a data folder + a route".

export type HeroBadgeIcon = 'star' | 'shield' | 'clock';
export interface HeroBadge {
  icon: HeroBadgeIcon;
  label: string;
}

export interface MediaTile {
  src: string;
  alt: string;
}

// The only structural variation between service heroes: the large mosaic cell is
// either a looping video (no alt) or an eager image (with alt).
export type HeroBigMedia =
  | { type: 'video'; src: string }
  | { type: 'image'; src: string; alt: string };

export interface HeroContent {
  breadcrumb: string;
  eyebrow: string;
  titleLead: string;
  titleEm: string;
  description: string;
  priceLabel: string;
  price: string;
  bookingSlug: string;
  ctaPrimary: string;
  ctaSecondary: string;
  badges: HeroBadge[];
  bigMedia: HeroBigMedia;
  tiles: MediaTile[];
}

export type ExpectCardIcon = 'clipboard' | 'clock' | 'shield';
export interface ExpectCard {
  icon: ExpectCardIcon;
  title: string;
  body: string;
}

export interface ExpectContent {
  heading: string;
  subheading: string;
  cards: ExpectCard[];
  included: string[];
  excluded: string[];
}

export interface ServiceContent {
  hero: HeroContent;
  expect: ExpectContent;
}

// ---- Full page config consumed by the shared <ServicePage/> ----
// (ServicePlan is structurally identical to the one in components/service/Recurring,
// so config.recurring.plans passes straight through as its prop.)
export interface ServicePlan {
  name: string;
  freq: string;
  amount: string;
  unit?: string;
  disc?: string;
  best?: boolean;
  choose: string;
}

export interface ServiceTestimonial {
  name: string;
  role: string;
  quote: string;
  portrait: string;
}

export interface ServiceConfig {
  /** mountService spec key + /book?service= slug + route folder name */
  slug: string;
  content: ServiceContent;
  recurring: { heading: string; plans: ServicePlan[] };
  finalCta: { blurb: string };
  testimonials: ServiceTestimonial[];
}
