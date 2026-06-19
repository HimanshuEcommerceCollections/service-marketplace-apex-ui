import { Service } from '../data/services';

interface Props {
  service: Service;
  variant: 'desktop' | 'tablet' | 'mobile';
}

export default function ServiceCard({ service, variant }: Props) {
  if (variant === 'mobile') {
    return (
      <div className="card-base" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', height: 76 }}>
        <div style={{ width: 44, height: 44, background: '#FEF8EE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 16, color: '#C07820' }}>{service.iconLetter}</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 15, color: '#1C1C1A', margin: 0 }}>{service.name}</p>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 12, color: '#4A4844', margin: 0, lineHeight: '155%' }}>{service.description}</p>
        </div>
        <span className="price-badge" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10 }}>
          {service.price}
        </span>
      </div>
    );
  }

  const isTablet = variant === 'tablet';
  const iconSize = isTablet ? 44 : 52;
  const nameFontSize = isTablet ? 15 : 16;
  const descFontSize = isTablet ? 12 : 13;
  const iconFontSize = isTablet ? 16 : 18;
  const cardH = isTablet ? 176 : 220;

  return (
    <div className="card-base" style={{ padding: '16px 16px 16px 20px', height: cardH, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: iconSize, height: iconSize, background: '#FEF8EE', borderRadius: isTablet ? 8 : 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: iconFontSize, color: '#C07820' }}>{service.iconLetter}</span>
      </div>
      <p style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: nameFontSize, color: '#1C1C1A', margin: '0 0 8px 0' }}>{service.name}</p>
      <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: descFontSize, color: '#4A4844', lineHeight: '155%', margin: 0, flex: 1 }}>{service.description}</p>
      <div style={{ position: 'absolute', bottom: isTablet ? 14 : 16, left: isTablet ? 16 : 20, right: isTablet ? 16 : 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="price-badge">{service.price}</span>
        <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: isTablet ? 16 : 18, color: '#C07820' }}>→</span>
      </div>
    </div>
  );
}
