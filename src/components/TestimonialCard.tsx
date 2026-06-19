import { Testimonial } from '../data/testimonials';

interface Props {
  testimonial: Testimonial;
  variant: 'desktop' | 'tablet' | 'mobile';
}

export default function TestimonialCard({ testimonial, variant }: Props) {
  const quoteFontSize = variant === 'desktop' ? 44 : variant === 'tablet' ? 40 : 36;
  const textFontSize = variant === 'desktop' ? 14 : 13;

  return (
    <div className="card-base" style={{ padding: 20, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: textFontSize, color: '#C07820' }}>★★★★★</span>
        <span className="badge-sample">[Sample]</span>
      </div>
      <p style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: quoteFontSize, color: '#FEF8EE', margin: '0 0 4px 0', lineHeight: 1 }}>"</p>
      <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: textFontSize, color: '#4A4844', lineHeight: '165%', margin: '0 0 16px 0' }}>
        {testimonial.quote}
      </p>
      <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: '#8A8680', margin: 0 }}>{testimonial.attribution}</p>
    </div>
  );
}
