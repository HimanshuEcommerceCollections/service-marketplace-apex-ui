// Media for the Handyman page. Assets live under
// public/assets/handyman/images/ and are named by their slot/role.
import type { MediaTile, HeroBigMedia } from '../../serviceContent';

export const heroBig: HeroBigMedia = {
  type: 'image',
  src: '/assets/handyman/images/hero-big.jpg',
  alt: 'An Apex handyman with a drill and tool belt ready for repairs',
};

export const heroTiles: MediaTile[] = [
  { src: '/assets/handyman/images/hero-m1.jpg', alt: 'Mounting and repair work from a ladder in a bright room' },
  { src: '/assets/handyman/images/hero-m2.jpg', alt: 'Adjusting and repairing kitchen cabinetry' },
  { src: '/assets/handyman/images/hero-m3.jpg', alt: 'Assembling and installing built-in shelving' },
  { src: '/assets/handyman/images/hero-m4.jpg', alt: 'Fixing fittings under a kitchen sink' },
  { src: '/assets/handyman/images/hero-m5.jpg', alt: 'Installing floating shelves level and secure' },
  { src: '/assets/handyman/images/hero-l1.jpg', alt: 'General repairs and installs around the home' },
  { src: '/assets/handyman/images/hero-l2.jpg', alt: 'Cabinet and fixture repairs' },
];
