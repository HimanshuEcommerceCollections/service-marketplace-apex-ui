import { SERVICES } from '../../data/ServicesData/services'
import ServiceCard from '../../sections/ServicesSections/ServiceCard'

export default function ServicesGrid() {
  return (
    <section id="services-grid" className="bg-white px-5 pt-12 pb-12 md:px-10 md:pt-14 md:pb-14 lg:px-20 lg:pt-20 lg:pb-20">
      <span className="eyebrow text-[11px]">11 Home Services</span>
      <h2 className="heading-lora text-[28px] md:text-[36px] lg:text-[40px] mt-3">
        Choose the service you need.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mt-10">
        {SERVICES.map((svc, i) => (
          <ServiceCard key={i} service={svc} />
        ))}
      </div>
    </section>
  )
}
