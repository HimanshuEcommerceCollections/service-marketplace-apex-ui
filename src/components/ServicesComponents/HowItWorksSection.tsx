import { HOW_IT_WORKS_STEPS } from '../../data/ServicesData/howItWorksSteps'
import StepCard from '../../sections/ServicesSections/StepCard'

export default function HowItWorksSection() {
  return (
    <section className="bg-white px-5 pt-12 pb-12 md:px-10 md:pt-14 md:pb-14 lg:px-20 lg:pt-20 lg:pb-20">
      <span className="eyebrow text-[11px]">How It Works</span>
      <h2 className="heading-lora text-[28px] md:text-[36px] lg:text-[40px] mt-3">
        Three steps. One booking.
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-10">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <StepCard key={i} step={step} />
        ))}
      </div>
    </section>
  )
}
