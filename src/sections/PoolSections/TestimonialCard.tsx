interface Props {
  quote: string;
  name: string;
  label: string;
}

export default function TestimonialCard({ quote, name, label }: Props) {
  return (
    <div className="bg-[#F5F5F2] rounded-[10px] border border-[#E4E2DC] p-6 flex flex-col gap-4">
      <div className="flex gap-0.5" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#C07820" aria-hidden="true">
            <path d="M8 1l1.854 3.757L14 5.572l-3 2.924.708 4.129L8 10.5l-3.708 2.125L5 8.496 2 5.572l4.146-.815L8 1z" />
          </svg>
        ))}
      </div>
      <p className="text-[16px] leading-[26px] text-[#1C1C1A] italic">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-semibold text-[14px] text-[#1C1C1A]">{name}</p>
        <p className="text-[13px] text-[#4A4840]">{label}</p>
      </div>
    </div>
  );
}
