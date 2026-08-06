// section: MEMBERSHIP BENEFITS — the perks every plan includes. Perk stagger keys off
// .perks-card.in (added by the reveal observer).
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const perks = [
  { title: 'Locked-in pricing', body: 'Your rate never changes for as long as you stay a member.' },
  { title: 'Free re-service', body: 'Not happy? We return within 24 hours at no charge.' },
  { title: 'No contracts', body: 'Month-to-month freedom. Pause or cancel anytime.' },
  { title: 'Priority slots', body: 'First pick of appointment windows, even in peak season.' },
  { title: 'Dedicated coordinator', body: 'One point of contact who knows your home.' },
  { title: 'Member add-on rates', body: 'Discounted pricing on one-off extras and seasonal jobs.' },
];

export default function Benefits() {
  return (
    <section className="sec">
      <div className="swrap">
        <div className="sec-head reveal">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Membership benefits
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '-.03em',
              fontSize: 'clamp(28px,3.6vw,44px)',
              color: 'var(--ink2)',
              marginTop: 12,
            }}
          >
            Every plan includes the good stuff.
          </h2>
        </div>
        <div className="perks-card reveal">
          <div className="perks">
            {perks.map((p) => (
              <div className="perk" key={p.title}>
                <span className="pd">
                  <Check />
                </span>
                <div>
                  <b>{p.title}</b>
                  <span>{p.body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
