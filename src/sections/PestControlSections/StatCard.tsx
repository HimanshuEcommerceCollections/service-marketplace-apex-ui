interface Props {
  stat: string;
  label: string;
  body: string;
}

export default function StatCard({ stat, label, body }: Props) {
  return (
    <div className="bg-[#254E70] rounded-[12px] p-6 flex flex-col gap-3">
      <p
        className="font-bold text-[28px] leading-[34px] text-[#C07820]"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {stat}
      </p>
      <p className="font-semibold text-[15px] text-white">{label}</p>
      <p className="text-[14px] leading-[21px] text-[#B8C4D0]">{body}</p>
    </div>
  );
}
