type PricingType = 'priced' | 'from' | 'quote';
type PricingVariant = 'desktop' | 'tablet' | 'mobile';

interface Props {
  type: PricingType;
  variant: PricingVariant;
}

const data = {
  priced: {
    badgeBg: '#E0F4E5', badgeColor: '#2E7D5B', badgeText: 'PRICED',
    accentClass: 'accent-green',
    priceText: 'e.g. $89.00 DRAFT',
    title: 'Exact pricing available',
    body: 'You see the final cost before submitting. No estimates, no hidden fees after the job.',
    bodyCompact: 'Exact pricing — no surprises.',
  },
  from: {
    badgeBg: '#FEF8EE', badgeColor: '#C07820', badgeText: 'FROM',
    accentClass: 'accent-amber',
    priceText: 'From $45 DRAFT',
    title: 'Starting price shown',
    body: 'A minimum price is displayed. Final cost depends on job-specific configuration.',
    bodyCompact: 'Starting price shown upfront.',
  },
  quote: {
    badgeBg: '#EDECE8', badgeColor: '#8A8680', badgeText: 'QUOTE',
    accentClass: 'accent-navy',
    priceText: 'Request Quote',
    title: 'Custom quote required',
    body: 'Complexity varies too much for upfront pricing. Your coordinator follows up.',
    bodyCompact: 'Coordinator contacts you.',
  },
};

export default function PricingCard({ type, variant }: Props) {
  const d = data[type];
  const isDesktop = variant === 'desktop';
  const priceFontSize = isDesktop ? 28 : variant === 'tablet' ? 20 : 22;
  const titleFontSize = isDesktop ? 15 : 13;
  const bodyFontSize = isDesktop ? 14 : 13;
  const cardHeight = isDesktop ? 214 : 124;
  const pad = isDesktop ? 16 : 14;

  return (
    <div className="card-base" style={{ position: 'relative', height: cardHeight, overflow: 'hidden', padding: `${pad}px ${pad}px ${pad}px ${pad + 10}px` }}>
      <div className={d.accentClass} style={{ position: 'absolute', left: 0, top: 0, width: 3, height: '100%' }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', background: d.badgeBg, borderRadius: 12, marginBottom: 8 }}>
        <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, color: d.badgeColor }}>{d.badgeText}</span>
      </div>
      <p style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: priceFontSize, color: '#C07820', margin: '0 0 8px 0', lineHeight: 1.3 }}>{d.priceText}</p>
      <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: titleFontSize, color: '#1C1C1A', margin: '0 0 6px 0' }}>{d.title}</p>
      {isDesktop ? (
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: bodyFontSize, color: '#4A4844', lineHeight: '160%', margin: 0 }}>{d.body}</p>
      ) : (
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: bodyFontSize, color: '#4A4844', lineHeight: '155%', margin: 0 }}>{d.bodyCompact}</p>
      )}
    </div>
  );
}
