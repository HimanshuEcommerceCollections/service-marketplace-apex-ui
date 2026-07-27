// Media for the Pool Service page. Assets live under
// public/assets/pool/images/ and are named by their slot/role.
import type { MediaTile, HeroBigMedia } from '../../serviceContent';

export const heroBig: HeroBigMedia = {
  type: 'image',
  src: '/assets/pool/images/hero-big.png',
  alt: 'A crystal-clear infinity pool overlooking a scenic view',
};

export const heroTiles: MediaTile[] = [
  { src: '/assets/pool/images/hero-m1.png', alt: 'An Apex technician servicing a backyard pool' },
  { src: '/assets/pool/images/hero-m2.png', alt: 'A modern residential pool with premium stone tiling' },
  { src: '/assets/pool/images/hero-m3.png', alt: 'A luxury pool glowing with underwater lighting at night' },
  { src: '/assets/pool/images/hero-m4.png', alt: 'Aerial view of a pristine geometric pool' },
  { src: '/assets/pool/images/hero-m5.png', alt: 'A private backyard pool oasis framed by lush planting' },
  { src: '/assets/pool/images/hero-l1.png', alt: 'Sunlight reflecting on crystal-clear pool water' },
  { src: '/assets/pool/images/hero-l2.png', alt: 'A high-end pool filtration and cleaning system' },
];
