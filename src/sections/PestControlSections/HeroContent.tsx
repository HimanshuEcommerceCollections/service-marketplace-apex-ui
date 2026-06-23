interface Props {
  eyebrow: string;
  headlineLine1: string;
  headlineUnderlined: string;
  headlineLine3: string;
  subline: string;
  primaryCTA: string;
  secondaryCTA: string;
}

export default function HeroContent({
  eyebrow,
  headlineLine1,
  headlineUnderlined,
  headlineLine3,
  subline,
  primaryCTA,
  secondaryCTA,
}: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-[560px]">
      <span className="apex-overline">{eyebrow}</span>

      <h1
        className="font-bold text-[32px] leading-[38px] md:text-[44px] md:leading-[52px] lg:text-[56px] lg:leading-[64px] text-[#1C1C1A]"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {headlineLine1}{' '}
        <span className="relative inline-block">
          {headlineUnderlined}
          <span className="absolute bottom-[-6px] left-0 right-0 h-[4px] bg-[#C07820] rounded-[2px]" />
        </span>
        {' '}{headlineLine3}
      </h1>

      <p className="text-[17px] leading-[26px] text-[#4B4A47] max-w-[480px]">{subline}</p>

      <div className="flex flex-wrap gap-3 pt-2">
        <a
          href="#pest-selector"
          className="inline-flex items-center justify-center px-6 h-[52px] bg-[#1B2D4F] text-white font-semibold text-sm rounded-[6px] hover:bg-[#162440] transition-colors no-underline"
        >
          {primaryCTA}
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center px-6 h-[52px] bg-white border border-[#E4E2DC] text-[#1C1C1A] font-semibold text-sm rounded-[6px] hover:bg-[#F5F5F3] transition-colors no-underline"
        >
          {secondaryCTA}
        </a>
      </div>
    </div>
  );
}
