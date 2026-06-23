interface PriceSummaryCardProps {
  estimatedPrice: number;
  onContinue: () => void;
}

export default function PriceSummaryCard({ estimatedPrice, onContinue }: PriceSummaryCardProps) {
  return (
    <div className="flex flex-col gap-2 p-7 bg-[#1B2D4F] rounded-[10px] w-full">
      <div className="apex-badge-green w-fit">PRICED</div>

      <div className="pt-1">
        <p
          className="font-bold text-[28px] leading-[36px] text-[#C07820]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          ${estimatedPrice}{' '}
          <span className="text-sm font-normal text-[#CCD6E0] ml-1">DRAFT</span>
        </p>
      </div>

      <p className="text-[13px] leading-[20px] text-[#CCD6E0]">
        Based on selected home size and cleaning type. Final price confirmed by a coordinator before service.
      </p>

      <div className="pt-3">
        <button
          onClick={onContinue}
          className="inline-flex items-center justify-center px-6 h-12 bg-[#C07820] text-white font-semibold text-sm rounded-[6px] hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
