import ReviewCard from '../../sections/LawnCareSections/ReviewCard';
import { testimonials } from '../../data/LawnCareData/testimonialsData';

export default function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-[#F5F5F2]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <p className="apex-overline mb-[14px]">What People Say</p>
        <h2
          className="font-bold text-[28px] leading-[34px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[55px] text-[#1C1C1A]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Illustrative feedback.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-[26px]">
          {testimonials.map((t) => (
            <ReviewCard
              key={t.name}
              stars={t.stars}
              quote={t.quote}
              name={t.name}
              location={t.location}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
