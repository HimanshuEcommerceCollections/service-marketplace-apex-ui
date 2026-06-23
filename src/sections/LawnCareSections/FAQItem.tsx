'use client';
import { useState } from 'react';

interface Props {
  q: string;
  a: string;
}

export default function FAQItem({ q, a }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#E8EDF4]">
      <button
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[15px] text-[#1B2D4F]">{q}</span>
        <span className="text-[#C07820] text-xl font-light ml-4 flex-shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="pb-4 text-[14px] leading-[22px] text-[#4A4840]">
          {a}
        </div>
      )}
    </div>
  );
}
