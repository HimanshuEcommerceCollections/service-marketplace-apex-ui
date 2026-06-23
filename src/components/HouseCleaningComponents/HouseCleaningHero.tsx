export default function HouseCleaningHero() {
  return (
    <section className="w-full py-14 px-5 bg-white">
      <div className="w-full md:max-w-[728px] lg:max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Left: Text Content */}
          <div className="flex flex-col gap-0 lg:max-w-[560px] w-full">
            <p className="apex-overline mb-2">House Cleaning</p>

            <div className="relative mb-[21px]">
              <h1
                className="font-bold text-[36px] leading-[40px] text-[#1C1C1A]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Professional home cleaning with{' '}
                <span className="relative inline-block">
                  transparent pricing
                  <span className="absolute left-0 right-[20%] -bottom-2 h-1 bg-[#C07820] rounded-[2px]" />
                </span>
                .
              </h1>
            </div>

            <p className="text-[17px] leading-[27px] text-[#4A4840] mb-[18px]">
              Choose your cleaning type, home size, and see your estimated price before requesting service.
            </p>

            <div className="flex flex-row flex-wrap gap-3">
              <a
                href="#configurator"
                className="inline-flex items-center justify-center px-6 h-[52px] bg-[#1B2D4F] text-white font-semibold text-sm rounded-[6px] hover:opacity-90 transition-opacity no-underline"
              >
                Book Cleaning
              </a>
              <a
                href="#configurator"
                className="inline-flex items-center justify-center px-6 h-[52px] bg-white border border-[#E4E2DC] text-[#1C1C1A] font-semibold text-sm rounded-[6px] hover:bg-[#F5F5F3] transition-colors no-underline"
              >
                View Pricing
              </a>
            </div>
          </div>

          {/* Right: Hero Image Placeholder */}
          <div className="relative mt-8 lg:mt-0 lg:flex-1">
            <div
              className="relative w-full min-h-[260px] bg-[#EDECE8] border border-[#E4E2DC] rounded-[10px] flex flex-col items-center justify-center gap-3"
              style={{ boxShadow: '0px 8px 32px rgba(0,0,0,0.14)' }}
            >
              <div className="w-10 h-10 opacity-50 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="5" y="5" width="30" height="30" rx="2" stroke="#8A8580" strokeWidth="3.33" fill="none"/>
                  <circle cx="14" cy="14" r="4" stroke="#8A8580" strokeWidth="3.33" fill="none"/>
                  <path d="M5 28L13 20L19 26L26 18L35 28" stroke="#8A8580" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[13px] text-[#8A8580]">Image: clean Raleigh home interior</p>

              {/* Trust badge */}
              <div
                className="absolute -bottom-5 left-[18px] right-[18px] flex flex-row items-center gap-[10px] bg-white border border-[#E4E2DC] rounded-[10px] px-4 py-3"
                style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}
              >
                <div className="w-7 h-7 bg-[#E0F4E5] rounded-full flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8.5L6 12.5L14 4.5" stroke="#2E7D5B" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="font-semibold text-[13px] leading-[16px] text-[#1C1C1A]">
                  [Sample] Trusted by Raleigh homeowners
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
