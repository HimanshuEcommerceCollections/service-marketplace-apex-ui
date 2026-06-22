import HouseCleaningHero   from '../../../components/HouseCleaningComponents/HouseCleaningHero';
import PriceConfigurator   from '../../../components/HouseCleaningComponents/PriceConfigurator';
import WhyApexSection      from '../../../components/HouseCleaningComponents/WhyApexSection';
import HowItWorksSection   from '../../../components/HouseCleaningComponents/HowItWorksSection';
import TestimonialsSection from '../../../components/HouseCleaningComponents/TestimonialsSection';
import FAQSection          from '../../../components/HouseCleaningComponents/FAQSection';
import HouseCleaningCTA    from '../../../components/HouseCleaningComponents/HouseCleaningCTA';

export const metadata = {
  title: 'House Cleaning – Apex Total Home Services',
  description: 'Professional home cleaning with transparent pricing. Configure your service, see your estimated price, and book with coordinator confirmation. Serving Raleigh, NC.',
};

export default function HouseCleaningPage() {
  return (
    <>
      <HouseCleaningHero />
      <PriceConfigurator />
      <WhyApexSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <HouseCleaningCTA />
    </>
  );
}
