import ReviewCard from '../../sections/PestControlSections/ReviewCard';
import { testimonials } from '../../data/PestControlData/testimonialsData';

export default function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-[#F5F5F2]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <div className="max-w-[600px] mx-auto text-center mb-10">
          <span className="apex-overline">Reviews</span>
          <h2
            className="font-bold text-[28px] leading-[34px] md:text-[40px] md:leading-[48px] text-[#1C1C1A] mt-2"
            style={{ fontFamily: "'Lora', serif" }}
          >
            What customers say.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ReviewCard
              key={i}
              stars={t.stars}
              quote={t.quote}
              attribution={t.attribution}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
