/* eslint-disable @next/next/no-img-element */
// section: HOW IT WORKS — immersive timeline. #tlFill, .step, .s-frame, .s-rise
// and the .count up-counter are animated by the runtime.

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="how-head">
        <div className="eyebrow">How It Works</div>
        <h2>
          Getting home services
          <br />
          has never been easier.
        </h2>
        <p>
          Book, schedule, and relax. Our streamlined process makes premium home services simple,
          transparent, and reliable.
        </p>
      </div>
      <div className="timeline" id="timeline">
        <div className="tl-track">
          <div className="tl-fill" id="tlFill" />
        </div>

        <div className="step floaty" data-step>
          <div className="s-media">
            <div className="s-frame">
              <img src="/assets/images/image-13.jpg" alt="Choosing a service in the Apex app" />
            </div>
            <div className="ripple" />
            <div className="chip tl-chip">
              <div className="ci">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <div>
                <div className="cl">Browse</div>
                <div className="cv">11 services</div>
              </div>
            </div>
          </div>
          <div className="s-node">
            <div className="node-badge">1</div>
          </div>
          <div className="s-content">
            <div className="s-eyebrow s-rise">Step 01</div>
            <h3 className="s-rise">Choose Your Service</h3>
            <p className="s-rise">
              Browse our home services and select the one that fits your needs in just a few clicks.
            </p>
            <div className="s-tags s-rise">
              <span>Cleaning</span>
              <span>Lawn</span>
              <span>Smart Home</span>
              <span>+8 more</span>
            </div>
          </div>
        </div>

        <div className="step flip" data-step>
          <div className="s-media">
            <div className="s-frame">
              <img src="/assets/images/image-14.jpg" alt="Reviewing transparent pricing on a tablet" />
            </div>
            <div className="chip tl-chip">
              <div className="ci">$</div>
              <div>
                <div className="cl">From</div>
                <div className="cv num">
                  $<span className="count" data-to="129">0</span>
                </div>
              </div>
            </div>
            <div className="chip br-chip c2">
              <div className="ci">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M3 9h18M8 3v4M16 3v4" />
                </svg>
              </div>
              <div>
                <div className="cl">Scheduled</div>
                <div className="cv">Sat · 9:00 AM</div>
              </div>
            </div>
          </div>
          <div className="s-node">
            <div className="node-badge">2</div>
          </div>
          <div className="s-content">
            <div className="s-eyebrow s-rise">Step 02</div>
            <h3 className="s-rise">Instant Pricing &amp; Scheduling</h3>
            <p className="s-rise">
              Customize your service, review transparent pricing, and choose your preferred date and
              time.
            </p>
            <div className="s-tags s-rise">
              <span>Transparent pricing</span>
              <span>Pick your slot</span>
            </div>
          </div>
        </div>

        <div className="step" data-step>
          <div className="s-media">
            <div className="s-frame">
              <img
                src="/assets/images/image-15.jpg"
                alt="An Apex technician greeting a customer at the door"
              />
              <div className="sweep3" />
            </div>
            <div className="chip br-chip">
              <div className="ci">
                <svg className="check" width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="11" />
                  <path d="M7 12.5l3.2 3.2L17 9" />
                </svg>
              </div>
              <div>
                <div className="cl">On time</div>
                <div className="cv">Job complete</div>
              </div>
            </div>
          </div>
          <div className="s-node">
            <div className="node-badge">3</div>
          </div>
          <div className="s-content">
            <div className="s-eyebrow s-rise">Step 03</div>
            <h3 className="s-rise">Professional Service at Your Door</h3>
            <p className="s-rise">
              A verified Apex technician arrives on time, completes the job with precision, and
              ensures everything is spotless before leaving.
            </p>
            <div className="s-tags s-rise">
              <span>Verified pros</span>
              <span>Spotless finish</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
