import { Star } from 'lucide-react';

interface TestimonialCardProps {
  rating: number;
  quote: string;
  attribution: string;
}

export default function TestimonialCard({ rating, quote, attribution }: TestimonialCardProps) {
  return (
    <div className="apex-card flex flex-col gap-[14px] p-7 w-full">
      <div className="flex flex-row gap-[2px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-[#C07820] text-[#C07820]' : 'text-[#E4E2DC]'}
            strokeWidth={1.33}
          />
        ))}
      </div>
      <p
        className="font-normal text-[18px] leading-[27px] text-[#1C1C1A]"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {quote}
      </p>
      <p className="text-[13px] leading-[16px] text-[#8A8580]">{attribution}</p>
    </div>
  );
}
