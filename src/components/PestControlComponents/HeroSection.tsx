import HeroContent from '../../sections/PestControlSections/HeroContent';
import HeroImagePlaceholder from '../../sections/PestControlSections/HeroImagePlaceholder';
import { heroData } from '../../data/PestControlData/heroData';

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <HeroContent
            eyebrow={heroData.eyebrow}
            headlineLine1={heroData.headlineLine1}
            headlineUnderlined={heroData.headlineUnderlined}
            headlineLine3={heroData.headlineLine3}
            subline={heroData.subline}
            primaryCTA={heroData.primaryCTA}
            secondaryCTA={heroData.secondaryCTA}
          />
          <div className="w-full lg:flex-1 flex justify-center lg:justify-end">
            <HeroImagePlaceholder />
          </div>
        </div>
      </div>
    </section>
  );
}
