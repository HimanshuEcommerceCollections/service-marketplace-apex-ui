import { TRUST_STATS } from '../../data/ServicesData/trustStats'
import TrustCard from '../../sections/ServicesSections/TrustCard'

export default function TrustSection() {
  return (
    <section className="bg-[#1B2D4F] px-5 pt-12 pb-12 md:px-10 md:pt-14 md:pb-14 lg:px-20 lg:pt-20 lg:pb-20">
      <span className="eyebrow text-[11px]">Why Apex</span>
      <h2 className="font-bold text-[28px] md:text-[36px] lg:text-[40px] leading-[120%] text-white mt-3"
        style={{ fontFamily: 'Lora, serif' }}>
        Built for homeowners in Wake County.
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-10">
        {TRUST_STATS.map((stat, i) => (
          <TrustCard key={i} stat={stat} />
        ))}
      </div>
    </section>
  )
}
