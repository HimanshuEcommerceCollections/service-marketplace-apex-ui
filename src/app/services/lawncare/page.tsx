import HeroSection         from '../../../components/LawnCareComponents/HeroSection';
import PricingCalcSection  from '../../../components/LawnCareComponents/PricingCalcSection';
import TrustSection        from '../../../components/LawnCareComponents/TrustSection';
import HowItWorksSection   from '../../../components/LawnCareComponents/HowItWorksSection';
import PricingSection      from '../../../components/LawnCareComponents/PricingSection';
import TestimonialsSection from '../../../components/LawnCareComponents/TestimonialsSection';
import FAQSection          from '../../../components/LawnCareComponents/FAQSection';
import CTABannerSection    from '../../../components/LawnCareComponents/CTABannerSection';

export const metadata = {
  title: 'Lawn Care – Apex Total Home Services',
  description: 'Professional lawn care with transparent pricing. Choose your property size, see your starting price, and book with coordinator confirmation. Serving Raleigh, NC.',
};

export default function LawnCarePage() {
  return (
    <>
      <HeroSection />
      <PricingCalcSection />
      <TrustSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTABannerSection />
    </>
  );
}
