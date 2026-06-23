import PestSelectorCard from '../../sections/PestControlSections/PestSelectorCard';
import { pestTypes } from '../../data/PestControlData/pestSelectorData';

export default function PestSelectorSection() {
  return (
    <section id="pest-selector" className="w-full py-12 md:py-16 lg:py-24 bg-[#F5F5F2]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <div className="max-w-[640px] mx-auto mb-8 text-center">
          <span className="apex-overline">Get Started</span>
          <h2
            className="font-bold text-[28px] leading-[34px] md:text-[36px] md:leading-[43px] text-[#1C1C1A] mt-2"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Tell us what you&apos;re dealing with.
          </h2>
        </div>
        <PestSelectorCard pestTypes={pestTypes} />
      </div>
    </section>
  );
}
