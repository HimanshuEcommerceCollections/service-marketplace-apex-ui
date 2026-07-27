# Power Washing assets

Per-service asset folder, same convention as `assets/cleaning/` and
`assets/lawn-care/`: folder name = the service **slug** (`power-washing` — the
`mountService` spec key and `/book?service=` value), split into `images/` and
`videos/`, files named by their **slot/role** — never `image-N`.

Wired up in `src/data/services/power-washing/media.ts` (src + alt), consumed by
`content.ts` → shared `<ServicePage>`.

## images/ — present

Hero mosaic grid is `"B B t1 t2" / "B B t3 t4" / "l1 l2 t3 t5"`
(`src/app/services/service.css`), so `big` is the 2x2 anchor, `m3` is the tall
cell, and `m1/m2/m4/m5/l1/l2` are small tiles.

| File | Slot | Shot |
| --- | --- | --- |
| `hero-big.jpg` | B (2x2) | Apex-branded tech, driveway rinse |
| `hero-m1.jpg` | t1 | garage door + brick facade |
| `hero-m2.jpg` | t2 | wood deck, moss lifted |
| `hero-m3.jpg` | t3 (tall) | cedar fence, before/after stripe |
| `hero-m4.jpg` | t4 | surface cleaner, crisp line on driveway |
| `hero-m5.jpg` | t5 | surface cleaner, driveway + rig |
| `hero-l1.jpg` | l1 | house siding before/after |
| `hero-l2.jpg` | l2 | commercial high-rise from lifts |

Two of these need a second look — see "Known issues" below.

## Still needed

| File | Slot | Notes |
| --- | --- | --- |
| `videos/cta-bg.mp4` | final-CTA background film | until then `content.ts` uses `placeholderCtaVideo` (cleaning's film) |
| `images/cta-poster.jpg` | poster still for the above | pair with the film |
| `images/testimonial-<firstname>.jpg` | testimonial portraits | only if the design ships its own; currently the shared `/assets/images/portrait-*.webp` |

## Known issues

- **`hero-l1.jpg` shows a competitor's branding** — the van and the tech's shirt
  read "ELITE Power Wash Solutions". Replace before this ships.
- **`hero-l2.jpg` is a commercial high-rise**, off-message for a residential
  home-services page.
- **These are JPEGs, not WebP.** Every other service's tiles are `.webp`; there
  is no `sharp`/ImageMagick in this environment to convert with. ~3.1 MB total
  for the hero mosaic — worth re-encoding to WebP.
