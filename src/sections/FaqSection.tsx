import { faqItems } from '../data/faq';
import FaqItem from '../components/FaqItem';

export default function FaqSection() {
  return (
    <section style={{ background: '#FFFFFF' }}>
      {/* DESKTOP */}
      <div className="hidden-mobile hidden-tablet" style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 64px' }}>
        <p className="eyebrow" style={{ fontSize: 11, marginBottom: 12 }}>QUICK ANSWERS</p>
        <h2 className="heading-lora" style={{ fontSize: 40, marginBottom: 40 }}>Questions before booking?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
          {faqItems.map(q => (
            <FaqItem key={q} question={q} variant="desktop" />
          ))}
        </div>
        <a href="#" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#1B2D4F', textDecoration: 'none' }}>
          See all FAQ →
        </a>
      </div>

      {/* TABLET */}
      <div className="tablet-only" style={{ flexDirection: 'column', maxWidth: 768, margin: '0 auto', padding: '60px 32px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>QUICK ANSWERS</p>
        <h2 className="heading-lora" style={{ fontSize: 32, marginBottom: 32 }}>Questions before booking?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {faqItems.map(q => (
            <FaqItem key={q} question={q} variant="tablet" />
          ))}
        </div>
        <a href="#" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#1B2D4F', textDecoration: 'none' }}>
          See all FAQ →
        </a>
      </div>

      {/* MOBILE */}
      <div className="mobile-only" style={{ flexDirection: 'column', padding: '48px 20px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>QUICK ANSWERS</p>
        <h2 className="heading-lora" style={{ fontSize: 28, marginBottom: 28 }}>Questions before booking?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {faqItems.map(q => (
            <FaqItem key={q} question={q} variant="mobile" />
          ))}
        </div>
        <a href="#" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#1B2D4F', textDecoration: 'none' }}>
          See all FAQ →
        </a>
      </div>
    </section>
  );
}
