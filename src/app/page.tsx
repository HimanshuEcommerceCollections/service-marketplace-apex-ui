import HeroSection from '../sections/HomeSections/HeroSection';
import ZipGateSection from '../sections/HomeSections/ZipGateSection';
import ServicesSection from '../sections/HomeSections/ServicesSection';
import PricingSection from '../sections/HomeSections/PricingSection';
import HowItWorksSection from '../sections/HomeSections/HowItWorksSection';
import TrustSection from '../sections/HomeSections/TrustSection';
import TestimonialsSection from '../sections/HomeSections/TestimonialsSection';
import FaqSection from '../sections/HomeSections/FaqSection';
import FinalCtaSection from '../sections/HomeSections/FinalCtaSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ZipGateSection />
      <ServicesSection />
      <PricingSection />
      <HowItWorksSection />
      <TrustSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
