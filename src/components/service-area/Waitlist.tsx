// section 6: WAITLIST — form fields + submit are validated and the success
// state is rendered by the runtime. Field ids (wName/wEmail/wPhone/wZip,
// waitBtn, waitSuccess) are the runtime's hooks; the ZIP checker prefills wZip.
import SecHead from './SecHead';

export default function Waitlist() {
  return (
    <section className="sec" id="waitlist">
      <SecHead
        eyebrow="Not covered yet?"
        title="Join the waitlist."
        lede="Add your details and we’ll notify you the moment Apex expands into your neighborhood."
      />
      <div className="swrap">
        <div className="wait-card reveal">
          <div className="form-grid">
            <div className="ff">
              <input id="wName" placeholder=" " />
              <label htmlFor="wName">Full name</label>
              <div className="msg" />
            </div>
            <div className="ff">
              <input id="wEmail" type="email" placeholder=" " />
              <label htmlFor="wEmail">Email address</label>
              <div className="msg" />
            </div>
            <div className="ff">
              <input id="wPhone" type="tel" placeholder=" " />
              <label htmlFor="wPhone">Phone number</label>
              <div className="msg" />
            </div>
            <div className="ff">
              <input id="wZip" placeholder=" " inputMode="numeric" maxLength={5} />
              <label htmlFor="wZip">ZIP code</label>
              <div className="msg" />
            </div>
          </div>
          <button
            className="btn btn-primary ripple"
            id="waitBtn"
            style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
          >
            Join waitlist
          </button>
          <div className="wait-success" id="waitSuccess" />
        </div>
      </div>
    </section>
  );
}
