import ProtectionPlanCard from '../../sections/PestControlSections/ProtectionPlanCard';
import { protectionPlans } from '../../data/PestControlData/protectionPlansData';

export default function ProtectionPlansSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-24 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0">
        <div className="max-w-[600px] mb-10">
          <span className="apex-overline">Why Apex</span>
          <h2
            className="font-bold text-[28px] leading-[34px] md:text-[40px] md:leading-[48px] text-[#1C1C1A] mt-2"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Pest control that starts with clarity.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {protectionPlans.map((plan) => (
            <ProtectionPlanCard
              key={plan.title}
              icon={plan.icon}
              title={plan.title}
              body={plan.body}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
