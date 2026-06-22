import PricingCard from '../../components/HomeComponents/PricingCard';

const types = ['priced', 'from', 'quote'] as const;

export default function PricingSection() {
  return (
    <section style={{ background: '#F5F5F3' }}>
      {/* DESKTOP */}
      <div className="hidden-mobile hidden-tablet" style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 64px' }}>
        <p className="eyebrow" style={{ fontSize: 11, marginBottom: 12 }}>TRANSPARENT PRICING</p>
        <h2 className="heading-lora" style={{ fontSize: 40, marginBottom: 16 }}>Know the price before you book.</h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 16, color: '#4A4844', lineHeight: '160%', maxWidth: 600, marginBottom: 48 }}>
          Every service on Apex shows its pricing model upfront. No surprises, no hidden fees after the job is done.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {types.map(t => (
            <PricingCard key={t} type={t} variant="desktop" />
          ))}
        </div>
      </div>

      {/* TABLET */}
      <div className="tablet-only" style={{ flexDirection: 'column', maxWidth: 768, margin: '0 auto', padding: '60px 32px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>TRANSPARENT PRICING</p>
        <h2 className="heading-lora" style={{ fontSize: 32, marginBottom: 12 }}>Know the price before you book.</h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 15, color: '#4A4844', lineHeight: '160%', marginBottom: 32 }}>
          Every service shows its pricing model upfront.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {types.map(t => (
            <PricingCard key={t} type={t} variant="tablet" />
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className="mobile-only" style={{ flexDirection: 'column', padding: '48px 20px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>TRANSPARENT PRICING</p>
        <h2 className="heading-lora" style={{ fontSize: 28, marginBottom: 12 }}>Know the price before you book.</h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 14, color: '#4A4844', lineHeight: '160%', marginBottom: 28 }}>
          Every service shows its pricing model upfront.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {types.map(t => (
            <PricingCard key={t} type={t} variant="mobile" />
          ))}
        </div>
      </div>
    </section>
  );
}
