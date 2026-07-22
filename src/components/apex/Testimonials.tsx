// section: TESTIMONIALS. The card track (#txTrack), stars and quote block are
// populated by the runtime; portraits are served from /assets/images/portrait-*.webp
// (externalized from the original inline base64).

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div className="tx-wrap">
        <div className="tx-head">
          <span className="tx-eyebrow">Testimonials</span>
          <h2>
            Loved by Wake County <span className="tx-hl">homes.</span>
          </h2>
          <p>
            Real homeowners, one accountable team — booked in seconds and done right the first time.
          </p>
        </div>
        <div className="tx-band">
          <button className="tx-arrow" id="txPrev" aria-label="Previous">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
