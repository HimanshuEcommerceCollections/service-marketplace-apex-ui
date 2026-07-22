// Media for the lawn care page. Assets under public/assets/lawn-care/, named by
// slot/role. Unlike cleaning, the hero mosaic's large cell is an image (not a video).

export interface Media {
  src: string;
  alt: string;
}

// Hero mosaic large "B" cell (image, loaded eagerly in the source).
export const heroBig: Media = {
  src: '/assets/lawn-care/images/hero-big.webp',
  alt: 'Apex lawn care crew',
};

// Hero mosaic photo tiles, DOM order → grid slots m1, m2, m3, m4, m5, l1, l2.
export const heroTiles: Media[] = [
  { src: '/assets/lawn-care/images/hero-m1.webp', alt: 'Mowing at the ideal height' },
  { src: '/assets/lawn-care/images/hero-m2.webp', alt: 'Edging and string-trimming' },
  { src: '/assets/lawn-care/images/hero-m3.webp', alt: 'Measured cut height' },
  { src: '/assets/lawn-care/images/hero-m4.webp', alt: 'Blowing clippings off hard surfaces' },
  { src: '/assets/lawn-care/images/hero-m5.webp', alt: 'Mowing at the ideal height' },
  { src: '/assets/lawn-care/images/hero-l1.webp', alt: 'Edging and string-trimming' },
  { src: '/assets/lawn-care/images/hero-l2.webp', alt: 'Blowing clippings off hard surfaces' },
];

// Final-CTA background video + poster still.
export const ctaVideo = {
  src: '/assets/lawn-care/videos/cta-bg.mp4',
  poster: '/assets/lawn-care/images/cta-poster.jpg',
};
