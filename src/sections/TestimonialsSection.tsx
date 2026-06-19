import { testimonials } from '../data/testimonials';
import TestimonialCard from '../components/TestimonialCard';

export default function TestimonialsSection() {
  return (
    <section style={{ background: '#EDECE8' }}>
      {/* DESKTOP */}
      <div className="hidden-mobile hidden-tablet" style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 64px' }}>
        <p className="eyebrow" style={{ fontSize: 11, marginBottom: 12 }}>WHAT CLIENTS ARE LOOKING FOR</p>
        <h2 className="heading-lora" style={{ fontSize: 40, marginBottom: 10 }}>Transparency and reliability, every time.</h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 14, color: '#8A8680', marginBottom: 40 }}>
          Illustrative samples only. Not real reviews. [Sample]
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} variant="desktop" />
          ))}
        </div>
      </div>

      {/* TABLET */}
      <div className="tablet-only" style={{ flexDirection: 'column', maxWidth: 768, margin: '0 auto', padding: '60px 32px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>WHAT CLIENTS ARE LOOKING FOR</p>
        <h2 className="heading-lora" style={{ fontSize: 32, marginBottom: 8 }}>Transparency and reliability, every time.</h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: '#8A8680', marginBottom: 32 }}>
          Illustrative samples only. Not real reviews. [Sample]
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {testimonials.slice(0, 2).map((t, i) => (
            <TestimonialCard key={i} testimonial={t} variant="tablet" />
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className="mobile-only" style={{ flexDirection: 'column', padding: '48px 20px' }}>
        <p className="eyebrow" style={{ fontSize: 10, marginBottom: 10 }}>WHAT CLIENTS ARE LOOKING FOR</p>
        <h2 className="heading-lora" style={{ fontSize: 24, marginBottom: 24 }}>Illustrative samples. [Sample]</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {testimonials.slice(0, 2).map((t, i) => (
            <TestimonialCard key={i} testimonial={t} variant="mobile" />
          ))}
        </div>
      </div>
    </section>
  );
}
