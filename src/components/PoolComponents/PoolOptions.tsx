import OptionCard from '../../sections/PoolSections/OptionCard';
import { planInclusions } from '../../data/PoolData/poolData';

export default function PoolOptions() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-16 bg-[#F5F5F3]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">

        <h2
          className="font-bold text-[28px] md:text-[36px] text-[#1C1C1A] mb-10"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Clear options before you request service.
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* Left: inclusions list */}
          <div className="flex-1">
            <p className="font-semibold text-[15px] text-[#1C1C1A] mb-5">Every visit includes:</p>
            <ul className="flex flex-col gap-4">
              {planInclusions.map((item) => (
                <OptionCard key={item.text} text={item.text} />
              ))}
            </ul>
          </div>

          {/* Right: navy price card */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="bg-[#1B2D4F] rounded-[10px] p-7 flex flex-col gap-4">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#FEF8EE] text-[#C07820] text-[11px] font-semibold tracking-wide w-fit">
                FROM
              </span>
              <p
                className="font-bold text-[28px] leading-[36px] text-[#C07820]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                From $120 DRAFT
              </p>
              <p className="text-[13px] leading-[20px] text-[#CCD6E0]">
                Medium pool, every two weeks. Select your size above to see your starting price.
              </p>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center w-full h-12 bg-[#C07820] text-white font-semibold text-[14px] rounded-md hover:bg-[#A8681A] transition-colors no-underline"
              >
                Request Pool Service
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
