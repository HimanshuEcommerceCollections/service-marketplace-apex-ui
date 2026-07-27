// Media for the Smart Home page. Assets live under
// public/assets/smart-home/images/ and are named by their slot/role.
import type { MediaTile, HeroBigMedia } from '../../serviceContent';

export const heroBig: HeroBigMedia = {
  type: 'image',
  src: '/assets/smart-home/images/hero-big.jpg',
  alt: 'A family controlling their smart home from a single app',
};

export const heroTiles: MediaTile[] = [
  { src: '/assets/smart-home/images/hero-m1.jpg', alt: 'Adjusting lights and climate from a phone app' },
  { src: '/assets/smart-home/images/hero-m2.jpg', alt: 'One-tap control of a connected home' },
  { src: '/assets/smart-home/images/hero-m3.jpg', alt: 'A wall-mounted control panel in an open-plan living space' },
  { src: '/assets/smart-home/images/hero-m4.jpg', alt: 'Managing scenes and routines from the couch' },
  { src: '/assets/smart-home/images/hero-m5.jpg', alt: 'A connected living room at your fingertips' },
  { src: '/assets/smart-home/images/hero-l1.jpg', alt: 'Whole-home connectivity, monitored around the clock' },
  { src: '/assets/smart-home/images/hero-l2.jpg', alt: 'A smart-home dashboard bringing every device together' },
];
