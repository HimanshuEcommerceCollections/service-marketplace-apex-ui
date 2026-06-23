import type { LucideIcon } from 'lucide-react';

interface StepCardProps {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}

export default function StepCard({ icon: Icon, number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col gap-[7.2px] w-full">
      <div className="flex flex-row items-center gap-[14px]">
        <div className="apex-icon-circle">
          <Icon size={22} className="text-[#C07820]" strokeWidth={1.83} />
        </div>
        <span
          className="font-bold text-[24px] leading-[31px] text-[#8A8580]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {number}
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
      <p className="text-[14px] leading-[22px] text-[#4A4840]">{description}</p>
    </div>
  );
}
