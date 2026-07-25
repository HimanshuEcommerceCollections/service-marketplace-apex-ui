// How It Works — the 11 service cards in the "All services" grid.
// "Learn more" → the service's real route; "Book now" → /book?service=<slug>
// (route + slug mapping matches SiteNav / the pricing overview grid).
import type { IconKey } from '../../components/how-it-works/icons';

export interface HiwService {
  id: string;
  name: string;
  icon: IconKey;
  image: string;
  desc: string;
  learnHref: string;
  bookHref: string;
}

export const services: HiwService[] = [
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    icon: 'cleaning',
    image: '/assets/how-it-works/images/card-cleaning.webp',
    desc: 'Recurring or one-time, priced by beds & baths.',
    learnHref: '/services/house-cleaning',
    bookHref: '/book?service=cleaning',
  },
  {
    id: 'lawn',
    name: 'Lawn Care',
    icon: 'lawn',
    image: '/assets/how-it-works/images/card-lawn.webp',
    desc: 'Mowing, edging & full lawn care on your schedule.',
    learnHref: '/services/lawncare',
    bookHref: '/book?service=lawn-care',
  },
  {
    id: 'power-washing',
    name: 'Power Washing',
    icon: 'power',
    image: '/assets/how-it-works/images/card-power-washing.webp',
    desc: 'Driveways, siding & decks blasted back to new.',
    learnHref: '/services/power-washing',
    bookHref: '/book?service=power-washing',
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: 'paint',
    image: '/assets/how-it-works/images/card-painting.webp',
    desc: 'Interior & exterior painting, done clean and sharp.',
    learnHref: '/services/painting',
    bookHref: '/book?service=painting',
  },
  {
    id: 'junk-removal',
    name: 'Junk Removal',
    icon: 'junk',
    image: '/assets/how-it-works/images/card-junk-removal.webp',
    desc: 'Lift, load & haul-away — priced by truck load.',
    learnHref: '/services/junk-removal',
    bookHref: '/book?service=junk-removal',
  },
  {
    id: 'pool',
    name: 'Pool Service',
    icon: 'pool',
    image: '/assets/how-it-works/images/card-pool.webp',
    desc: 'Skim, vacuum, brush & chemical balancing.',
    learnHref: '/services/pool',
    bookHref: '/book?service=pool',
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    icon: 'pest',
    image: '/assets/how-it-works/images/card-pest-control.webp',
    desc: 'Interior + exterior treatment, pet & family safe.',
    learnHref: '/services/pest-control',
    bookHref: '/book?service=pest-control',
  },
  {
    id: 'home-security',
    name: 'Home Security',
    icon: 'security',
    image: '/assets/how-it-works/images/card-home-security.webp',
    desc: 'Cameras, sensors & monitoring, tailored to your home.',
    learnHref: '/services/home-security',
    bookHref: '/book?service=home-security',
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    icon: 'smart',
    image: '/assets/how-it-works/images/card-smart-home.webp',
    desc: 'Thermostats, locks, cameras — bundle & save.',
    learnHref: '/services/smart-home',
    bookHref: '/book?service=smart-home',
  },
  {
    id: 'handyman',
    name: 'Handyman',
    icon: 'handyman',
    image: '/assets/how-it-works/images/card-handyman.webp',
    desc: 'Repairs & odd jobs, booked by the block of time.',
    learnHref: '/services/handyman',
    bookHref: '/book?service=handyman',
  },
  {
    id: 'tree-stump',
    name: 'Tree & Stump',
    icon: 'tree',
    image: '/assets/how-it-works/images/card-tree-stump.webp',
    desc: 'Trimming, removal & stump grinding by pros.',
    learnHref: '/services/tree-stump',
    bookHref: '/book?service=tree-stump',
  },
];
