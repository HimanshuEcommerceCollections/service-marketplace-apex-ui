import ServicesHero      from '../../components/ServicesComponents/ServicesHero'
import ServiceTabs       from '../../components/ServicesComponents/ServiceTabs'
import ServicesGrid      from '../../components/ServicesComponents/ServicesGrid'
import PricingStates     from '../../components/ServicesComponents/PricingStates'
import HowItWorksSection from '../../components/ServicesComponents/HowItWorksSection'
import TrustSection      from '../../components/ServicesComponents/TrustSection'
import ServicesCTA       from '../../components/ServicesComponents/ServicesCTA'

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceTabs />
      <ServicesGrid />
      <PricingStates />
      <HowItWorksSection />
      <TrustSection />
      <ServicesCTA />
    </>
  )
}
