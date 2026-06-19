import { services } from '../data/services';
import ServiceCard from '../components/ServiceCard';

export default function ServicesSection() {
  return (
    <section style={{ background: '#FFFFFF' }}>
      {/* DESKTOP */}
      <div className="hidden-mobile hidden-tablet" style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 64px' }}>
        <p className="eyebrow" style={{ fontSize: 11, marginBottom: 12 }}>SERVICES</p>
        <h2 className="heading-lora" style={{ fontSize: 40, marginBottom: 16 }}>Every home service, one place.</h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 16, color: '#4A4844', lineHeight: '160%', maxWidth: 600, marginBottom: 48 }}>
          Browse all 11 services. Transparent pricing shown upfront — no calls required to get a number.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 304px)', gap: 21 }}>
          {services.map(svc => (
            <ServiceCard key={svc.id} service={svc} variant="desktop" />
          ))}
        </div>
      </div>

      {/* TABLET */}
      <div className="tablet-only" style={{ flexDirection: 'column', maxWidth: 768, margin: '0 auto', padding: '60px 32px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>SERVICES</p>
        <h2 className="heading-lora" style={{ fontSize: 32, marginBottom: 12 }}>Every home service, one place.</h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 15, color: '#4A4844', lineHeight: '160%', marginBottom: 36 }}>
          Browse all 11 services with transparent pricing shown upfront.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {services.map(svc => (
            <ServiceCard key={svc.id} service={svc} variant="tablet" />
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className="mobile-only" style={{ flexDirection: 'column', padding: '48px 20px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>SERVICES</p>
        <h2 className="heading-lora" style={{ fontSize: 28, marginBottom: 12 }}>Every home service, one place.</h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 14, color: '#4A4844', lineHeight: '160%', marginBottom: 28 }}>
          Browse all 11 services with transparent pricing shown upfront.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {services.map(svc => (
            <ServiceCard key={svc.id} service={svc} variant="mobile" />
          ))}
        </div>
      </div>
    </section>
  );
}
