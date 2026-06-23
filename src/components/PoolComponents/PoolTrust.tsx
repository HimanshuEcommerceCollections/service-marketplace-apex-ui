import TrustItem from '../../sections/PoolSections/TrustItem';
import { trustStats } from '../../data/PoolData/poolData';

export default function PoolTrust() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-16 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">

        <h2
          className="font-bold text-[28px] md:text-[36px] text-[#1C1C1A] mb-10"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Simple from start to finish.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustStats.map((item, index) => (
            <div
              key={item.heading}
              className={`${
                index < trustStats.length - 1 ? 'lg:border-r lg:border-[#E4E2DC] lg:pr-8' : ''
              }`}
            >
              <TrustItem heading={item.heading} body={item.body} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
