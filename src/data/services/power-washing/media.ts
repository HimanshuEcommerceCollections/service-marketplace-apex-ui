// Media for the Power Washing page. Assets live under
// public/assets/power-washing/{images,videos}/ and are named by their slot/role.
// src + alt are kept here (not hardcoded in components), same as
// data/cleaning/media.ts and data/lawncare/media.ts.
import type { MediaTile, HeroBigMedia } from '../../serviceContent';

// Hero mosaic big "B" cell (2x2, top-left) — an image, not a film.
export const heroBig: HeroBigMedia = {
  type: 'image',
  src: '/assets/power-washing/images/hero-big.jpg',
  alt: 'Apex technician rinsing a residential driveway with a pressure washer',
};

// Hero mosaic photo tiles, DOM order → grid slots m1, m2, m3, m4, m5, l1, l2.
// m3 is the tall cell (spans two rows); l1/l2 are the small bottom-left pair.
export const heroTiles: MediaTile[] = [
  { src: '/assets/power-washing/images/hero-m1.jpg', alt: 'Washing grime off a garage door and brick facade' },
  { src: '/assets/power-washing/images/hero-m2.jpg', alt: 'Lifting moss and algae off a weathered wood deck' },
  { src: '/assets/power-washing/images/hero-m3.jpg', alt: 'A cedar fence washed back to bare, clean wood' },
  { src: '/assets/power-washing/images/hero-m4.jpg', alt: 'Surface cleaner cutting a clean line across a concrete driveway' },
  { src: '/assets/power-washing/images/hero-m5.jpg', alt: 'Surface cleaner flushing dirt off a driveway' },
  { src: '/assets/power-washing/images/hero-l1.jpg', alt: 'House siding and stonework washed clean' },
  { src: '/assets/power-washing/images/hero-l2.jpg', alt: 'Washing a multi-storey commercial exterior from lifts' },
];

// TODO(design): no power-washing final-CTA film was delivered, so content.ts still
// points at placeholderCtaVideo. Drop cta-bg.mp4 + cta-poster.jpg into
// assets/power-washing/{videos,images}/ and export ctaVideo here to swap it.
