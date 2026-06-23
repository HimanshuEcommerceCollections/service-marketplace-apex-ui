import { ctaBanner } from '../../data/PestControlData/ctaData';

export default function CTABannerSection() {
  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-[#1B2D4F]">
      <div className="w-full max-w-[640px] mx-auto px-5 md:px-10 lg:px-0 flex flex-col items-center text-center gap-5">
        <h2
          className="font-bold text-[28px] leading-[34px] md:text-[40px] md:leading-[48px] text-white"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {ctaBanner.heading}
        </h2>
        <p className="text-[17px] leading-[26px] text-[#B8C4D0]">{ctaBanner.subline}</p>
        <a
          href="#pest-selector"
          className="inline-flex items-center justify-center mt-3 px-8 h-[52px] bg-[#C07820] text-white font-semibold text-[15px] rounded-[6px] hover:bg-[#A8681A] transition-colors no-underline"
        >
          {ctaBanner.buttonLabel}
        </a>
      </div>
    </section>
  );
}
