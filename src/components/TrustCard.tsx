import { TrustStat } from '../data/trust';

interface Props {
  card: TrustStat;
  variant: 'desktop' | 'tablet' | 'mobile';
}

export default function TrustCard({ card, variant }: Props) {
  const statSize = variant === 'desktop' ? 24 : variant === 'tablet' ? 22 : 20;
  const titleSize = variant === 'mobile' ? 12 : 14;
  const bodySize = variant === 'mobile' ? 11 : variant === 'tablet' ? 12 : 13;
  const pad = variant === 'mobile' ? 12 : variant === 'tablet' ? 16 : 20;
  const height = variant === 'desktop' ? 148 : variant === 'tablet' ? 131 : 149;

  return (
    <div className="trust-card" style={{ padding: pad, height }}>
      <p style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: statSize, color: '#C07820', margin: '0 0 10px 0' }}>{card.stat}</p>
      <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: titleSize, color: '#FFFFFF', margin: '0 0 6px 0' }}>{card.title}</p>
      <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: bodySize, color: '#A8B8CC', lineHeight: '155%', margin: 0 }}>{card.body}</p>
    </div>
  );
}
