interface Props {
  fromLabel: string;
  price: string;
  disclaimer: string;
}

export default function PricingHighlightCard({ fromLabel, price, disclaimer }: Props) {
  return (
    <div className="relative w-full bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_16px_rgba(0,0,0,0.08)] rounded-[10px] h-[188px]">
      <span className="absolute top-[29px] left-[31px] bg-[#FEF8EE] rounded-full px-3 py-0.5 inline-flex items-center">
        <span className="font-semibold text-[11px] tracking-[1px] uppercase text-[#C07820]">{fromLabel}</span>
      </span>

      <p
        className="absolute top-[63px] left-[31px] right-[29px] font-bold text-[32px] leading-[38px] text-[#C07820]"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {price}
      </p>

      <p className="absolute top-[113px] left-[31px] right-[29px] text-[14px] leading-[22px] text-[#4A4840]">
        {disclaimer}
      </p>
    </div>
  );
}
