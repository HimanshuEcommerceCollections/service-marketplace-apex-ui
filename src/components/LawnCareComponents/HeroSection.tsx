import HeroContent from '../../sections/LawnCareSections/HeroContent';
import HeroImagePlaceholder from '../../sections/LawnCareSections/HeroImagePlaceholder';
import { heroData } from '../../data/LawnCareData/heroData';

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <HeroContent
            eyebrow={heroData.eyebrow}
            headlinePart1={heroData.headlinePart1}
            headlineUnderlined={heroData.headlineUnderlined}
            subline={heroData.subline}
            primaryCTA={heroData.primaryCTA}
            secondaryCTA={heroData.secondaryCTA}
          />
          <HeroImagePlaceholder />
        </div>
      </div>
    </section>
  );
}
