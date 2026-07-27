"use client";

import type { PageMeta } from "../lib/api";

export function Pager({
  meta,
  page,
  setPage,
}: {
  meta: PageMeta | null;
  page: number;
  setPage: (n: number) => void;
}) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="ax-row" style={{ marginTop: 14, justifyContent: "space-between" }}>
      <span className="ax-muted">
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </span>
      <div className="ax-row">
        <button className="ax-btn ghost sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <button
          className="ax-btn ghost sm"
          disabled={page >= meta.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
