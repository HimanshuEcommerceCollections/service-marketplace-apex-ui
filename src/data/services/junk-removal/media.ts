// Media for the Junk Removal page. Assets live under
// public/assets/junk-removal/images/ and are named by their slot/role.
import type { MediaTile, HeroBigMedia } from '../../serviceContent';

export const heroBig: HeroBigMedia = {
  type: 'image',
  src: '/assets/junk-removal/images/hero-big.jpg',
  alt: 'An Apex crew loading appliances for haul-away',
};

export const heroTiles: MediaTile[] = [
  { src: '/assets/junk-removal/images/hero-m1.jpg', alt: 'A cluttered yard cleared in a single visit' },
  { src: '/assets/junk-removal/images/hero-m2.jpg', alt: 'Carrying out an old sofa and electronics for recycling' },
  { src: '/assets/junk-removal/images/hero-m3.jpg', alt: 'Sorting a driveway pile for donation and recycling' },
  { src: '/assets/junk-removal/images/hero-m4.jpg', alt: 'Loading a bulky couch into the haul-away truck' },
  { src: '/assets/junk-removal/images/hero-m5.jpg', alt: 'Filling the truck on a full-home cleanout' },
  { src: '/assets/junk-removal/images/hero-l1.jpg', alt: 'A junk-removal truck loaded and ready to haul' },
  { src: '/assets/junk-removal/images/hero-l2.jpg', alt: 'Carrying out furniture and household items' },
];
