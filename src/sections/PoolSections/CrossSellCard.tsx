import Link from 'next/link';

interface Props {
  heading: string;
  body: string;
  cta: string;
  href: string;
}

export default function CrossSellCard({ heading, body, cta, href }: Props) {
  return (
    <div className="bg-white/[0.07] border border-white/[0.12] rounded-[10px] p-6 flex flex-col gap-3">
      <h3
        className="font-bold text-[20px] text-white"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {heading}
      </h3>
      <p className="text-[14px] leading-[22px] text-[#A8B8CC]">{body}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-1 font-semibold text-[14px] text-[#C07820] hover:opacity-80 transition-opacity no-underline mt-auto"
      >
        {cta}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
