// Media for the Pest Control page. Assets live under
// public/assets/pest-control/images/ and are named by their slot/role.
import type { MediaTile, HeroBigMedia } from '../../serviceContent';

export const heroBig: HeroBigMedia = {
  type: 'image',
  src: '/assets/pest-control/images/hero-big.jpg',
  alt: 'An Apex technician walking a homeowner through an interior treatment',
};

export const heroTiles: MediaTile[] = [
  { src: '/assets/pest-control/images/hero-m1.jpg', alt: 'Treating baseboards in a modern kitchen' },
  { src: '/assets/pest-control/images/hero-m2.jpg', alt: 'Applying a targeted treatment along kitchen cabinets' },
  { src: '/assets/pest-control/images/hero-m3.jpg', alt: 'Treating a home exterior foundation and entry points' },
  { src: '/assets/pest-control/images/hero-m4.jpg', alt: 'Clearing and treating eaves and rooflines' },
  { src: '/assets/pest-control/images/hero-m5.jpg', alt: 'A careful interior treatment around living-room furniture' },
  { src: '/assets/pest-control/images/hero-l1.jpg', alt: 'A pest-control service vehicle at a residential job' },
  { src: '/assets/pest-control/images/hero-l2.jpg', alt: 'Arriving for a scheduled exterior treatment' },
];
