import ProcessStep from '../../sections/PoolSections/ProcessStep';
import { processItems } from '../../data/PoolData/poolData';

export default function PoolProcess() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-16 bg-[#F5F5F3]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">

        <div className="max-w-[680px] mb-10">
          <h2
            className="font-bold text-[28px] md:text-[36px] text-[#1C1C1A] mb-4"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Pool care without the guesswork.
          </h2>
          <p className="text-[18px] leading-[29px] text-[#4A4840]">
            Every visit follows the same thorough routine so your pool stays clean, balanced, and ready to use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {processItems.map((item) => (
            <ProcessStep
              key={item.id}
              id={item.id}
              heading={item.heading}
              body={item.body}
              icon={item.icon}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
