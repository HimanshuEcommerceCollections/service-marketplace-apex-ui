// section: CONFIGURATOR — the #cfgFields (controls) and #cfgOut (live price)
// containers are populated by the runtime's configurator engine for the
// active service (cleaning).

export default function Configurator() {
  return (
    <section className="sec cfg" id="configure">
      <div className="sec-head reveal">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          Instant estimate
        </span>
        <h2>Configure &amp; see your price.</h2>
        <p>Adjust the options and watch your price update live. Your choices carry into booking.</p>
      </div>
      <div className="wrap">
        <div className="cfg-panel reveal" id="cfgFields" />
        <div className="cfg-out reveal" id="cfgOut" />
      </div>
    </section>
  );
}
