export default function PoolHero() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

          {/* Left: text */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            <span className="font-semibold text-[11px] tracking-[1.5px] uppercase text-[#C07820]">
              Pool Service
            </span>

            <h1
              className="font-bold text-[32px] leading-[40px] md:text-[40px] md:leading-[50px] lg:text-[64px] lg:leading-[72px] text-[#1C1C1A]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Keep your pool ready with simple{' '}
              <span className="relative whitespace-nowrap">
                maintenance plans
                <span className="absolute bottom-[-5px] left-0 right-0 h-[4px] bg-[#C07820] rounded-[2px]" />
              </span>
              .
            </h1>

            <p className="text-[18px] leading-[29px] text-[#4A4840] max-w-[484px]">
              Choose your pool size and service frequency to see your starting price before requesting service.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-6 h-[52px] bg-[#1B2D4F] text-white font-semibold text-[14px] rounded-md hover:bg-[#162440] transition-colors no-underline"
              >
                Book Pool Service
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-6 h-[52px] bg-white border border-[#E4E2DC] text-[#1C1C1A] font-semibold text-[14px] rounded-md hover:bg-[#F5F5F3] transition-colors no-underline"
              >
                View Pricing
              </a>
            </div>
          </div>

          {/* Right: image placeholder */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <div className="w-full max-w-[520px] min-h-[420px] rounded-[10px] bg-[#EDECE8] border border-[#E4E2DC] shadow-[0px_8px_32px_rgba(0,0,0,0.14)] flex flex-col items-center justify-center gap-3 text-[#8A8580]">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.5" aria-hidden="true">
                <rect x="4" y="6" width="32" height="28" rx="4" fill="#C8C6C0" />
                <circle cx="14" cy="16" r="4" fill="#F5F5F2" />
                <path d="M4 26l9-8 8 6 7-9 8 11" stroke="#F5F5F2" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium text-[#8A8580]">Pool photo — Wake County, NC</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
