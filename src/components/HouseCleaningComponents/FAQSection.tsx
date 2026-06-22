import FAQItem from '../../sections/HouseCleaningSections/FAQItem';
import { faqData } from '../../data/HouseCleaningData/faqData';

export default function FAQSection() {
  return (
    <section className="w-full py-14 px-5 bg-[#F5F5F3]">
      <div className="w-full md:max-w-[728px] lg:max-w-[820px] mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <p className="apex-overline mb-2">Quick Answers</p>
          <h2
            className="font-bold text-[28px] leading-[32px] text-[#1C1C1A]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Questions, answered.
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqData.map((item, index) => (
            <FAQItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              defaultOpen={index === 0}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
