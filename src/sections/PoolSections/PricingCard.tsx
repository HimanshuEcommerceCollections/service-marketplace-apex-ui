function PoolIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round">
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M7 3v5M17 3v5" />
    </svg>
  );
}

interface Props {
  label: string;
  subLabel: string;
  selected: boolean;
  onClick: () => void;
}

export default function PricingCard({ label, subLabel, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3.5 p-4 rounded-[8px] border w-full text-left transition-colors ${
        selected
          ? 'border-2 border-[#C07820] bg-[#FEF8EE]'
          : 'border border-[#E4E2DC] bg-white hover:border-[#C07820] hover:bg-[#FEF8EE]'
      }`}
    >
      <div className="w-12 h-12 rounded-[8px] bg-[#FEF8EE] flex items-center justify-center shrink-0">
        <PoolIcon />
      </div>
      <div>
        <p className="font-semibold text-[15px] text-[#1C1C1A]">{label}</p>
        <p className="text-[13px] text-[#4A4840]">{subLabel}</p>
      </div>
    </button>
  );
}
