import { ClipboardList, CalendarDays, CheckSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import StepCard from '../../sections/HouseCleaningSections/StepCard';
import { stepsData } from '../../data/HouseCleaningData/stepsData';

const iconMap: Record<string, LucideIcon> = {
  ClipboardList,
  CalendarDays,
  CheckSquare,
};

export default function HowItWorksSection() {
  return (
    <section className="w-full py-14 px-5 bg-[#F5F5F3]">
      <div className="w-full md:max-w-[728px] lg:max-w-[1280px] mx-auto">

        <p className="apex-overline mb-2">How It Works</p>
        <h2
          className="font-bold text-[28px] leading-[32px] text-[#1C1C1A] mb-10"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Simple from start to finish.
        </h2>

        <div className="flex flex-col gap-10 md:grid md:grid-cols-3">
          {stepsData.map((step) => {
            const Icon = iconMap[step.icon];
            return (
              <StepCard
                key={step.id}
                icon={Icon}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
