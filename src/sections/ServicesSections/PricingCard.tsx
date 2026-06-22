import { PricingState } from '../../data/ServicesData/pricingStates'

interface Props {
  card: PricingState
}

const accentStyles: Record<string, string> = {
  green: 'bg-[#2E7D5B]',
  amber: 'bg-[#C07820]',
  navy:  'bg-[#1B2D4F]',
}

const badgeStyles: Record<string, string> = {
  green: 'bg-[#E0F4E5] text-[#2E7D5B]',
  amber: 'bg-[#FEF8EE] text-[#C07820]',
  gray:  'bg-[#EDECE8] text-[#8A8680]',
}

export default function PricingCard({ card }: Props) {
  return (
    <div className="relative bg-white border border-[#E4E2DC] rounded-[10px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] pl-5 pr-4 pt-5 pb-5 overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[10px] ${accentStyles[card.accentColor]}`} />

      <span className={`${badgeStyles[card.badgeType]} rounded-[12px] px-[10px] py-[5px] font-semibold text-[11px]`}
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {card.badgeLabel}
      </span>

      <p className="font-bold text-[28px] leading-[36px] text-[#C07820] mt-3"
        style={{ fontFamily: 'Lora, serif' }}>
        {card.price}
      </p>

      <p className="text-[14px] leading-[160%] text-[#4A4844] mt-2"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {card.description}
      </p>
    </div>
  )
}
