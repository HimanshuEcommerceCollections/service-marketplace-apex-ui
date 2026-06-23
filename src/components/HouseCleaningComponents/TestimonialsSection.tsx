import TestimonialCard from '../../sections/HouseCleaningSections/TestimonialCard';
import { testimonialsData } from '../../data/HouseCleaningData/testimonialsData';

export default function TestimonialsSection() {
  return (
    <section className="w-full py-14 px-5 bg-white">
      <div className="w-full md:max-w-[728px] lg:max-w-[1280px] mx-auto">

        <p className="apex-overline mb-2">What People Say</p>
        <h2
          className="font-bold text-[28px] leading-[32px] text-[#1C1C1A] mb-8"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Illustrative feedback.
        </h2>

        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.map((t) => (
            <TestimonialCard
              key={t.id}
              rating={t.rating}
              quote={t.quote}
              attribution={t.attribution}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
