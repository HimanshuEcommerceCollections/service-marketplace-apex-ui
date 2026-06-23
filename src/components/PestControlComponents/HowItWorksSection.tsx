import StepItem from '../../sections/PestControlSections/StepItem';
import { steps } from '../../data/PestControlData/howItWorksData';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-16 lg:py-24 bg-[#EDECE8]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <div className="max-w-[600px] mx-auto text-center mb-12">
          <span className="apex-overline">The Process</span>
          <h2
            className="font-bold text-[28px] leading-[34px] md:text-[40px] md:leading-[48px] text-[#1C1C1A] mt-2"
            style={{ fontFamily: "'Lora', serif" }}
          >
            How it works.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
