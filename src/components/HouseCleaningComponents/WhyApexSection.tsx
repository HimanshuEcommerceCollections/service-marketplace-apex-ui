import { Tag, CalendarDays, CheckSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import FeatureCard from '../../sections/HouseCleaningSections/FeatureCard';
import { featuresData } from '../../data/HouseCleaningData/featuresData';

const iconMap: Record<string, LucideIcon> = {
  Tag,
  CalendarDays,
  CheckSquare,
};

export default function WhyApexSection() {
  return (
    <section className="w-full py-14 px-5 bg-white">
      <div className="w-full md:max-w-[728px] lg:max-w-[1280px] mx-auto">

        <p className="apex-overline mb-2">Why Choose Apex</p>
        <h2
          className="font-bold text-[28px] leading-[32px] text-[#1C1C1A] mb-8"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Cleaning made simple.
        </h2>

        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <FeatureCard
                key={feature.id}
                icon={Icon}
                title={feature.title}
                description={feature.description}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
