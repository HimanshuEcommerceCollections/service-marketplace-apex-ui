// Media for the /become-a-pro page. Asset files live under
// public/assets/become-a-pro/videos/, named by role/slot (not image-N).
//
// Same shape as data/property-managers/media.ts and data/pricing/media.ts: the
// section components stay presentational and every path lives here, so swapping
// footage is a one-line edit.
//
// This clip ships at ~3MB, in line with the other pages' background videos
// (2.4–3.7MB) — unlike the property-managers pair, which is well above that.

/**
 * Full-bleed background video behind the hero copy. Plays from page load.
 *
 * If the file is absent the hero simply keeps its teal gradient — the same look
 * it had before the video was added — so this degrades cleanly. Add `poster` once
 * a still frame exists to cover the gap before the first frame decodes.
 */
export const heroVideo: { src: string; poster?: string } = {
  src: '/assets/become-a-pro/videos/become-a-pro-hero.mp4',
};
