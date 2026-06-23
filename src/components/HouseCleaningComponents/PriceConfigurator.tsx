'use client';
import { useState } from 'react';
import PriceSummaryCard from '../../sections/HouseCleaningSections/PriceSummaryCard';
import {
  cleaningTypes,
  type CleaningType,
  bedroomOptions,
  bathroomOptions,
  basePrices,
  bedroomMultiplier,
  bathroomMultiplier,
} from '../../data/HouseCleaningData/configuratorData';

export default function PriceConfigurator() {
  const [cleaningType, setCleaningType] = useState<CleaningType>('Standard');
  const [bedrooms, setBedrooms]         = useState(1);
  const [bathrooms, setBathrooms]       = useState(1);

  const estimatedPrice =
    basePrices[cleaningType] +
    (bedrooms - 1) * bedroomMultiplier +
    (bathrooms - 1) * bathroomMultiplier;

  return (
    <section id="configurator" className="w-full py-14 px-5 bg-[#F5F5F3]">
      <div className="w-full md:max-w-[728px] lg:max-w-[1280px] mx-auto">

        <p className="apex-overline mb-2">House Cleaning</p>
        <h2
          className="font-bold text-[28px] leading-[32px] text-[#1C1C1A] mb-8"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Configure your cleaning service.
        </h2>

        <div className="flex flex-col lg:flex-row lg:gap-8 gap-6">

          {/* Form Card */}
          <div className="apex-card p-7 flex flex-col gap-6 w-full lg:flex-1">

            {/* Progress */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex flex-row justify-between items-center">
                <span className="text-[13px] font-semibold uppercase tracking-[0.78px] text-[#8A8580]">
                  Step 1 of 3
                </span>
                <span className="text-[13px] text-[#8A8580]">Choose your home details</span>
              </div>
              <div className="relative w-full h-[6px] bg-[#EDECE8] rounded-full">
                <div className="absolute left-0 top-0 bottom-0 bg-[#C07820] rounded-full w-[33%]" />
              </div>
            </div>

            {/* Cleaning Type */}
            <div>
              <p className="text-[13px] font-semibold text-[#1C1C1A] mb-3">Cleaning Type</p>
              <div className="flex flex-row gap-2 flex-wrap">
                {cleaningTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setCleaningType(type)}
                    className={`px-4 h-9 rounded-[6px] text-sm font-semibold transition-colors border ${
                      cleaningType === type
                        ? 'bg-[#1B2D4F] text-white border-[#1B2D4F]'
                        : 'bg-white text-[#1C1C1A] border-[#E4E2DC] hover:border-[#1B2D4F]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <p className="text-[13px] font-semibold text-[#1C1C1A] mb-3">Bedrooms</p>
              <div className="flex flex-row gap-2 flex-wrap">
                {bedroomOptions.map((n) => (
                  <button
                    key={n}
                    onClick={() => setBedrooms(n)}
                    className={`w-10 h-10 rounded-[6px] text-sm font-semibold border transition-colors ${
                      bedrooms === n
                        ? 'bg-[#1B2D4F] text-white border-[#1B2D4F]'
                        : 'bg-white text-[#1C1C1A] border-[#E4E2DC] hover:border-[#1B2D4F]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <p className="text-[13px] font-semibold text-[#1C1C1A] mb-3">Bathrooms</p>
              <div className="flex flex-row gap-2 flex-wrap">
                {bathroomOptions.map((n) => (
                  <button
                    key={n}
                    onClick={() => setBathrooms(n)}
                    className={`w-10 h-10 rounded-[6px] text-sm font-semibold border transition-colors ${
                      bathrooms === n
                        ? 'bg-[#1B2D4F] text-white border-[#1B2D4F]'
                        : 'bg-white text-[#1C1C1A] border-[#E4E2DC] hover:border-[#1B2D4F]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Price Summary */}
          <div className="w-full lg:w-[300px] shrink-0">
            <PriceSummaryCard
              estimatedPrice={estimatedPrice}
              onContinue={() => {}}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
