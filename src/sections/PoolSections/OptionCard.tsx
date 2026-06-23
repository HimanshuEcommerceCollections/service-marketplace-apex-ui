interface Props {
  text: string;
}

export default function OptionCard({ text }: Props) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-[#C07820]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="#C07820" strokeWidth="1.5" />
          <path d="M5 8l2 2 4-4" stroke="#C07820" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-[15px] leading-[24px] text-[#1C1C1A]">{text}</span>
    </li>
  );
}
