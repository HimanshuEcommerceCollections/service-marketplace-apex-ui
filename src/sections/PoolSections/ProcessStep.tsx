import React from 'react';

function FlaskIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M10 3v6l-4.5 9h13L14 9V3" />
      <path d="M8.5 15h7" />
    </svg>
  );
}

function WavesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round">
      <path d="M2 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  );
}

function ChemicalIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <polyline points="14 3 14 8 19 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.33 2 2 0 0 1 3.6 1.29h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 7.13 7.13l1.08-1.08a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18.42v-1.5z" />
    </svg>
  );
}

const iconMap: Record<string, () => React.ReactElement> = {
  flask:    FlaskIcon,
  waves:    WavesIcon,
  filter:   FilterIcon,
  chemical: ChemicalIcon,
  report:   ReportIcon,
  phone:    PhoneIcon,
};

interface Props {
  id: number;
  heading: string;
  body: string;
  icon: string;
}

export default function ProcessStep({ heading, body, icon }: Props) {
  const Icon = iconMap[icon] ?? FlaskIcon;

  return (
    <div className="bg-white rounded-[10px] border border-[#E4E2DC] p-6 flex flex-col gap-3">
      <div className="w-12 h-12 rounded-[8px] bg-[#FEF8EE] flex items-center justify-center shrink-0">
        <Icon />
      </div>
      <h3
        className="font-bold text-[18px] text-[#1C1C1A]"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {heading}
      </h3>
      <p className="text-[14px] leading-[22px] text-[#4A4840]">{body}</p>
    </div>
  );
}
