"use client";

// Skeleton loading primitives. A list page holds `rows: T[] | null` — null
// renders a skeleton (first load in flight), [] renders the real empty state.
// That split is what kills the "No results found" flash during initial fetch.

/** One shimmer bar. Width/height are plain CSS values. */
export function Skel({ w = "100%", h = 14, style }: { w?: number | string; h?: number; style?: React.CSSProperties }) {
  return <span className="ax-skel" style={{ width: w, height: h, ...style }} aria-hidden />;
}

/** Deterministic pseudo-random widths so cells look organic but SSR-stable. */
const WIDTHS = ["70%", "45%", "85%", "55%", "65%", "40%", "75%", "50%"];

/**
 * Placeholder table body for a loading list. Drop inside <tbody> in place of
 * the data rows; `cols` must match the real column count so nothing jumps
 * when data lands.
 */
export function TableSkeleton({ cols, rows = 6 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} aria-hidden>
          {Array.from({ length: cols }, (_, c) => (
            <td key={c}>
              <Skel w={WIDTHS[(r * cols + c) % WIDTHS.length]} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** A card-shaped block (catalog/coverage editors while a service loads). */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="ax-card" style={{ marginTop: 12 }} aria-hidden>
      <Skel w="30%" h={16} style={{ marginBottom: 12 }} />
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} style={{ marginTop: 8 }}>
          <Skel w={WIDTHS[i % WIDTHS.length]} />
        </div>
      ))}
    </div>
  );
}
