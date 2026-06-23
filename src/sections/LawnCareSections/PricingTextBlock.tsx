interface Props {
  eyebrow: string;
  heading: string;
  body: string;
}

export default function PricingTextBlock({ eyebrow, heading, body }: Props) {
  return (
    <div className="flex flex-col">
      <p className="apex-overline">{eyebrow}</p>

      <h2
        className="font-bold text-[28px] leading-[34px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[55px] text-[#1C1C1A] mt-[14px]"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {heading}
      </h2>

      <p className="text-[16px] leading-[26px] md:text-[18px] md:leading-[29px] text-[#4A4840] max-w-[458px] mt-[14px]">
        {body}
      </p>
    </div>
  );
}
