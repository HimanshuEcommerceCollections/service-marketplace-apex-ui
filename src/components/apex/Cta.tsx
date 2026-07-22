// section: CTA band. The cursor spotlight (.cta-band.spot) and reveal are wired by
// the runtime; the film plays via the shared in-view video observer.
import { Arrow } from './icons';

export default function Cta() {
  return (
    <div className="cta-wrap">
      <div className="cta-band reveal">
        <video className="cta-video" autoPlay muted loop playsInline preload="metadata">
          <source src="/assets/videos/video-10.mp4" type="video/mp4" />
        </video>
        <div className="cta-overlay" />
        <h2>The whole house, handled by one team.</h2>
        <p>
          Tell us what your home needs. We&rsquo;ll bring the right trade, a clear price, and a
          coordinator who owns the outcome.
        </p>
        <a className="btn magnetic" href="#book">
          <span className="btn-inner">
            Book a Service <Arrow />
          </span>
        </a>
      </div>
    </div>
  );
}
