import Link from 'next/link'

export default function ServicesCTA() {
  return (
    <section className="bg-[#1B2D4F] px-5 pt-24 pb-24 md:px-10 lg:px-20 flex flex-col items-start lg:items-center text-left lg:text-center">
      <h2 className="font-bold text-[32px] md:text-[40px] lg:text-[48px] leading-[115%] text-white max-w-[800px]"
        style={{ fontFamily: 'Lora, serif' }}>
        Find the right service for your home.
      </h2>
      <p className="text-[14px] md:text-[16px] lg:text-[18px] leading-[160%] text-[#A8B8CC] mt-6 max-w-[800px]"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        Choose a category and see how Apex can help.
      </p>
      <Link href="#services-grid" className="btn-amber text-[15px] px-8 h-[52px] mt-8">
        Book Now
      </Link>
    </section>
  )
}
