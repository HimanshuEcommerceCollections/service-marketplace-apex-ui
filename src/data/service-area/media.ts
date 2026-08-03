// Media for the service-area page. Asset files live under
// public/assets/service-area/, named by role/slot (not image-N).
//
// NOTE: the folder is `video/` (singular) as delivered — every other page uses
// `videos/`. Kept as-is so the path matches what is actually on disk.
//
// There is no poster frame for the hero video yet, so <video> has no `poster`
// and the hero shows its own dark background until the first frame decodes.
// Drop a still at images/hero-poster.jpg and add `poster` here to close that gap.

export const heroVideo = {
  src: '/assets/service-area/video/service-area-hero.mp4',
};

// Sits in the coverage section, in the frame the Wake-County map used to fill.
// The filename says "cta" because that is how it was delivered; the final CTA
// band still uses its static images/cta-bg.webp.
export const coverageVideo = {
  src: '/assets/service-area/video/service-area-cta.mp4',
};
