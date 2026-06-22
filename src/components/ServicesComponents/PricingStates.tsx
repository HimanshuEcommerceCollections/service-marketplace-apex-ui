import { PRICING_STATES } from '../../data/ServicesData/pricingStates'
import PricingCard from '../../sections/ServicesSections/PricingCard'

export default function PricingStates() {
  return (
    <section id="pricing" className="bg-[#EDECE8] px-5 pt-12 pb-12 md:px-10 md:pt-14 md:pb-14 lg:px-20 lg:pt-20 lg:pb-20">
      <span className="eyebrow text-[11px]">Transparent Pricing</span>
      <h2 className="heading-lora text-[28px] md:text-[36px] lg:text-[40px] mt-3">
        Every service has a clear pricing path.
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-10">
        {PRICING_STATES.map((card, i) => (
          <PricingCard key={i} card={card} />
        ))}
      </div>
    </section>
  )
}
