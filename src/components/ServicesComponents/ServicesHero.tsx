import Link from 'next/link'
import { SERVICES } from '../../data/ServicesData/services'
import DiscoveryRow from '../../sections/ServicesSections/DiscoveryRow'

const PREVIEW_SERVICES = SERVICES.slice(0, 6)

export default function ServicesHero() {
  return (
    <section className="bg-white px-5 pt-12 pb-10 md:px-10 md:pt-16 lg:px-20 lg:grid lg:grid-cols-[1fr_536px] lg:gap-10 lg:items-start lg:min-h-[618px]">

      {/* Left: text content */}
      <div className="flex flex-col">
        <span className="eyebrow text-[11px]">Our Services</span>

        <h1 className="font-bold text-[36px] md:text-[48px] lg:text-[64px] leading-[115%] text-[#1C1C1A] mt-4 max-w-[640px]"
          style={{ fontFamily: 'Lora, serif' }}>
          Everything your home needs, in one place.
        </h1>

        <div className="w-[120px] md:w-[160px] lg:w-[200px] h-1 bg-[#C07820] rounded-sm mt-6" />

        <p className="text-[15px] md:text-[16px] lg:text-[18px] leading-[160%] text-[#4A4844] mt-6 max-w-[580px]"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          Explore 11 home services with transparent pricing, clear options, and coordinator-confirmed bookings.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="#services-grid" className="btn-primary text-[15px] px-6 h-11">
            Browse Services
          </Link>
          <Link href="#pricing" className="btn-secondary text-[15px] px-6 h-11">
            View Pricing
          </Link>
        </div>
      </div>

      {/* Right: Discovery card — hidden below lg */}
      <div className="hidden lg:block bg-white border border-[#E4E2DC] shadow-[0px_16px_48px_rgba(0,0,0,0.14),0px_4px_16px_rgba(0,0,0,0.08)] rounded-[16px] p-5">
        <p className="font-bold text-[18px] leading-[23px] text-[#1C1C1A] px-2"
          style={{ fontFamily: 'Lora, serif' }}>
          11 Services Available
        </p>
        <p className="text-[12px] leading-[15px] text-[#8A8680] px-2 mt-1"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          Wake County · Coordinator-confirmed
        </p>

        {PREVIEW_SERVICES.map((svc, i) => (
          <DiscoveryRow key={i} letter={svc.letter} name={svc.name} price={svc.price} />
        ))}

        <span className="font-medium text-[12px] text-[#C07820] px-2 mt-3 block"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          + 5 more services →
        </span>
      </div>

    </section>
  )
}
