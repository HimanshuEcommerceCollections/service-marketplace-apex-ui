// section: HOW IT WORKS — 4-step timeline. The connecting line draws in via .tline.drawn
// (runtime), and each step animates via .tstep.in (each .tstep also carries .reveal).
const steps = [
  {
    title: 'Choose your plan',
    body: 'Pick a service and frequency — or build a bundle across your home.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    title: 'Set your schedule',
    body: 'Tell us your preferred day and window. We lock in your standing slot.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </svg>
    ),
  },
  {
    title: 'Automatic visits',
    body: 'The same vetted crew shows up on schedule — no reminders, no rebooking.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 11-3-6.7L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    ),
  },
  {
    title: 'Sit back & enjoy',
    body: 'A consistently cared-for home, billed automatically. Adjust anytime.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="sec" id="how" style={{ background: 'var(--mist)' }}>
      <div className="swrap">
        <div className="sec-head reveal">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            How it works
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '-.03em',
              fontSize: 'clamp(28px,3.6vw,44px)',
              color: 'var(--ink2)',
              marginTop: 12,
            }}
          >
            Set it once. We handle the rest.
          </h2>
        </div>
        <div className="tline">
          {steps.map((s, i) => (
            <div className="tstep reveal" key={s.title}>
              <div className="node">
                {s.icon}
                <span className="num">{i + 1}</span>
              </div>
              <div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
