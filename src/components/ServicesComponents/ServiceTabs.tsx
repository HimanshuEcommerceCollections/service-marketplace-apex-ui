'use client'
import { useState } from 'react'

const TABS = ['All', 'Recurring', 'One-Time', 'Quote-Based'] as const

export default function ServiceTabs() {
  const [active, setActive] = useState<string>('All')

  return (
    <section className="bg-[#EDECE8] px-5 pt-8 pb-9 md:px-10 lg:px-20">
      <span className="eyebrow text-[11px]">Find Your Service</span>

      <div className="flex flex-wrap gap-3 mt-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`font-semibold text-[13px] h-9 px-4 rounded-[20px] cursor-pointer transition-all duration-150 border whitespace-nowrap ${
              active === tab
                ? 'bg-[#1B2D4F] text-white border-[#1B2D4F]'
                : 'bg-white text-[#1C1C1A] border-[#E4E2DC] hover:bg-[#F5F5F3]'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  )
}
