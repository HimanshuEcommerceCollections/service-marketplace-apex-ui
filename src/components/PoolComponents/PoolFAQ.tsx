import FAQItem from '../../sections/PoolSections/FAQItem';
import { faqItems } from '../../data/PoolData/poolData';

export default function PoolFAQ() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-16 bg-[#F5F5F3]">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">

        <div className="max-w-[720px] mx-auto">
          <h2
            className="font-bold text-[28px] md:text-[36px] text-[#1C1C1A] mb-8 text-center"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Questions, answered.
          </h2>

          <div>
            {faqItems.map((item) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
