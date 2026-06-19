import { trustStats } from '../data/trust';
import TrustCard from '../components/TrustCard';

export default function TrustSection() {
  return (
    <section style={{ background: '#1B2D4F' }}>
      {/* DESKTOP */}
      <div className="hidden-mobile hidden-tablet" style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 64px' }}>
        <p className="eyebrow" style={{ fontSize: 11, marginBottom: 12, color: '#C07820' }}>TRUSTED BY HOMEOWNERS</p>
        <h2 style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 40, color: '#FFFFFF', lineHeight: '120%', marginBottom: 40 }}>Built for Raleigh homeowners.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {trustStats.map(card => (
            <TrustCard key={card.title} card={card} variant="desktop" />
          ))}
        </div>
      </div>

      {/* TABLET */}
      <div className="tablet-only" style={{ flexDirection: 'column', maxWidth: 768, margin: '0 auto', padding: '60px 32px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10, color: '#C07820' }}>TRUSTED BY HOMEOWNERS</p>
        <h2 style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 32, color: '#FFFFFF', lineHeight: '120%', marginBottom: 32 }}>Built for Raleigh homeowners.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {trustStats.map(card => (
            <TrustCard key={card.title} card={card} variant="tablet" />
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className="mobile-only" style={{ flexDirection: 'column', padding: '48px 20px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10, color: '#C07820' }}>TRUSTED BY HOMEOWNERS</p>
        <h2 style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 28, color: '#FFFFFF', lineHeight: '120%', marginBottom: 28 }}>Built for Raleigh homeowners.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {trustStats.map(card => (
            <TrustCard key={card.title} card={card} variant="mobile" />
          ))}
        </div>
      </div>
    </section>
  );
}
