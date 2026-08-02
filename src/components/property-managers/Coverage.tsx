// section: SERVICE COVERAGE — decorative Wake County map (roads + coverage
// ellipse + pulsing pins) beside four coverage cards. The map is illustrative
// only; the live per-city coverage list lives on the home page, driven by the
// areas API.
import { coverageHead, coveragePins, coverageAreas } from '../../data/property-managers/content';
import SecHead from './SecHead';
import { Icon } from './icons';

export default function Coverage() {
  return (
    <section className="sec sec-mist" id="coverage">
      <SecHead
        eyebrow={coverageHead.eyebrow}
        title={coverageHead.title}
        lede={coverageHead.lede}
      />
      <div className="swrap">
        <div className="coverage">
          <div
            className="cov-map reveal"
            role="img"
            aria-label="Illustrated Wake County service map"
          >
            <div className="grid-bg" aria-hidden="true" />
            <svg className="roads" viewBox="0 0 600 440" aria-hidden="true" preserveAspectRatio="none">
              <path
                d="M60 380 C 160 300, 220 320, 300 240 S 480 120, 560 70"
                fill="none"
                stroke="rgba(31,93,122,.18)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M40 140 C 150 180, 260 160, 340 220 S 500 330, 570 360"
                fill="none"
                stroke="rgba(31,93,122,.14)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M300 30 C 290 130, 310 250, 290 410"
                fill="none"
                stroke="rgba(31,93,122,.12)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <ellipse
                cx="300"
                cy="220"
                rx="235"
                ry="180"
                fill="none"
                stroke="rgba(27,83,110,.22)"
                strokeWidth="2"
                strokeDasharray="7 8"
              />
            </svg>
            {coveragePins.map((p) => (
              <div
                className={`pin${p.hq ? ' hq' : ''}`}
                style={{ left: p.left, top: p.top }}
                key={p.name}
              >
                <span className="p-dot" />
                <span className="p-lab">{p.name}</span>
              </div>
            ))}
          </div>

          <div className="cov-list">
            {coverageAreas.map((a) => (
              <div className="cov-item reveal" key={a.title}>
                <span className="m-ic">
                  <Icon name={a.icon} />
                </span>
                <div>
                  <h4>{a.title}</h4>
                  <p>{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
