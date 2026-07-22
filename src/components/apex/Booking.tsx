// section: BOOKING configurator. The stepper, panels, calendar, forms, review and
// confirmation stage are all built imperatively by the runtime's bookingInit()
// into the ids below (verbatim from the original vanilla JS).

export default function Booking() {
  return (
    <section className="book" id="book">
      <div className="book-ambient" />
      <div className="book-head">
        <div className="eyebrow">Book Your Service</div>
        <h2>
          Book your service
          <br />
          in just a few minutes.
        </h2>
        <p>
          Choose your service, customize your requirements, schedule your appointment, and receive
          instant confirmation with complete transparency.
        </p>
      </div>
      <div className="book-grid">
        <div className="wizard glass">
          <div className="stepper" id="stepper" />
          <div className="progress">
            <div className="progress-fill" id="wizFill" />
          </div>
          <div className="panels" id="panels" />
          <div className="wiz-nav">
            <button className="wbtn back" id="btnBack">
              Back
            </button>
            <button className="wbtn next magnetic" id="btnNext" disabled>
              <span className="btn-inner">Continue</span>
            </button>
          </div>
        </div>
        <div className="preview" id="preview">
          <div className="pv-badge" id="pvBadge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Confirmed
          </div>
          <div className="pv-card glass reflect">
            <div className="pv-t">Your service</div>
            <div className="pv-svc" id="pvSvc" />
          </div>
          <div className="pv-card glass reflect">
            <div className="pv-t">Estimated arrival</div>
            <div className="pv-arr" id="pvArr" />
          </div>
          <div className="pv-card glass reflect pv-price">
            <div className="pv-t">Pricing summary</div>
            <div id="pvPrice" />
          </div>
        </div>
      </div>
    </section>
  );
}
