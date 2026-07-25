// section 2: ZIP CHECKER — the input + result panel are wired by the runtime
// (validates a 5-digit ZIP against the served set, renders an ok/no state).
import SecHead from './SecHead';

export default function ZipChecker() {
  return (
    <section className="sec" id="zip">
      <SecHead eyebrow="Availability" title="Is Apex in your neighborhood?" />
      <div className="swrap">
        <div className="zip-card reveal">
          <div className="zip-input-row">
            <div className="ff">
              <input id="zipInput" placeholder=" " inputMode="numeric" maxLength={5} />
              <label htmlFor="zipInput">Enter your ZIP code</label>
            </div>
            <button className="btn btn-primary ripple" id="zipCheck">
              Check availability
            </button>
          </div>
          <div className="zip-result" id="zipResult" />
        </div>
      </div>
    </section>
  );
}
