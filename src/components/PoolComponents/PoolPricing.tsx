'use client';

import { useState } from 'react';
import PricingCard from '../../sections/PoolSections/PricingCard';
import { poolSizes, frequencies } from '../../data/PoolData/poolData';

export default function PoolPricing() {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedFreq, setSelectedFreq] = useState('biweekly');

  const currentSize = poolSizes.find((s) => s.id === selectedSize) ?? poolSizes[1];
  const currentFreq = frequencies.find((f) => f.id === selectedFreq) ?? frequencies[1];
  const price = Math.round(currentSize.basePrice * currentFreq.multiplier);

  return (
    <section id="pricing" className="w-full py-12 md:py-16 lg:py-16 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">

        <h2
          className="font-bold text-[28px] md:text-[32px] text-[#1C1C1A] mb-8"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Find your pool care starting price.
        </h2>

        <div className="w-full border border-[#E4E2DC] rounded-[10px] shadow-md p-5 md:p-7 flex flex-col lg:flex-row gap-8">

          {/* Left: selectors */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Pool size */}
            <div>
              <p className="font-semibold text-[14px] text-[#1C1C1A] mb-3">Pool size</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {poolSizes.map((size) => (
                  <PricingCard
                    key={size.id}
                    label={size.label}
                    subLabel={size.subLabel}
                    selected={selectedSize === size.id}
                    onClick={() => setSelectedSize(size.id)}
                  />
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <p className="font-semibold text-[14px] text-[#1C1C1A] mb-3">Service frequency</p>
              <div className="flex bg-[#F5F5F2] border border-[#E4E2DC] rounded-[8px] p-1 gap-1">
                {frequencies.map((freq) => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setSelectedFreq(freq.id)}
                    className={`flex-1 h-11 rounded-md text-[13px] font-semibold transition-colors ${
                      selectedFreq === freq.id
                        ? 'bg-[#1B2D4F] text-white'
                        : 'bg-transparent text-[#1C1C1A] hover:bg-white'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right: price card */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="bg-[#1B2D4F] rounded-[10px] p-7 flex flex-col gap-4">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#FEF8EE] text-[#C07820] text-[11px] font-semibold tracking-wide w-fit">
                FROM
              </span>
              <p
                className="font-bold text-[28px] leading-[36px] text-[#C07820]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                From ${price} DRAFT
              </p>
              <p className="text-[13px] leading-[20px] text-[#CCD6E0]">
                Starting price based on pool size and service frequency. Final price confirmed by a coordinator before service.
              </p>
              <a
                href="mailto:ansh@ecommercecollections.com"
                className="inline-flex items-center justify-center w-full h-12 bg-[#C07820] text-white font-semibold text-[14px] rounded-md hover:bg-[#A8681A] transition-colors no-underline"
              >
                Request Pool Service
              </a>
              <p className="text-[12px] text-[#CCD6E0]">
                No payment needed to request. A coordinator contacts you to confirm details.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
