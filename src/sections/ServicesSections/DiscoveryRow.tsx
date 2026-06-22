interface Props {
  letter: string
  name: string
  price: string
}

export default function DiscoveryRow({ letter, name, price }: Props) {
  return (
    <div className="flex items-center bg-[#F5F5F3] rounded-[6px] h-[38px] px-[10px] mt-2">
      <span className="w-6 h-6 bg-[#FEF8EE] rounded-[4px] flex items-center justify-center font-semibold text-[11px] text-[#C07820] shrink-0"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {letter}
      </span>
      <span className="font-medium text-[13px] text-[#1C1C1A] ml-2 flex-1"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {name}
      </span>
      <span className="font-semibold text-[11px] text-[#C07820]"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {price}
      </span>
    </div>
  )
}
