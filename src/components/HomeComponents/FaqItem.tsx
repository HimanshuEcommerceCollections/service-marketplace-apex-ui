interface Props {
  question: string;
  variant: 'desktop' | 'tablet' | 'mobile';
}

export default function FaqItem({ question, variant }: Props) {
  const fontSize = variant === 'desktop' ? 15 : 14;
  const height = variant === 'desktop' ? 56 : 52;
  const px = variant === 'mobile' ? 16 : 20;

  return (
    <div className="faq-item" style={{ height, padding: `0 ${px}px` }}>
      <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize, color: '#1C1C1A' }}>{question}</span>
      <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 20, color: '#8A8680', lineHeight: 1 }}>+</span>
    </div>
  );
}
