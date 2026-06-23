import StepItem from '../../sections/LawnCareSections/StepItem';
import { steps } from '../../data/LawnCareData/howItWorksData';

export default function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-[#F5F5F2]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <p className="apex-overline mb-[14px]">How It Works</p>
        <h2
          className="font-bold text-[28px] leading-[34px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[55px] text-[#1C1C1A]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Simple from start to finish.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-[26px]">
          {steps.map((step) => (
            <StepItem
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              icon={step.icon}
              title={step.title}
              body={step.body}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
