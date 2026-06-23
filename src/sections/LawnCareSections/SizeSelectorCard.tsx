interface YardSizeOption {
  id: string;
  label: string;
  sublabel: string;
  basePrice: number;
}

interface Props {
  yardSizes: YardSizeOption[];
  selectedSize: string | null;
  onSelect: (id: string) => void;
}

export default function SizeSelectorCard({ yardSizes, selectedSize, onSelect }: Props) {
  return (
    <div>
      <p className="font-semibold text-[13px] text-[#1C1C1A] mb-3">Service size</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {yardSizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSelect(size.id)}
            className={`flex items-center gap-[14px] p-4 rounded-[8px] text-left w-full transition-all ${
              selectedSize === size.id
                ? 'bg-[#FEF8EE] border-2 border-[#C07820]'
                : 'bg-white border border-[#E4E2DC] hover:border-[#C07820]'
            }`}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-[#FEF8EE] rounded-lg flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18c0-4 3.5-7 9-7s9 3 9 7" />
                <line x1="3" y1="21" x2="21" y2="21" />
                <path d="M12 11V7" />
                <path d="M9 9l3-2 3 2" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[15px] leading-[19px] text-[#1C1C1A]">{size.label}</p>
              <p className="text-[13px] leading-[17px] text-[#8A8580] mt-0.5">{size.sublabel}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
