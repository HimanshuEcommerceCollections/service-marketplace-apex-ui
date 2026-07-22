// Media for the cleaning service page. Assets live under
// public/assets/cleaning/{images,videos}/ and are named by their slot/role.
// src + alt are kept here (not hardcoded in components).

export interface Media {
  src: string;
  alt: string;
}

// Hero mosaic background film (the large "B" cell).
export const heroVideo = {
  src: '/assets/cleaning/videos/hero.mp4',
};

// Hero mosaic photo tiles, in DOM order → grid slots m1, m2, m3, m4, m5, l1, l2.
export const heroTiles: Media[] = [
  { src: '/assets/cleaning/images/hero-m1.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-m2.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-m3.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-m4.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-m5.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-l1.webp', alt: 'Apex home service' },
  { src: '/assets/cleaning/images/hero-l2.webp', alt: 'Apex home service' },
];

// Final-CTA background video + its poster still.
export const ctaVideo = {
  src: '/assets/cleaning/videos/cta-bg.mp4',
  poster: '/assets/cleaning/images/cta-poster.jpg',
};
