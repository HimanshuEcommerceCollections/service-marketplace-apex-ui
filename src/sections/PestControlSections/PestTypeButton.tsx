interface Props {
  label: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

function BugIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6V3M10 14v3M6 10H3M14 10h3M7.05 7.05 5 5M12.95 12.95 15 15M12.95 7.05 15 5M7.05 12.95 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function PestTypeButton({ label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-[8px] border text-left font-medium text-sm transition-colors ${
        selected
          ? 'border-[#C07820] bg-[#FFF8EE] text-[#1C1C1A]'
          : 'border-[#E4E2DC] bg-white text-[#4B4A47] hover:border-[#C07820] hover:bg-[#FFF8EE]'
      }`}
    >
      <span className={selected ? 'text-[#C07820]' : 'text-[#8A8580]'}>
        <BugIcon />
      </span>
      {label}
    </button>
  );
}
