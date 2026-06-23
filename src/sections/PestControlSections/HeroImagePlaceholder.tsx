export default function HeroImagePlaceholder() {
  return (
    <div className="w-full max-w-[540px] aspect-[4/3] rounded-[14px] bg-[#EDECE8] flex flex-col items-center justify-center gap-3 text-[#8A8580] border border-[#E4E2DC]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6" y="8" width="36" height="32" rx="4" fill="#C8C6C0" />
        <circle cx="17" cy="20" r="4" fill="#F5F5F2" />
        <path d="M6 32l10-8 8 6 8-10 10 12" stroke="#F5F5F2" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <p className="text-sm font-medium">Image: Raleigh home, pest prevention context</p>
      <p className="text-xs">[Sample] Home protection across Wake County</p>
    </div>
  );
}
