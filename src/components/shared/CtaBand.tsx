// Shared closing CTA band — the single implementation used by every marketing
// page that ends on a call-to-action.
//
// This is a port of the home page's version (formerly components/apex/Cta.tsx),
// which was chosen as the canonical design: one background film, a teal tint
// overlay, and a cursor "keyhole" that parts the overlay to reveal the footage.
// It replaces five divergent variants that previously lived on 18 routes — two
// video treatments under different class names, an image + floating-icon
// treatment, and a plain gradient band.
//
// Only the copy varies per page; the film, the styling and the behaviour are
// identical everywhere. The video is a single shared asset (no per-page media),
// so it stays warm in cache across navigations.
//
// Class names are namespaced `.acta*` rather than reusing the home page's
// `.cta-band`: six page stylesheets still own unrelated `.cta-row` / `.glow`
// rules, and a distinct namespace keeps this section immune to them.
//
// Styling: src/app/cta-band.css (self-contained — no dependency on the host
// page's design tokens, so it renders identically on all 18 routes).
// Behaviour: mountCtaBand() in src/lib/shared/cta-band.js.

const VIDEO = '/assets/videos/cta-bg.mp4';

// No poster frame yet — ffmpeg is not available on the machine this was built
// on, so one was not extracted. Until it is, prefers-reduced-motion users see
// the band's gradient + tint with no imagery (the film is never played for
// them). To close that gap:
//   ffmpeg -ss 2 -i public/assets/videos/cta-bg.mp4 -frames:v 1 -q:v 4 \
//     public/assets/videos/cta-poster.jpg
// then add `poster="/assets/videos/cta-poster.jpg"` to the <video> below.

/** Right-pointing arrow — inlined so this component owns no page-specific imports. */
function Arrow() {
  return (
    <svg
      className="arrow"
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export interface CtaAction {
  label: string;
  href: string;
}

export interface CtaBandProps {
  heading: string;
  body: string;
  primary: CtaAction;
  /** Omitted on the home page, which is the only single-button variant. */
  secondary?: CtaAction;
  /** Dot-separated trust points below the buttons (property-managers, become-a-pro). */
  trust?: string[];
  /** Anchor id, for pages that link to this section (become-a-pro / property-managers `#join`). */
  id?: string;
}

export default function CtaBand({ heading, body, primary, secondary, trust, id }: CtaBandProps) {
  return (
    <div className="acta-wrap">
      <section className="acta reveal" id={id}>
        {/* Playback is driven by mountCtaBand: played only when scrolled into view,
            and never played at all under prefers-reduced-motion. */}
        <video className="acta-video" muted loop playsInline preload="metadata" aria-hidden="true">
          <source src={VIDEO} type="video/mp4" />
        </video>
        <div className="acta-overlay" aria-hidden="true" />
        <h2>{heading}</h2>
        <p>{body}</p>
        <div className="acta-row">
          <a className="btn acta-btn magnetic" href={primary.href}>
            <span className="btn-inner">
              {primary.label} <Arrow />
            </span>
          </a>
          {secondary && (
            <a className="btn acta-btn-line magnetic" href={secondary.href}>
              <span className="btn-inner">{secondary.label}</span>
            </a>
          )}
        </div>
        {trust && trust.length > 0 && (
          <div className="acta-trust">
            {trust.map((t, i) => (
              <span key={t} style={{ display: 'contents' }}>
                {i > 0 && <span className="dot" />}
                <span>{t}</span>
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
