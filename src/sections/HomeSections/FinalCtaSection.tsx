export default function FinalCtaSection() {
  return (
    <section style={{ background: '#1B2D4F' }}>
      {/* DESKTOP */}
      <div className="hidden-mobile hidden-tablet" style={{ maxWidth: 1440, margin: '0 auto', padding: '100px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 48, color: '#FFFFFF', lineHeight: '120%', maxWidth: 680, marginBottom: 20 }}>
          Ready to handle your next home project?
        </h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 18, color: '#CCD6E0', marginBottom: 40 }}>
          Choose a service, see pricing, and request your booking today.
        </p>
        <button className="btn-amber" style={{ width: 200, height: 56, fontSize: 16 }}>Book Now</button>
      </div>

      {/* TABLET */}
      <div className="tablet-only" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 768, margin: '0 auto', padding: '80px 32px' }}>
        <h2 style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 40, color: '#FFFFFF', lineHeight: '120%', marginBottom: 16 }}>
          Ready to handle your next home project?
        </h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 16, color: '#CCD6E0', marginBottom: 32 }}>
          Choose a service, see pricing, and request your booking today.
        </p>
        <button className="btn-amber" style={{ width: 200, height: 52, fontSize: 15 }}>Book Now</button>
      </div>

      {/* MOBILE */}
      <div className="mobile-only" style={{ flexDirection: 'column', padding: '60px 20px' }}>
        <h2 style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 32, color: '#FFFFFF', lineHeight: '120%', marginBottom: 16 }}>
          Ready to handle your next home project?
        </h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 14, color: '#CCD6E0', lineHeight: '160%', marginBottom: 28 }}>
          Choose a service, see pricing, and request your booking today.
        </p>
        <button className="btn-amber" style={{ width: '100%', maxWidth: 350, height: 48, fontSize: 15 }}>Book Now</button>
      </div>
    </section>
  );
}
