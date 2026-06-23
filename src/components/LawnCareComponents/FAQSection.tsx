import FAQItem from '../../sections/LawnCareSections/FAQItem';
import { faqs } from '../../data/LawnCareData/faqData';

export default function FAQSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-white">
      <div className="w-full max-w-[900px] mx-auto px-5 md:px-10 lg:px-0">
        <p className="apex-overline mb-[14px]">FAQ</p>
        <h2
          className="font-bold text-[28px] leading-[34px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[55px] text-[#1C1C1A]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Questions, answered.
        </h2>

        <div className="mt-8 flex flex-col">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
