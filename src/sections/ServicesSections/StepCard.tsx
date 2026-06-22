import { Step } from '../../data/ServicesData/howItWorksSteps'

interface Props {
  step: Step
}

export default function StepCard({ step }: Props) {
  return (
    <div className="bg-white border border-[#E4E2DC] rounded-[10px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] p-6 flex flex-col md:flex-row md:items-start md:gap-4">
      <div className="w-[52px] h-[52px] bg-[#FEF8EE] rounded-full flex items-center justify-center font-bold text-[16px] text-[#C07820] shrink-0"
        style={{ fontFamily: 'Lora, serif' }}>
        {step.number}
      </div>

      <div className="flex flex-col mt-4 md:mt-0">
        <h3 className="font-bold text-[20px] leading-[26px] text-[#1C1C1A]"
          style={{ fontFamily: 'Lora, serif' }}>
          {step.title}
        </h3>
        <p className="text-[14px] leading-[160%] text-[#4A4844] mt-2"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          {step.description}
        </p>
      </div>
    </div>
  )
}
