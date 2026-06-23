interface Props {
  stepNumber: string;
  icon: string;
  title: string;
  body: string;
}

export default function StepItem({ stepNumber, icon, title, body }: Props) {
  return (
    <div className="flex flex-col gap-[7.2px]">
      <div className="flex items-center gap-[14px]">
        <div className="w-12 h-12 bg-[#FEF8EE] rounded-full flex items-center justify-center flex-shrink-0">
          {icon === 'search' && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
          {icon === 'calendar' && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          )}
          {icon === 'check' && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span
          className="font-bold text-[24px] leading-[31px] text-[#8A8580]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {stepNumber}
        </span>
      </div>

      <div className="pt-[6.8px]">
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
