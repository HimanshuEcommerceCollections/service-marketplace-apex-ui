'use client';

import { useState } from 'react';
import PestTypeButton from './PestTypeButton';
import PriceOutputCard from './PriceOutputCard';

interface PestType {
  id: string;
  label: string;
  icon: string;
}

interface Props {
  pestTypes: PestType[];
}

export default function PestSelectorCard({ pestTypes }: Props) {
  const [selectedPest, setSelectedPest] = useState<string | null>(null);

  return (
    <div className="apex-card w-full pt-[40px] px-[28px] pb-[36px] flex flex-col gap-2 mt-4">
      <div className="flex justify-between items-center w-full mb-1">
        <span className="font-semibold text-[12px] tracking-[0.8px] uppercase text-[#8A8580]">
          STEP 1 OF 3
        </span>
        <span className="text-[12px] text-[#8A8580]">Identify your situation</span>
      </div>

      <div className="w-full h-[5px] bg-[#EDECE8] rounded-full relative mb-3">
        <div
          className="absolute left-0 top-0 bottom-0 bg-[#C07820] rounded-full"
          style={{ width: '33%' }}
        />
      </div>

      <p className="font-semibold text-[14px] text-[#1C1C1A] mb-1">What needs attention?</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pestTypes.map((pt) => (
            <PestTypeButton
              key={pt.id}
              label={pt.label}
              icon={pt.icon}
              selected={selectedPest === pt.id}
              onClick={() => setSelectedPest(pt.id)}
            />
          ))}
        </div>

        <div className={selectedPest !== null ? 'block' : 'hidden lg:block'}>
          <PriceOutputCard />
        </div>
      </div>
    </div>
  );
}
