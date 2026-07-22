// section: BRIDGE / showcase opener. The poster (originally an inline base64
// JPEG) is externalized to /assets/images/bridge-poster.jpg with video-5 layered
// on top. Parallax + reveals are driven by the runtime (#bridgeImg, [data-bridge]).

export default function Bridge() {
  return (
    <section className="bridge" id="bridge">
      <div
        className="bridge-img"
        id="bridgeImg"
        style={{ backgroundImage: "url('/assets/images/bridge-poster.jpg')" }}
      >
        <video className="bridge-vid" autoPlay muted loop playsInline preload="auto">
          <source src="/assets/videos/video-5.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="bridge-scrim" />
      <div className="bridge-inner">
        <div className="chapter-k" data-bridge>
          Featured services
        </div>
        <h2 data-bridge>
          See the work,
          <br />
          before you <em>book</em> it.
        </h2>
        <p className="bsub" data-bridge>
          Five signature services, shot on location with the Apex team. Scroll the lineup.
        </p>
      </div>
    </section>
  );
}
