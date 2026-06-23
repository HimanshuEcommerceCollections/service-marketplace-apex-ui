import StatCard from '../../sections/PestControlSections/StatCard';
import { statCards } from '../../data/PestControlData/builtAroundData';

export default function BuiltAroundSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-[#1B2D4F]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <div className="max-w-[600px] mb-10">
          <span className="apex-overline">Our Approach</span>
          <h2
            className="font-bold text-[28px] leading-[34px] md:text-[40px] md:leading-[48px] text-white mt-2"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Built around your whole home.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <StatCard
              key={card.stat}
              stat={card.stat}
              label={card.label}
              body={card.body}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
