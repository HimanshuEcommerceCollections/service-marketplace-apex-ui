// section: HERO — rotating background videos, particle canvas, ambient/sweep/bloom
// layers and the animated headline. All motion is wired up by the runtime; the
// element ids/classes below match its querySelectors exactly.
import { Arrow } from './icons';

export default function Hero() {
  return (
    <section className="hero-pin" id="hero">
      <div className="hero-media" id="heroMedia">
        <div className="hero-vids" id="heroVids">
          <video className="hv on" autoPlay muted loop playsInline preload="auto">
            <source src="/assets/videos/video-1.mp4" type="video/mp4" />
          </video>
          <video className="hv" autoPlay muted loop playsInline preload="none">
            <source src="/assets/videos/video-2.mp4" type="video/mp4" />
          </video>
          <video className="hv" autoPlay muted loop playsInline preload="none">
            <source src="/assets/videos/video-3.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="hero-house" id="heroHouse">
        <div className="hero-house-glow" />
        <video autoPlay muted loop playsInline preload="auto">
          <source src="/assets/videos/video-4.webm" type="video/webm" />
        </video>
      </div>
      <div className="hero-ambient" id="ambient" />
      <div className="hero-scrim" />
      <div className="hero-sweep" id="sweep" />
      <div className="hero-bloom" id="bloom" />
      <canvas id="particles" />
      <div className="hero-content" id="heroContent">
        <div className="eyebrow" data-h>
          Premium Home Services
        </div>
        <div className="hero-inner hero">
          <h1>
            <span className="ln">
              <span data-line>One Call.</span>
            </span>
            <span className="ln">
              <span data-line>Every Home Service.</span>
            </span>
            <span className="ln">
              <span data-line className="accent">
                Professionally Delivered.
              </span>
            </span>
          </h1>
          <p className="lede" data-h>
            From cleaning and lawn care to smart home automation, security, painting, pool
            maintenance, and handyman services, Apex delivers every essential home service through
            one trusted team.
          </p>
          <div className="hero-actions" data-h>
            <a className="btn btn-primary magnetic" href="#book">
              <span className="btn-inner">
                Book a Service <Arrow />
              </span>
            </a>
            <a className="btn btn-ghost magnetic" href="#showcase">
              <span className="btn-inner">Explore All Services</span>
            </a>
          </div>
        </div>
      </div>
      <div className="scroll-cue" id="cue">
        <div className="mouse" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
