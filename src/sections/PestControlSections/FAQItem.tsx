'use client';

import { useState } from 'react';

interface Props {
  q: string;
  a: string;
  defaultOpen?: boolean;
}

export default function FAQItem({ q, a, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#E4E2DC] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-[16px] text-[#1C1C1A]">{q}</span>
        <span
          className="shrink-0 text-[#8A8580] transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-[15px] leading-[23px] text-[#4B4A47] pb-5">{a}</p>
      )}
    </div>
  );
}
