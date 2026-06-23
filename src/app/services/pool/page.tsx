import type { Metadata } from 'next';
import PoolHero from '../../../components/PoolComponents/PoolHero';
import PoolPricing from '../../../components/PoolComponents/PoolPricing';
import PoolProcess from '../../../components/PoolComponents/PoolProcess';
import PoolTrust from '../../../components/PoolComponents/PoolTrust';
import PoolOptions from '../../../components/PoolComponents/PoolOptions';
import PoolCrossSell from '../../../components/PoolComponents/PoolCrossSell';
import PoolTestimonials from '../../../components/PoolComponents/PoolTestimonials';
import PoolFAQ from '../../../components/PoolComponents/PoolFAQ';

export const metadata: Metadata = {
  title: 'Pool Service — Apex Total Home Services',
  description:
    'Pool cleaning and maintenance plans in Wake County, NC. Transparent pricing, vetted pros, no contracts.',
};

export default function PoolPage() {
  return (
    <>
      <PoolHero />
      <PoolPricing />
      <PoolProcess />
      <PoolTrust />
      <PoolOptions />
      <PoolCrossSell />
      <PoolTestimonials />
      <PoolFAQ />

      {/* Final CTA */}
      <section className="w-full py-20 px-5 bg-[#1B2D4F] text-center">
        <h2
          className="font-bold text-[28px] md:text-[40px] text-white leading-tight mb-4"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Keep your pool ready all season.
        </h2>
        <p className="text-[18px] text-[#CCD6E0] mb-8 max-w-xl mx-auto leading-[29px]">
          Transparent pricing, vetted pros, and a coordinator who keeps things on track.
        </p>
        <a
          href="#pricing"
          className="inline-flex items-center justify-center bg-[#C07820] text-white font-semibold text-[14px] h-[52px] px-8 rounded-md hover:bg-[#A8681A] transition-colors no-underline"
        >
          Book Pool Service
        </a>
      </section>
    </>
  );
}
