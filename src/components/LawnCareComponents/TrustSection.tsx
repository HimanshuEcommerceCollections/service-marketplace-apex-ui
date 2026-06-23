import TrustCard from '../../sections/LawnCareSections/TrustCard';
import { trustFeatures } from '../../data/LawnCareData/trustData';

export default function TrustSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <p className="apex-overline mb-[14px]">Why Choose Apex</p>
        <h2
          className="font-bold text-[28px] leading-[34px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[55px] text-[#1C1C1A]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Lawn care without the guesswork.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-[26px]">
          {trustFeatures.map((feature) => (
            <TrustCard
              key={feature.icon}
              icon={feature.icon}
              title={feature.title}
              body={feature.body}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
