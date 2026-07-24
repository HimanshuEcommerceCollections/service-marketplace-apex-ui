// Membership plan cards. Ported verbatim from the "MEMBERSHIP PLANS" section of
// apex-membership-plans_extracted.html — service name, cadence tag, from-price,
// feature bullets, and the (verbatim) booking href for each plan.

export interface MembershipPlan {
  id: string;
  name: string;
  tag: string;
  price: string;
  image: string;
  alt: string;
  features: string[];
  bookHref: string;
}

export const plans: MembershipPlan[] = [
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    tag: 'Bi-weekly',
    price: '$149',
    image: '/assets/membership/images/plan-cleaning.webp',
    alt: 'Home Cleaning',
    features: [
      'Same trusted 2-person team',
      'Kitchen, baths & all rooms',
      'Free re-clean guarantee',
      'Supplies included',
    ],
    bookHref: '/book?service=cleaning&plan=recurring',
  },
  {
    id: 'lawn',
    name: 'Lawn Care',
    tag: 'Weekly',
    price: '$53',
    image: '/assets/membership/images/plan-lawn.webp',
    alt: 'Lawn Care',
    features: [
      'Mow, edge, trim & blow',
      'Seasonal height adjustments',
      'Priority weather rescheduling',
      'Same crew each visit',
    ],
    bookHref: '/book?service=lawn-care&plan=recurring',
  },
  {
    id: 'pool',
    name: 'Pool Service',
    tag: 'Weekly',
    price: '$119',
    image: '/assets/membership/images/plan-pool.webp',
    alt: 'Pool Service',
    features: ['Skim, vacuum & brush', 'Chemical balancing', 'Equipment health check', 'Filter maintenance'],
    bookHref: '/book?service=pool&plan=recurring',
  },
  {
    id: 'power-washing',
    name: 'Power Washing',
    tag: 'Seasonal',
    price: '$79',
    image: '/assets/membership/images/plan-power-washing.webp',
    alt: 'Power Washing',
    features: [
      'Driveways, siding & decks',
      'Surface-safe pressure',
      'Free re-wash guarantee',
      'Bundle & save rates',
    ],
    bookHref: '/book?service=power-washing&plan=recurring',
  },
];
