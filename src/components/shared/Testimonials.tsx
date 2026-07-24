// Shared testimonials section — the home page's design ("tx-*"), now used on
// every page. Renders the shell; the track/stars/quote are populated by a driver:
//   - home: the apex runtime's initTestimonials (gsap-animated)
//   - other pages: mountTestimonials() from lib/shared/testimonials.js (no gsap)
// Both operate on the same #testimonials markup by id. Styling: app/testimonials.css
// (imported by each route page).

interface TestimonialsProps {
  eyebrow?: string;
  titleLead?: string;
  titleHighlight?: string;
  blurb?: string;
}

export default function Testimonials({
  eyebrow = 'Testimonials',
  titleLead = 'Loved by Wake County ',
  titleHighlight = 'homes.',
  blurb = 'Real homeowners, one accountable team — booked in seconds and done right the first time.',
}: TestimonialsProps) {
  return (
    <section id="testimonials">
      <div className="tx-wrap">
        <div className="tx-head">
          <span className="tx-eyebrow">{eyebrow}</span>
          <h2>
            {titleLead}
            <span className="tx-hl">{titleHighlight}</span>
          </h2>
          <p>{blurb}</p>
        </div>
        <div className="tx-band">
          <button className="tx-arrow" id="txPrev" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="tx-track" id="txTrack" />
          <div className="tx-quote">
            <div className="tx-stars" id="txStars" />
            <blockquote id="txQuote" />
            <div className="tx-cite">
              <span className="tx-who" id="txWho" />
              <span className="tx-role" id="txRole" />
            </div>
            <span className="tx-qmark">{'”'}</span>
          </div>
          <button className="tx-arrow" id="txNext" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
