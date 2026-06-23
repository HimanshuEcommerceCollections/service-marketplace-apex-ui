import CrossSellCard from '../../sections/PoolSections/CrossSellCard';
import { crossSellServices } from '../../data/PoolData/poolData';

export default function PoolCrossSell() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-16 bg-[#1B2D4F]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">

        <div className="max-w-[680px] mb-10">
          <h2
            className="font-bold text-[28px] md:text-[36px] text-white mb-4"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Built around your whole home.
          </h2>
          <p className="text-[18px] leading-[29px] text-[#CCD6E0]">
            Pool care is just one part of the Apex ecosystem. Browse other services available in Wake County.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {crossSellServices.map((service) => (
            <CrossSellCard
              key={service.heading}
              heading={service.heading}
              body={service.body}
              cta={service.cta}
              href={service.href}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
