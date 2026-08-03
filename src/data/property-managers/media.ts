// Media for the /property-managers page. Asset files live under
// public/assets/property-managers/{images,videos}/.
//
// Same shape as data/pricing/media.ts and data/service-area/media.ts: the section
// components stay presentational and every path lives here, so swapping footage
// or photography is a one-line edit. Filenames are as delivered.
//
// WEIGHT: the two clips ship at ~8.5MB (hero) and ~15MB (coverage) — well above
// the 2.4–3.7MB the other pages' background videos come in at. The hero one
// downloads on every page load; the coverage one waits until its section is
// scrolled to. Both are worth re-encoding smaller.

/**
 * Full-bleed background video behind the hero copy. Plays from page load.
 *
 * No poster frame was delivered, so the hero shows its own teal gradient until
 * the first frame decodes (same situation as the service-area hero). Drop a still
 * at images/hero-poster.jpg and add `poster` here to close that gap.
 */
export const heroVideo: { src: string; poster?: string } = {
  src: '/assets/property-managers/videos/property-manager-hero.mp4',
};

/**
 * The listing-prep before/after pair. Both fill the whole card and are clipped to
 * opposite sides of the diagonal, so the split reads as a wipe between the two
 * states of the same property.
 */
export const listingBeforeAfter = {
  before: {
    src: '/assets/property-managers/images/property-manager-before.jpeg',
    alt: 'Property before Apex listing preparation',
  },
  after: {
    src: '/assets/property-managers/images/property-manager-after.jpeg',
    alt: 'The same property after Apex listing preparation',
  },
};

/**
 * Sits in the frame the illustrated Wake-County map used to fill. Below the fold,
 * so it preloads metadata only and the runtime plays it only while on screen.
 *
 * No poster frame was delivered; the frame's own gradient backdrop shows until the
 * first frame decodes. Drop a still at images/coverage-poster.jpg and add `poster`
 * here if that gap ever shows.
 */
export const coverageVideo: { src: string; poster?: string } = {
  src: '/assets/property-managers/videos/property-manager-service-coverage.mp4',
};
