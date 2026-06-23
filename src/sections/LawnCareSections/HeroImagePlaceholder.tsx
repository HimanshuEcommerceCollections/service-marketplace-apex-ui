export default function HeroImagePlaceholder() {
  return (
    <div className="w-full h-[300px] md:h-[380px] lg:h-[420px] bg-[#EDECE8] border border-[#E4E2DC] shadow-[0px_8px_32px_rgba(0,0,0,0.14)] rounded-[10px] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 opacity-50 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="30" height="30" rx="2" stroke="#8A8580" strokeWidth="2" />
          <circle cx="14" cy="14" r="3" stroke="#8A8580" strokeWidth="2" />
          <path d="M5 27l10-8 8 6 5-4 7 7" stroke="#8A8580" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-[13px] text-[#8A8580]">Image: Raleigh residential yard</p>
    </div>
  );
}
