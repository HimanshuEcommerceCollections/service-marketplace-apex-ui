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

function MapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 20s-8-6.268-8-11a8 8 0 1 1 16 0c0 4.732-8 11-8 11Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const iconMap: Record<string, () => React.ReactElement> = {
  clipboard: ClipboardIcon,
  map: MapIcon,
  check: CheckIcon,
};

interface Props {
  icon: string;
  title: string;
  body: string;
}

export default function ProtectionPlanCard({ icon, title, body }: Props) {
  const Icon = iconMap[icon] ?? ClipboardIcon;

  return (
    <div className="apex-card flex flex-col gap-4 p-6">
      <div className="apex-icon-box">
        <Icon />
      </div>
      <h3 className="font-semibold text-[17px] text-[#1C1C1A]">{title}</h3>
      <p className="text-[15px] leading-[23px] text-[#4B4A47]">{body}</p>
    </div>
  );
}
