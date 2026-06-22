import { TrustStat } from '../../data/ServicesData/trustStats'

interface Props {
  stat: TrustStat
}

export default function TrustCard({ stat }: Props) {
  return (
    <div className="bg-[#25375E] rounded-[10px] p-6">
      <p className="font-bold text-[32px] leading-[41px] text-[#C07820]"
        style={{ fontFamily: 'Lora, serif' }}>
        {stat.stat}
      </p>
      <p className="font-semibold text-[14px] leading-[17px] text-white mt-3"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {stat.label}
      </p>
      <p className="text-[13px] leading-[155%] text-[#A8B8CC] mt-1.5"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {stat.supporting}
      </p>
    </div>
  )
}
