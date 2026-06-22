import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="apex-card flex flex-col gap-[6.9px] p-7 w-full">
      <div className="apex-icon-box">
        <Icon size={24} className="text-[#C07820]" strokeWidth={2} />
      </div>
      <div className="pt-[13px]">
        <h3
          className="font-bold text-[18px] leading-[23px] text-[#1C1C1A]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {title}
        </h3>
      </div>
      <p className="text-[14px] leading-[22px] text-[#4A4840] font-normal">
        {description}
      </p>
    </div>
  );
}
