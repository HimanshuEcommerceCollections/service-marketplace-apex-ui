interface Props {
  frequencies: string[];
  selected: string;
  onSelect: (freq: string) => void;
}

export default function FrequencyToggle({ frequencies, selected, onSelect }: Props) {
  return (
    <div>
      <p className="font-semibold text-[13px] text-[#1C1C1A] mb-3">Service frequency</p>
      <div className="bg-[#F5F5F2] border border-[#E4E2DC] rounded-[8px] p-1 flex gap-1 w-full">
        {frequencies.map((freq) => (
          <button
            key={freq}
            onClick={() => onSelect(freq)}
            className={`flex-1 py-2 px-2 text-center font-semibold text-sm rounded-[6px] transition-colors ${
              selected === freq
                ? 'bg-[#1B2D4F] text-white'
                : 'bg-white text-[#1C1C1A] hover:bg-[#EDECE8]'
            }`}
          >
            {freq}
          </button>
        ))}
      </div>
    </div>
  );
}
