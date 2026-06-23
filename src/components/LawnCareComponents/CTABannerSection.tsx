import { ctaBanner } from '../../data/LawnCareData/ctaData';

export default function CTABannerSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-[#1B2D4F]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0 flex flex-col items-center text-center gap-4">
        <h2
          className="font-bold text-[24px] leading-tight md:text-[28px] lg:text-[32px] text-white"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {ctaBanner.heading}
        </h2>

        <p className="text-[16px] leading-[26px] text-[#A8B8CC]">
          {ctaBanner.subline}
        </p>

        <a
          href="#pricing-calc"
          className="mt-2 inline-flex items-center justify-center px-10 h-12 bg-[#C07820] text-white font-semibold text-sm rounded-[6px] hover:bg-[#a86a1a] transition-colors no-underline"
        >
          {ctaBanner.buttonLabel}
        </a>
      </div>
    </section>
  );
}
