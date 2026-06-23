'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export default function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`flex flex-col w-full border border-[#E4E2DC] rounded-[10px] overflow-hidden transition-colors ${
        isOpen ? 'bg-[#FEF8EE]' : 'bg-white'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row justify-between items-center px-[22px] py-5 w-full text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[16px] leading-[19px] text-[#1C1C1A] pr-4">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#C07820]' : 'text-[#8A8580]'
          }`}
          strokeWidth={1.67}
        />
      </button>
      {isOpen && (
        <div className="px-[22px] pb-[22px]">
          <p className="text-[14px] leading-[22px] text-[#4A4840]">{answer}</p>
        </div>
      )}
    </div>
  );
}
