export default function PriceOutputCard() {
  return (
    <div className="bg-[#1B2D4F] rounded-[10px] p-7 flex flex-col gap-3">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#C07820] text-white text-[10px] font-bold tracking-[0.9px] uppercase w-fit">
        FROM
      </span>
      <p
        className="text-[#C07820] font-bold text-[22px] leading-[28px]"
        style={{ fontFamily: "'Lora', serif" }}
      >
        Custom review required
      </p>
      <span className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[#8A9AAD]">DRAFT</span>
      <p className="text-[#B8C4D0] text-sm leading-[21px]">
        Pricing depends on treatment needs and property details. A coordinator confirms next steps.
      </p>
      <a
        href="mailto:ansh@ecommercecollections.com"
        className="inline-flex items-center justify-center mt-2 px-5 h-[44px] bg-[#C07820] text-white font-semibold text-sm rounded-[6px] hover:bg-[#A8681A] transition-colors no-underline w-full"
      >
        Request Review
      </a>
    </div>
  );
}
