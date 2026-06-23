interface Props {
  displayPrice: string;
  hasSelection: boolean;
}

export default function PriceOutputCard({ displayPrice, hasSelection }: Props) {
  return (
    <div className="bg-[#1B2D4F] rounded-[10px] p-7 flex flex-col gap-2">
      <span className="self-start bg-[#FEF8EE] rounded-full px-3 py-0.5 inline-flex items-center">
        <span className="font-semibold text-[11px] tracking-[1px] uppercase text-[#C07820]">From</span>
      </span>

      <p
        className="font-bold text-[28px] leading-[35px] text-[#C07820] mt-1"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {displayPrice}
      </p>

      <p className="text-[13px] leading-[19px] text-[#CCD6E0]">
        {hasSelection
          ? 'Starting price based on property size. Final price confirmed by a coordinator before service.'
          : 'Select a yard size to see your estimated starting price.'}
      </p>

      <button className="mt-3 w-full inline-flex items-center justify-center h-12 bg-[#C07820] text-white font-semibold text-sm rounded-[6px] hover:bg-[#a86a1a] transition-colors">
        Continue
      </button>
    </div>
  );
}
