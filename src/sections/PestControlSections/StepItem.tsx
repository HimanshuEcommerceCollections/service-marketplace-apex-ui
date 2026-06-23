import React from 'react';

function ClipboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M14 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="8" y="1" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11h6M8 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M8 6h10M8 11h10M8 16h10M4 6h.01M4 11h.01M4 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const iconMap: Record<string, () => React.ReactElement> = {
  clipboard: ClipboardIcon,
  list: ListIcon,
  check: CheckCircleIcon,
};

interface Props {
  stepNumber: string;
  icon: string;
  title: string;
  body: string;
}

export default function StepItem({ stepNumber, icon, title, body }: Props) {
  const Icon = iconMap[icon] ?? ClipboardIcon;

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="relative">
        <div className="apex-icon-box">
          <Icon />
        </div>
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#C07820] text-white text-[10px] font-bold flex items-center justify-center">
          {stepNumber.replace('0', '')}
        </span>
      </div>
      <h3 className="font-semibold text-[17px] text-[#1C1C1A]">{title}</h3>
      <p className="text-[15px] leading-[23px] text-[#4B4A47]">{body}</p>
    </div>
  );
}
