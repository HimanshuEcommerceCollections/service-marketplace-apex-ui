export default function HeroSection() {
  return (
    <section>
      {/* DESKTOP */}
      <div className="hidden-mobile hidden-tablet" style={{ background: '#FFFFFF', position: 'relative', height: 700, maxWidth: 1440, margin: '0 auto' }}>
        {/* Hero image card */}
        <div style={{ position: 'absolute', right: 64, top: 40, width: 560, height: 620, background: '#EDECE8', borderRadius: 12, boxShadow: '0px 8px 32px rgba(0,0,0,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 14, color: '#8A8680', textAlign: 'center', padding: '0 40px' }}>[ Raleigh Home Environment ] Clean interior · Professional service context</p>
        </div>
        {/* Stat chip */}
        <div style={{ position: 'absolute', right: 64, top: 596, width: 300, height: 48, background: '#FFFFFF', boxShadow: '0px 4px 16px rgba(0,0,0,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
          <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: '#1C1C1A' }}>[Sample] 2,400+ jobs completed · Wake County</span>
        </div>
        {/* Content */}
        <div style={{ position: 'absolute', left: 64, top: 88 }}>
          <p className="eyebrow" style={{ fontSize: 11, marginBottom: 16 }}>RALEIGH HOME SERVICES MARKETPLACE</p>
          <h1 className="heading-lora" style={{ fontSize: 64, lineHeight: '115%', maxWidth: 520, marginBottom: 16 }}>One call. Whole house handled.</h1>
          <div style={{ width: 200, height: 4, background: '#C07820', borderRadius: 2, marginBottom: 24 }} />
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 18, lineHeight: '160%', color: '#4A4844', maxWidth: 540, marginBottom: 28 }}>
            Choose your service, see transparent pricing, and connect with independent professionals across Wake County.
          </p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <button className="btn-primary" style={{ width: 180, height: 44, fontSize: 15 }}>Book Now</button>
            <button className="btn-secondary" style={{ width: 164, height: 44, fontSize: 15 }}>View Services</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['✓ Transparent pricing', '✓ Wake County coverage', '✓ Vetted professionals'].map(chip => (
              <div key={chip} style={{ background: '#F5F5F3', borderRadius: 16, height: 32, display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 12, color: '#4A4844' }}>{chip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLET */}
      <div className="tablet-only" style={{ background: '#FFFFFF', flexDirection: 'column', maxWidth: 768, margin: '0 auto' }}>
        <div style={{ position: 'relative', width: '100%', height: 260, background: '#EDECE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#8A8680', textAlign: 'center' }}>[ Raleigh Home Environment Photo ]</p>
          <div style={{ position: 'absolute', bottom: 14, left: 32, width: 264, height: 44, background: '#FFFFFF', borderRadius: 10, boxShadow: '0px 4px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', paddingLeft: 14 }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, color: '#1C1C1A' }}>[Sample] 2,400+ jobs completed · Wake County</span>
          </div>
        </div>
        <div style={{ padding: '24px 32px 40px' }}>
          <p className="eyebrow" style={{ fontSize: 10, marginBottom: 12 }}>RALEIGH HOME SERVICES MARKETPLACE</p>
          <h1 className="heading-lora" style={{ fontSize: 48, lineHeight: '115%', marginBottom: 12 }}>One call. Whole house handled.</h1>
          <div style={{ width: 190, height: 4, background: '#C07820', borderRadius: 2, marginBottom: 20 }} />
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 16, lineHeight: '160%', color: '#4A4844', marginBottom: 24 }}>
            Choose your service, see transparent pricing, and connect with independent professionals across Wake County.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-primary" style={{ width: 196, height: 44, fontSize: 14 }}>Book Now</button>
            <button className="btn-secondary" style={{ width: 168, height: 44, fontSize: 15 }}>View Services</button>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="mobile-only" style={{ background: '#FFFFFF', flexDirection: 'column' }}>
        <div style={{ position: 'relative', width: '100%', height: 220, background: '#EDECE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 12, color: '#8A8680', textAlign: 'center' }}>[ Hero Photo ]</p>
          <div style={{ position: 'absolute', bottom: 10, left: 20, width: 240, height: 40, background: '#FFFFFF', borderRadius: 10, boxShadow: '0px 4px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', paddingLeft: 12 }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, color: '#1C1C1A' }}>[Sample] 2,400+ jobs · Wake County</span>
          </div>
        </div>
        <div style={{ padding: '20px 20px 40px' }}>
          <p className="eyebrow" style={{ fontSize: 10, marginBottom: 12 }}>RALEIGH HOME SERVICES MARKETPLACE</p>
          <h1 className="heading-lora" style={{ fontSize: 36, lineHeight: '115%', marginBottom: 12 }}>One call. Whole house handled.</h1>
          <div style={{ width: 148, height: 4, background: '#C07820', borderRadius: 2, marginBottom: 16 }} />
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 15, lineHeight: '160%', color: '#4A4844', marginBottom: 20 }}>
            Choose your service, see transparent pricing, and connect with independent professionals.
          </p>
          <button className="btn-primary" style={{ width: '100%', maxWidth: 350, height: 44, fontSize: 14 }}>Book Now</button>
        </div>
      </div>
    </section>
  );
}
