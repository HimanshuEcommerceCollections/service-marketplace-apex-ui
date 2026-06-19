const steps = [
  {
    badge: '01',
    title: 'Choose a service',
    body: 'Browse 11 home services. Click to see pricing, service details, and available options before submitting anything.',
  },
  {
    badge: '02',
    title: 'See transparent pricing',
    body: 'Every service displays its pricing model — fixed, from, or quote — so you know what to expect before confirming.',
  },
  {
    badge: '03',
    title: 'Coordinator confirmed',
    body: 'A real coordinator reviews your request and confirms a vetted professional for your job. No automated booking.',
  },
];

export default function HowItWorksSection() {
  return (
    <section style={{ background: '#FFFFFF' }}>
      {/* DESKTOP */}
      <div className="hidden-mobile hidden-tablet" style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 64px' }}>
        <p className="eyebrow" style={{ fontSize: 11, marginBottom: 12 }}>HOW IT WORKS</p>
        <h2 className="heading-lora" style={{ fontSize: 40, marginBottom: 56 }}>Simple from start to finish.</h2>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {steps.map((step, i) => (
            <div key={step.badge} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: 60, height: 60, background: '#FEF8EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 20, color: '#C07820' }}>{step.badge}</span>
                </div>
                <p style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 22, color: '#1C1C1A', margin: '0 0 12px 0' }}>{step.title}</p>
                <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 15, color: '#4A4844', lineHeight: '160%', margin: 0, maxWidth: 320 }}>{step.body}</p>
              </div>
              {i < steps.length - 1 && (
                <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 24, color: '#E4E2DC', marginTop: 18, flexShrink: 0, padding: '0 24px' }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TABLET */}
      <div className="tablet-only" style={{ flexDirection: 'column', maxWidth: 768, margin: '0 auto', padding: '60px 32px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>HOW IT WORKS</p>
        <h2 className="heading-lora" style={{ fontSize: 32, marginBottom: 40 }}>Simple from start to finish.</h2>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {steps.map((step, i) => (
            <div key={step.badge} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: 52, height: 52, background: '#FEF8EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 17, color: '#C07820' }}>{step.badge}</span>
                </div>
                <p style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 18, color: '#1C1C1A', margin: '0 0 8px 0' }}>{step.title}</p>
                <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#4A4844', lineHeight: '160%', margin: 0 }}>{step.body}</p>
              </div>
              {i < steps.length - 1 && (
                <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 18, color: '#E4E2DC', marginTop: 16, flexShrink: 0, padding: '0 12px' }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className="mobile-only" style={{ flexDirection: 'column', padding: '48px 20px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>HOW IT WORKS</p>
        <h2 className="heading-lora" style={{ fontSize: 28, marginBottom: 32 }}>Simple from start to finish.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {steps.map(step => (
            <div key={step.badge} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ width: 44, height: 44, background: '#FEF8EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 15, color: '#C07820' }}>{step.badge}</span>
              </div>
              <div>
                <p style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 17, color: '#1C1C1A', margin: '0 0 6px 0' }}>{step.title}</p>
                <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#4A4844', lineHeight: '160%', margin: 0 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
