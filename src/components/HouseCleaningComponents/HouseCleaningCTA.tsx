export default function HouseCleaningCTA() {
  return (
    <section className="w-full bg-[#1B2D4F] py-14 px-5">
      <div className="flex flex-col items-center text-center gap-5 max-w-[640px] mx-auto">

        <h2
          className="font-bold text-[28px] leading-[32px] text-white"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Ready for a cleaner home?
        </h2>

        <p className="text-[17px] leading-[27px] text-[#CCD6E0]">
          Choose your cleaning options and see your estimated price.
        </p>

        <a
          href="#configurator"
          className="inline-flex items-center justify-center px-6 h-[52px] w-[200px] bg-[#C07820] text-white font-semibold text-sm rounded-[6px] hover:opacity-90 transition-opacity"
        >
          Book Now
        </a>

      </div>
    </section>
  );
}
