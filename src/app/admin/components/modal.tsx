"use client";

// Shared modal primitives for the admin dashboard. Three layers:
//   <Modal>        — base overlay + panel (Esc / overlay-click close, focus trap)
//   <ConfirmModal> — confirm-before-write dialog; owns the busy state and keeps
//                    itself open showing the error when the action rejects
//   <Lightbox>     — full-screen photo viewer with keyboard navigation
//
// Rendered in place (no portal): every admin page lives under `.admin`, which
// is what scopes the ax-* styles and design tokens; position:fixed still
// escapes the layout, so the overlay covers the whole viewport.

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ApiError } from "../lib/api";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  title,
  onClose,
  children,
  footer,
  width = 560,
}: {
  title: string;
  /** Called on Esc, overlay click, or the × button. Pass a no-op to hold the modal open (e.g. while busy). */
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus management: remember the opener, move focus into the panel
  // ([data-autofocus] wins, else the panel itself), restore on unmount.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const target = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
    target?.focus();
    return () => opener?.focus();
  }, []);

  // Scroll-lock the page behind the overlay.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      // Minimal focus trap: keep Tab cycling inside the panel.
      if (e.key === "Tab" && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  return (
    <div
      className="ax-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
      role="presentation"
    >
      <div
        className="ax-modal"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="ax-modal-head">
          <h3 className="ax-modal-title">{title}</h3>
          <button type="button" className="ax-modal-x" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="ax-modal-body">{children}</div>
        {footer && <div className="ax-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/**
 * One pending confirmation. Pages hold `useState<ConfirmRequest | null>` and
 * open the dialog by setting it; `action` must THROW on failure — that is what
 * keeps the dialog open with the error shown instead of silently closing.
 */
export interface ConfirmRequest {
  title: string;
  /** Always states what changes, on which record, from → to. */
  body: ReactNode;
  confirmLabel?: string;
  /** Destructive/irreversible: red confirm button, initial focus on Cancel. */
  danger?: boolean;
  action: () => Promise<void>;
}

export function ConfirmModal({ req, onClose }: { req: ConfirmRequest | null; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // A fresh request starts clean even if the previous one errored — adjust
  // during render (not in an effect) so the stale error never paints.
  const [lastReq, setLastReq] = useState(req);
  if (req !== lastReq) {
    setLastReq(req);
    setBusy(false);
    setErr(null);
  }

  if (!req) return null;

  async function confirm() {
    if (!req) return;
    setBusy(true);
    setErr(null);
    try {
      await req.action();
      onClose();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Action failed");
      setBusy(false);
    }
  }

  const close = busy ? () => {} : onClose;

  return (
    <Modal
      title={req.title}
      onClose={close}
      width={460}
      footer={
        <>
          <button
            type="button"
            className="ax-btn ghost"
            onClick={close}
            disabled={busy}
            {...(req.danger ? { "data-autofocus": true } : {})}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`ax-btn${req.danger ? " confirm-danger" : ""}`}
            onClick={() => void confirm()}
            disabled={busy}
            {...(req.danger ? {} : { "data-autofocus": true })}
          >
            {busy ? "Working…" : req.confirmLabel ?? "Confirm"}
          </button>
        </>
      }
    >
      <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{req.body}</div>
      {err && (
        <div className="ax-alert err" style={{ marginTop: 12, marginBottom: 0 }}>
          {err}
        </div>
      )}
    </Modal>
  );
}

/** Cloudinary delivery-URL thumbnail; other providers load at natural size. */
export function thumbUrl(url: string, size = 120): string {
  return url.includes("/image/upload/")
    ? url.replace("/image/upload/", `/image/upload/c_fill,w_${size},h_${size},q_auto,f_auto/`)
    : url;
}

/** A larger, non-cropping Cloudinary variant for the lightbox stage. */
function stageUrl(url: string): string {
  return url.includes("/image/upload/")
    ? url.replace("/image/upload/", "/image/upload/c_limit,w_1600,h_1200,q_auto,f_auto/")
    : url;
}

export function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: { id: string; url: string }[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const photo = photos[index];
  const prev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate],
  );
  const next = useCallback(() => onNavigate((index + 1) % photos.length), [index, photos.length, onNavigate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && photos.length > 1) prev();
      else if (e.key === "ArrowRight" && photos.length > 1) next();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, prev, next, photos.length]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!photo) return null;

  return (
    <div
      className="ax-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className="ax-lightbox-x" aria-label="Close" onClick={onClose}>
        ×
      </button>
      {photos.length > 1 && (
        <button type="button" className="ax-lightbox-nav prev" aria-label="Previous photo" onClick={prev}>
          ‹
        </button>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={stageUrl(photo.url)} alt={`Customer photo ${index + 1} of ${photos.length}`} />
      {photos.length > 1 && (
        <button type="button" className="ax-lightbox-nav next" aria-label="Next photo" onClick={next}>
          ›
        </button>
      )}
      <div className="ax-lightbox-bar">
        <span>
          {index + 1} / {photos.length}
        </span>
        <a href={photo.url} target="_blank" rel="noreferrer noopener">
          Open original ↗
        </a>
      </div>
    </div>
  );
}
