import type { Metadata } from 'next';
import HeroSection from '../../../components/PestControlComponents/HeroSection';
import PestSelectorSection from '../../../components/PestControlComponents/PestSelectorSection';
import ProtectionPlansSection from '../../../components/PestControlComponents/ProtectionPlansSection';
import HowItWorksSection from '../../../components/PestControlComponents/HowItWorksSection';
import BuiltAroundSection from '../../../components/PestControlComponents/BuiltAroundSection';
import TestimonialsSection from '../../../components/PestControlComponents/TestimonialsSection';
import FAQSection from '../../../components/PestControlComponents/FAQSection';
import CTABannerSection from '../../../components/PestControlComponents/CTABannerSection';

export const metadata: Metadata = {
  title: 'Pest Control — Apex',
  description:
    'Pest control in Wake County. Describe your situation, get a clear next step from an Apex coordinator.',
};

export default function PestControlPage() {
  return (
    <>
      <HeroSection />
      <PestSelectorSection />
      <ProtectionPlansSection />
      <HowItWorksSection />
      <BuiltAroundSection />
      <TestimonialsSection />
      <FAQSection />
      <CTABannerSection />
    </>
  );
}
