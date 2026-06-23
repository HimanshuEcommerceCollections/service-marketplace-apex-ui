import PricingTextBlock from '../../sections/LawnCareSections/PricingTextBlock';
import PricingHighlightCard from '../../sections/LawnCareSections/PricingHighlightCard';
import { pricingTextBlock, pricingHighlightCard } from '../../data/LawnCareData/pricingData';

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-16 lg:py-24 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <PricingTextBlock
            eyebrow={pricingTextBlock.eyebrow}
            heading={pricingTextBlock.heading}
            body={pricingTextBlock.body}
          />
          <PricingHighlightCard
            fromLabel={pricingHighlightCard.fromLabel}
            price={pricingHighlightCard.price}
            disclaimer={pricingHighlightCard.disclaimer}
          />
        </div>
      </div>
    </section>
  );
}
