// Media for the Painting page. Assets live under
// public/assets/painting/images/ and are named by their slot/role
// (hero-big + mosaic tiles m1-m5, l1, l2), same as data/cleaning/media.ts.
import type { MediaTile, HeroBigMedia } from '../../serviceContent';

export const heroBig: HeroBigMedia = {
  type: 'image',
  src: '/assets/painting/images/hero-big.png',
  alt: 'An Apex painter in a clean uniform ready to start an interior project',
};

// DOM order -> grid slots m1, m2, m3, m4, m5, l1, l2 (m3 is the tall cell).
export const heroTiles: MediaTile[] = [
  { src: '/assets/painting/images/hero-m1.png', alt: 'Painters refreshing the exterior of a luxury suburban home' },
  { src: '/assets/painting/images/hero-m2.png', alt: 'Rolling a premium finish onto an interior wall' },
  { src: '/assets/painting/images/hero-m3.png', alt: 'A modern living room with a freshly painted feature wall' },
  { src: '/assets/painting/images/hero-m4.png', alt: 'Refinishing kitchen cabinets to a smooth, even finish' },
  { src: '/assets/painting/images/hero-m5.png', alt: 'Detail work cutting in a clean, crisp paint edge' },
  { src: '/assets/painting/images/hero-l1.png', alt: 'A dramatic before-and-after exterior paint refresh' },
  { src: '/assets/painting/images/hero-l2.png', alt: 'Large-scale commercial exterior painting' },
];
