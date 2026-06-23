interface HeroContentProps {
  eyebrow: string;
  headlinePart1: string;
  headlineUnderlined: string;
  subline: string;
  primaryCTA: string;
  secondaryCTA: string;
}

export default function HeroContent({
  eyebrow,
  headlinePart1,
  headlineUnderlined,
  subline,
  primaryCTA,
  secondaryCTA,
}: HeroContentProps) {
  return (
    <div className="flex flex-col">
      <p className="apex-overline mb-2">{eyebrow}</p>

      <div className="relative mb-5">
        <h1
          className="font-bold text-[32px] leading-[40px] md:text-[48px] md:leading-[58px] lg:text-[64px] lg:leading-[72px] text-[#1C1C1A]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {headlinePart1}{' '}
          <span className="relative inline-block">
            {headlineUnderlined}
            <span className="absolute bottom-[-8px] left-0 right-[20%] h-[4px] bg-[#C07820] rounded-[2px]" />
          </span>
          .
        </h1>
      </div>

      <p className="text-[16px] leading-[26px] md:text-[18px] md:leading-[29px] text-[#4A4840] max-w-[485px] mb-[18px]">
        {subline}
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href="#pricing-calc"
          className="inline-flex items-center justify-center px-6 h-[52px] bg-[#1B2D4F] text-white font-semibold text-sm rounded-[6px] hover:bg-[#162440] transition-colors no-underline"
        >
          {primaryCTA}
        </a>
        <a
          href="#pricing"
          className="inline-flex items-center justify-center px-6 h-[52px] bg-white border border-[#E4E2DC] text-[#1C1C1A] font-semibold text-sm rounded-[6px] hover:bg-[#F5F5F2] transition-colors no-underline"
        >
          {secondaryCTA}
        </a>
      </div>
    </div>
  );
}
