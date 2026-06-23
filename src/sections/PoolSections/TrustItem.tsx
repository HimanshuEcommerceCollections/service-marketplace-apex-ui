interface Props {
  heading: string;
  body: string;
}

export default function TrustItem({ heading, body }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <p
        className="font-bold text-[22px] text-[#1C1C1A]"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {heading}
      </p>
      <p className="text-[14px] leading-[22px] text-[#4A4840]">{body}</p>
    </div>
  );
}
