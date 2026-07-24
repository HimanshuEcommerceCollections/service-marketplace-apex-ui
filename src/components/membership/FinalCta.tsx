// section: FINAL CTA — join-the-club banner with a background video + cursor spotlight
// (playback + spotlight wired by the runtime). Booking / tel links kept verbatim.
import { ctaVideo } from '../../data/membership/media';

export default function FinalCta() {
  return (
    <section className="cta-band reveal">
      <video className="cta-vid" autoPlay muted loop playsInline preload="metadata" poster={ctaVideo.poster}>
        <source src={ctaVideo.src} type="video/mp4" />
      </video>
      <div className="cta-veil" />
      <div className="cta-spot">
        <span className="blob" />
      </div>
      <span className="glow" />
      <h2>Join the club that keeps your home effortless.</h2>
      <p>Start a plan in about 90 seconds. Member pricing, the same trusted pros, and zero contracts.</p>
      <div className="cta-row">
        <a className="btn btn-primary" href="/book?plan=recurring">
          Book a plan{' '}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
        <a className="btn btn-line" href="tel:+19195550100">
          Contact our team
        </a>
      </div>
    </section>
  );
}
