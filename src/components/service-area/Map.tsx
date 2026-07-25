/* eslint-disable @next/next/no-img-element */
// Decorative Wake-County "blob" map with clickable city pins. Rendered twice
// (hero + coverage), so the radial-gradient needs a unique id per instance.
// Pin clicks -> scroll to the matching city card (wired by the runtime via
// [data-city]). Pin positions come from the data layer.
import { cities } from '../../data/service-area/content';
import { PinMarker } from './icons';

export default function Map({
  variant,
  gradientId,
  hint = false,
}: {
  variant: 'hero-map' | 'big-map';
  gradientId: string;
  hint?: boolean;
}) {
  return (
    <div className={`map ${variant}`}>
      <div className="map-glow" />
      <svg className="map-blob" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="40%">
            <stop offset="0%" stopColor="rgba(111,180,214,.32)" />
            <stop offset="70%" stopColor="rgba(27,83,110,.18)" />
            <stop offset="100%" stopColor="rgba(27,83,110,.05)" />
          </radialGradient>
        </defs>
        <path
          d="M22 14 L74 10 Q84 11 82 22 L86 44 Q88 60 78 70 L70 88 Q66 94 56 92 L34 90 Q22 88 20 76 L14 50 Q12 30 22 14 Z"
          fill={`url(#${gradientId})`}
          stroke="rgba(27,83,110,.35)"
          strokeWidth="0.6"
          strokeDasharray="2 1.6"
        />
      </svg>
      {cities.map((c) => (
        <button
          key={c.slug}
          className="pin"
          data-city={c.slug}
          style={{ left: c.pin.left, top: c.pin.top }}
          aria-label={c.name}
        >
          <span className="ppulse" />
          <span className="pdot">
            <PinMarker />
          </span>
          <span className="ptip">{c.name}</span>
        </button>
      ))}
      {hint && <div className="map-hint">Hover a pin to see the area · tap to jump to that city</div>}
    </div>
  );
}
