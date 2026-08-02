// section: SERVICE COVERAGE. The town list (#covList) is populated and the stat
// counters ([data-count]) animate via the runtime.
import { ArrowThin } from './icons';

export interface CoverageTown {
  name: string;
  time: string;
}

// Fallback shown only if the areas API is unreachable at build/revalidate; the
// server page normally supplies live towns derived from Service Areas.
const STATIC_TOWNS: CoverageTown[] = [
  { name: 'Cary', time: '15 MIN' },
  { name: 'Apex', time: '18 MIN' },
  { name: 'Morrisville', time: '20 MIN' },
  { name: 'Raleigh', time: '22 MIN' },
  { name: 'Holly Springs', time: '25 MIN' },
  { name: 'Garner', time: '28 MIN' },
  { name: 'Wake Forest', time: '30 MIN' },
  { name: 'Fuquay-Varina', time: '35 MIN' },
  { name: 'Knightdale', time: '38 MIN' },
];

export default function Coverage({
  towns = STATIC_TOWNS,
  townCount = 20,
}: {
  towns?: CoverageTown[];
  townCount?: number;
}) {
  return (
    <section id="coverage">
      <div className="cov-wrap">
        <div className="cov-grid">
          <div className="cov-left">
            <span className="cov-eyebrow cv">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>{' '}
              Service Coverage
            </span>
            <h2 className="cv">
              We Come
              <br />
              To You.
            </h2>
            <p className="cov-sub cv">
              Serving Wake County and the greater Raleigh area — Cary, Apex, Wake Forest and beyond,
              with new neighborhoods added regularly.
            </p>
            <div className="cov-cta cv">
              <a className="cov-btn magnetic" href="/book">
                Check My Address <ArrowThin />
              </a>
              <div className="cov-phone">
                <div className="lbl">Direct Access</div>
                <div className="num">{'(919) 555‑0100'}</div>
              </div>
            </div>
            <div className="cov-stats cv">
              <div className="cov-stat">
                <div className="n" data-count={townCount} data-suffix="+">
                  0
                </div>
                <div className="cap">Towns Served</div>
              </div>
              <div className="cov-stat">
                <div className="n">
                  <span data-count="60">0</span> <small>MIN</small>
                </div>
                <div className="cap">Avg. Response</div>
              </div>
            </div>
          </div>

          <div className="cov-mid cv">
            <div className="cov-list" id="covList">
              {towns.map((t) => (
                <div className="cov-row" key={t.name}>
                  <span className="t">{t.name}</span>
                  {t.time && <span className="m">{t.time}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="cov-map cv">
            <video autoPlay muted loop playsInline preload="auto">
              <source src="/assets/videos/video-6.mp4" type="video/mp4" />
            </video>
            <div className="cap">
              <small>Apex Total Home Services</small>Wake County
            </div>
          </div>
        </div>

        <div className="cov-pill cv">
          <span>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4h4a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2zm4 3V6h-4v1h4z" />
            </svg>
            {townCount}+ Towns
          </span>
          <span className="sep" />
          <span>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v2h3.4a1 1 0 0 1 .8.4L21 11.6a1 1 0 0 1 .2.6V16a1 1 0 0 1-1 1h-1a2.5 2.5 0 0 1-5 0H9a2.5 2.5 0 0 1-5 0H4a1 1 0 0 1-1-1V6zm11 4h4.2L16.9 8H14v2z" />
            </svg>
            Mobile Service
          </span>
        </div>
      </div>
    </section>
  );
}
