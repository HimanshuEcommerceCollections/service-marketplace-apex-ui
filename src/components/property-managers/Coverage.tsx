// section: SERVICE COVERAGE — the coverage video beside four coverage cards.
//
// The video inherits the frame the illustrated Wake-County map used to fill
// (.cov-map keeps its rounded, bordered box beside the cards); the map's roads and
// pulsing pins are gone. Below the fold, so it preloads metadata only and the
// runtime plays it only while it is on screen — no point decoding a 15MB file
// nobody has scrolled to. The live per-city coverage list still lives on the home
// page, driven by the areas API.
import { coverageHead, coverageAreas } from '../../data/property-managers/content';
import { coverageVideo } from '../../data/property-managers/media';
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
          <div className="cov-map reveal">
            <video
              className="cov-vid"
              muted
              loop
              playsInline
              preload="metadata"
              poster={coverageVideo.poster}
              aria-hidden="true"
            >
              <source src={coverageVideo.src} type="video/mp4" />
            </video>
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
