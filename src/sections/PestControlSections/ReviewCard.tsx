interface Props {
  stars: number;
  quote: string;
  attribution: string;
}

export default function ReviewCard({ stars, quote, attribution }: Props) {
  return (
    <div className="apex-card flex flex-col gap-4 p-6">
      <div className="flex gap-1" aria-label={`${stars} out of 5 stars`}>
        {Array.from({ length: stars }).map((_, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#C07820" aria-hidden="true">
            <path d="M8 1l1.854 3.757L14 5.572l-3 2.924.708 4.129L8 10.5l-3.708 2.125L5 8.496 2 5.572l4.146-.815L8 1z" />
          </svg>
        ))}
      </div>
      <p
        className="text-[17px] leading-[26px] text-[#1C1C1A] italic"
        style={{ fontFamily: "'Lora', serif" }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <p className="text-[13px] text-[#8A8580] font-medium">{attribution}</p>
    </div>
  );
}
