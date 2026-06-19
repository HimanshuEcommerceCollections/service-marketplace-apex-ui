export default function ZipGateSection() {
  return (
    <section>
      {/* DESKTOP */}
      <div className="hidden-mobile hidden-tablet" style={{ background: '#F5F5F3', padding: '28px 64px', display: 'flex', alignItems: 'center', gap: 16, maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box', width: '100%' }}>
        {/* ZIP form card */}
        <div className="card-base" style={{ flex: '0 0 760px', padding: '24px 28px' }}>
          <p className="eyebrow" style={{ fontSize: 11, marginBottom: 10 }}>CHECK YOUR AREA</p>
          <p className="heading-lora" style={{ fontSize: 26, color: '#1C1C1A', marginBottom: 16 }}>Are services available near you?</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter ZIP code"
              style={{ width: 300, height: 44, background: '#F5F5F3', border: '1px solid #E4E2DC', borderRadius: 6, padding: '0 14px', fontFamily: 'Inter', fontSize: 14, color: '#1C1C1A', outline: 'none', boxSizing: 'border-box' }}
            />
            <button className="btn-primary" style={{ width: 172, height: 44, fontSize: 14 }}>Check Availability</button>
          </div>
        </div>

        {/* Success state card */}
        <div style={{ flex: '0 0 340px', height: 144, background: '#E0F4E5', border: '1px solid #2E7D5B', borderRadius: 10, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 18, color: '#1C1C1A', margin: '0 0 10px 0' }}>Great news! We serve your area.</p>
          <a href="#" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#1B2D4F', textDecoration: 'none' }}>Book your first service →</a>
        </div>

        {/* Waitlist card */}
        <div style={{ flex: 1, height: 144, background: '#EDECE8', borderRadius: 10, padding: '20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#8A8680', margin: '0 0 10px 0' }}>Not in your area yet.</p>
          <a href="#" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#4A4844', textDecoration: 'none' }}>Join waitlist →</a>
        </div>
      </div>

      {/* TABLET */}
      <div className="tablet-only" style={{ background: '#F5F5F3', padding: '28px 32px', flexDirection: 'column' }}>
        <div className="card-base" style={{ width: '100%', maxWidth: 704, padding: '24px 28px', boxSizing: 'border-box' }}>
          <p className="eyebrow" style={{ fontSize: 11, marginBottom: 10 }}>CHECK YOUR AREA</p>
          <p className="heading-lora" style={{ fontSize: 22, color: '#1C1C1A', marginBottom: 16 }}>Are services available near you?</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter ZIP code"
              style={{ flex: 1, height: 44, background: '#F5F5F3', border: '1px solid #E4E2DC', borderRadius: 6, padding: '0 14px', fontFamily: 'Inter', fontSize: 14, color: '#1C1C1A', outline: 'none', minWidth: 0 }}
            />
            <button className="btn-primary" style={{ flexShrink: 0, width: 160, height: 44, fontSize: 14 }}>Check Availability</button>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="mobile-only" style={{ background: '#F5F5F3', padding: '24px 20px', flexDirection: 'column' }}>
        <div className="card-base" style={{ width: '100%', maxWidth: 350, padding: '20px', boxSizing: 'border-box' }}>
          <p className="heading-lora" style={{ fontSize: 20, color: '#1C1C1A', marginBottom: 14 }}>Are services available near you?</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="ZIP code"
              style={{ flex: 1, height: 40, background: '#F5F5F3', border: '1px solid #E4E2DC', borderRadius: 6, padding: '0 12px', fontFamily: 'Inter', fontSize: 14, color: '#1C1C1A', outline: 'none', minWidth: 0 }}
            />
            <button className="btn-primary" style={{ flexShrink: 0, width: 70, height: 40, fontSize: 14 }}>Go</button>
          </div>
        </div>
      </div>
    </section>
  );
}
