interface Props {
  icon: string;
  title: string;
  body: string;
}

export default function TrustCard({ icon, title, body }: Props) {
  return (
    <div className="apex-card p-7 flex flex-col gap-[7.2px]">
      <div className="apex-icon-box">
        {icon === 'price' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        )}
        {icon === 'shield' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        )}
        {icon === 'clock' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        )}
      </div>

      <div className="pt-[12.8px]">
        <h3
          className="font-bold text-[18px] leading-[23px] text-[#1C1C1A]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {title}
        </h3>
      </div>

      <p className="text-[14px] leading-[22px] text-[#4A4840]">{body}</p>
    </div>
  );
}
