'use client';
import { useState } from 'react';
import SizeSelectorCard from '../../sections/LawnCareSections/SizeSelectorCard';
import FrequencyToggle from '../../sections/LawnCareSections/FrequencyToggle';
import PriceOutputCard from '../../sections/LawnCareSections/PriceOutputCard';
import { yardSizes } from '../../data/LawnCareData/sizeSelectorData';

const FREQUENCIES = ['Weekly', 'Every two weeks', 'Monthly'];

export default function PricingCalcSection() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFreq, setSelectedFreq] = useState('Every two weeks');

  const selectedSizeData = yardSizes.find((s) => s.id === selectedSize);
  const displayPrice = selectedSizeData
    ? `From $${selectedSizeData.basePrice} DRAFT`
    : 'Select a yard size';

  return (
    <section id="pricing-calc" className="w-full py-12 md:py-16 bg-[#F5F5F2]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <p className="font-semibold text-[14px] text-[#1C1C1A] mb-6">
          Find your lawn care starting price.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          <div className="flex flex-col gap-6">
            <SizeSelectorCard
              yardSizes={yardSizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
            <FrequencyToggle
              frequencies={FREQUENCIES}
              selected={selectedFreq}
              onSelect={setSelectedFreq}
            />
          </div>

          <PriceOutputCard
            displayPrice={displayPrice}
            hasSelection={!!selectedSizeData}
          />
        </div>
      </div>
    </section>
  );
}
