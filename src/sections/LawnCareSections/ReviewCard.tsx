interface Props {
  stars: number;
  quote: string;
  name: string;
  location: string;
}

export default function ReviewCard({ stars, quote, name, location }: Props) {
  return (
    <div className="apex-card p-7 flex flex-col gap-[14px]">
      <div className="flex gap-[2px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < stars ? '#C07820' : 'none'}
            stroke="#C07820"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      <p
        className="font-normal text-[18px] leading-[27px] text-[#1C1C1A]"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {quote}
      </p>

      <div>
        <p className="font-semibold text-[13px] leading-[16px] text-[#1C1C1A]">{name}</p>
        <p className="text-[12px] leading-[15px] text-[#8A8580] mt-0.5">{location}</p>
      </div>
    </div>
  );
}
