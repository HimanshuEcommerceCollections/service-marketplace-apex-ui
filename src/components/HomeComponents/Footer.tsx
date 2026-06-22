import { footerLinks } from '../../data/HomeData/footer';

export default function Footer() {
  return (
    <footer style={{ background: '#1B2D4F' }}>
      {/* —— DESKTOP —— */}
      <div className="hidden-mobile hidden-tablet">
        {/* Top strip */}
        <div style={{ background: '#1E3160', height: 68, display: 'flex', alignItems: 'center', padding: '0 64px', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 16, letterSpacing: 2, color: '#FFFFFF' }}>APEX</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 14, color: '#A8B8CC' }}>One call. Whole house handled.</span>
          <button className="btn-amber" style={{ width: 120, height: 40, fontSize: 14 }}>Book Now</button>
        </div>

        {/* Columns */}
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '48px 64px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
          {/* Services */}
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#FFFFFF', margin: '0 0 16px 0' }}>Services</p>
            {footerLinks.services.map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#A8B8CC', lineHeight: '22px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
          {/* Company */}
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#FFFFFF', margin: '0 0 16px 0' }}>Company</p>
            {footerLinks.company.map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#A8B8CC', lineHeight: '22px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
          {/* For Business */}
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#FFFFFF', margin: '0 0 16px 0' }}>For Business</p>
            {footerLinks.forBusiness.map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#A8B8CC', lineHeight: '22px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
          {/* Legal */}
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#FFFFFF', margin: '0 0 16px 0' }}>Legal</p>
            {footerLinks.legal.map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#A8B8CC', lineHeight: '22px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #2A3F63', padding: '16px 64px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 12, color: '#A8B8CC', margin: 0 }}>
            © 2026 Apex Total Home Services · Wake County, Raleigh NC · DRAFT — Not for public distribution.
          </p>
        </div>
      </div>

      {/* —— TABLET —— */}
      <div className="tablet-only" style={{ flexDirection: 'column' }}>
        {/* Top strip */}
        <div style={{ background: '#1E3160', height: 60, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 15, letterSpacing: 2, color: '#FFFFFF' }}>APEX</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#A8B8CC' }}>One call. Whole house handled.</span>
          <button className="btn-amber" style={{ width: 108, height: 40, fontSize: 13 }}>Book Now</button>
        </div>

        {/* Columns */}
        <div style={{ padding: '40px 32px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#FFFFFF', margin: '0 0 12px 0' }}>Services</p>
            {footerLinks.services.map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 12, color: '#A8B8CC', lineHeight: '22px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#FFFFFF', margin: '0 0 12px 0' }}>Company</p>
            {footerLinks.company.map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 12, color: '#A8B8CC', lineHeight: '22px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#FFFFFF', margin: '0 0 12px 0' }}>Legal</p>
            {[...footerLinks.legal, ...footerLinks.forBusiness].map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 12, color: '#A8B8CC', lineHeight: '22px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #2A3F63', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: '#A8B8CC', margin: 0 }}>
            © 2026 Apex Total Home Services · DRAFT
          </p>
        </div>
      </div>

      {/* —— MOBILE —— */}
      <div className="mobile-only" style={{ flexDirection: 'column' }}>
        {/* Top strip */}
        <div style={{ background: '#1E3160', height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 14, letterSpacing: 2, color: '#FFFFFF' }}>APEX</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: '#A8B8CC' }}>One call. Whole house handled.</span>
        </div>

        {/* Columns */}
        <div style={{ padding: '32px 20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: '#FFFFFF', margin: '0 0 10px 0' }}>Services</p>
            {footerLinks.services.map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: '#A8B8CC', lineHeight: '20px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: '#FFFFFF', margin: '0 0 10px 0' }}>Company</p>
            {footerLinks.company.map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: '#A8B8CC', lineHeight: '20px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: '#FFFFFF', margin: '0 0 10px 0' }}>Legal</p>
            {footerLinks.legal.map(s => (
              <a key={s} href="#" style={{ display: 'block', fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: '#A8B8CC', lineHeight: '20px', textDecoration: 'none' }}>{s}</a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #2A3F63', height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 10, color: '#A8B8CC', margin: 0 }}>
            © 2026 Apex Total Home Services · DRAFT
          </p>
        </div>
      </div>
    </footer>
  );
}
