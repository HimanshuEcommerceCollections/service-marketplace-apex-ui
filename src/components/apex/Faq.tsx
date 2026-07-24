// section: FAQ. The accordion list (#faqList) is built and toggled by the runtime.

export default function Faq() {
  return (
    <section id="faq">
      <div className="faq-wrap">
        <div className="faq-head">
          <span className="faq-pill fv">FAQ</span>
          <h2 className="fv">Common questions.</h2>
          <p className="faq-sub fv">
            Can&apos;t find your answer? <a href="/book">Chat with us</a>
          </p>
        </div>
        <div className="faq-list" id="faqList" />
      </div>
    </section>
  );
}
