// section 3: COVERAGE — a video beside four glass stat cards (counters animate
// via the runtime when they scroll into view).
//
// The video inherits the frame the Wake-County map used to occupy: .cov-vid
// reuses the .map glass treatment, so it keeps the same rounded, bordered box
// at the same aspect beside the stat grid. Below the fold, so it preloads
// metadata only and the runtime plays it only while it is on screen.
import SecHead from './SecHead';
import { coverageVideo } from '../../data/service-area/media';
import { coverageStats } from '../../data/service-area/content';

export default function Coverage() {
  return (
    <section className="sec" style={{ background: 'var(--mist)' }}>
      <SecHead eyebrow="Coverage" title="Where we work across Wake County." />
      <div className="swrap">
        <div className="cov-grid">
          <div className="cov-map reveal">
            <video className="cov-vid" muted loop playsInline preload="metadata">
              <source src={coverageVideo.src} type="video/mp4" />
            </video>
          </div>
          <div className="cov-stats reveal sc">
            {coverageStats.map((s) => (
              <div className="cstat reveal sc" key={s.label}>
                <div className="sv">
                  <span data-count={s.count} data-dec="0">
                    0
                  </span>
                  {s.suffix}
                </div>
                <div className="sl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
