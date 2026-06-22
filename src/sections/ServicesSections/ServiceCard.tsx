import { Service } from '../../data/ServicesData/services'

interface Props {
  service: Service
}

const badgeStyles: Record<string, string> = {
  green: 'bg-[#E0F4E5] text-[#2E7D5B]',
  amber: 'bg-[#FEF8EE] text-[#C07820]',
  gray:  'bg-[#EDECE8] text-[#8A8680]',
}

export default function ServiceCard({ service }: Props) {
  return (
    <div className="bg-white border border-[#E4E2DC] rounded-[10px] shadow-[0px_4px_16px_rgba(0,0,0,0.08),0px_1px_3px_rgba(0,0,0,0.06)] p-5 flex flex-col cursor-pointer transition-shadow hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)]">
      <div className="w-12 h-12 bg-[#FEF8EE] rounded-lg flex items-center justify-center font-semibold text-lg text-[#C07820] shrink-0"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {service.letter}
      </div>

      <div className="flex flex-col flex-1 mt-4">
        <h3 className="font-bold text-[18px] leading-[23px] text-[#1C1C1A]"
          style={{ fontFamily: 'Lora, serif' }}>
          {service.name}
        </h3>
        <p className="text-[13px] leading-[155%] text-[#4A4844] mt-2 flex-1"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          {service.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className={`${badgeStyles[service.badgeType]} rounded-[12px] px-[10px] py-[5px] font-semibold text-[11px] leading-[13px]`}
            style={{ fontFamily: 'Inter, sans-serif' }}>
            {service.price}
          </span>
          <span className="text-[#C07820] text-base">→</span>
        </div>
      </div>
    </div>
  )
}
