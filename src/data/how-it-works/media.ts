// How It Works page — image slots. The hero background and the final-CTA
// background were `image-1.webp` / `image-13.webp` in the extracted design;
// they now live under public/assets/how-it-works/ named by role.

export interface Media {
  src: string;
  alt: string;
}

export const heroBg: Media = {
  src: '/assets/how-it-works/images/hero-bg.webp',
  alt: 'A homeowner booking an Apex service on a tablet',
};
