// section: FINAL CTA — background video + cursor spotlight (spotlight in runtime).
import { ctaVideo } from '../../data/lawncare/media';

export default function FinalCta() {
  return (
    <section className="final reveal has-video">
      <video className="final-vid" autoPlay muted loop playsInline preload="metadata" poster={ctaVideo.poster}>
        <source src={ctaVideo.src} type="video/mp4" />
      </video>
      <div className="final-veil" />
      <div className="final-spot">
        <span className="blob" />
      </div>
      <h2>One call. Whole house handled.</h2>
      <p>Mowing, edging and full lawn care, priced by lot size, handled by the same crew on the schedule you set.</p>
      <div className="row">
        <a className="btn btn-primary" href="/book?service=lawn-care">
          Book this service{' '}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
        <a className="btn btn-line" href="tel:+19195550100">
          Call (919) 555-0100
        </a>
      </div>
    </section>
  );
}
