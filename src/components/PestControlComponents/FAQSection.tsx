import FAQItem from '../../sections/PestControlSections/FAQItem';
import { faqs } from '../../data/PestControlData/faqData';

export default function FAQSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-white">
      <div className="w-full max-w-[820px] mx-auto px-5 md:px-10 lg:px-0">
        <div className="text-center mb-10">
          <span className="apex-overline">FAQ</span>
          <h2
            className="font-bold text-[28px] leading-[34px] md:text-[40px] md:leading-[48px] text-[#1C1C1A] mt-2"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Common questions.
          </h2>
        </div>
        <div className="divide-y divide-[#E4E2DC]">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.q}
              q={faq.q}
              a={faq.a}
              defaultOpen={faq.defaultOpen}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
