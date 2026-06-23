import TestimonialCard from '../../sections/PoolSections/TestimonialCard';
import { testimonials } from '../../data/PoolData/poolData';

export default function PoolTestimonials() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-16 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">

        <div className="mb-3">
          <h2
            className="font-bold text-[28px] md:text-[36px] text-[#1C1C1A]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Illustrative feedback.
          </h2>
        </div>
        <p className="text-[13px] text-[#4A4840] mb-8">
          Representative of the type of feedback Apex coordinators aim to earn. This is a draft experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.name}
              quote={t.quote}
              name={t.name}
              label={t.label}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
