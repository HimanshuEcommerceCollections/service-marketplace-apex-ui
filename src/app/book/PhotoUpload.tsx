"use client";

// The booking wizard's photo step, for services whose quote a coordinator can't
// price sight-unseen (photosMin/photosMax on the service).
//
// Upload-on-pick, NOT upload-on-submit: a File object cannot be serialized into
// the persisted wizard store, so a guest who picks photos and then signs in at
// step 5 would lose them across the redirect. Uploading immediately means only
// the server-issued {id, url} has to survive, which JSON handles fine. The
// bytes go straight from the browser to the storage provider using signed
// parameters from the API — they never pass through our server.

import { useRef, useState } from "react";
import { api, API_BASE, ApiError } from "../lib/api-client";
import { useBookingStore, type UploadedPhoto } from "./booking-store";
import { Check, Info } from "./icons";

interface SignedUpload {
  attachment_id: string;
  upload_url: string;
  fields: Record<string, string>;
  public_url: string;
}

/** Thumbnail via Cloudinary's URL transform; other providers load as-is. */
function thumb(url: string): string {
  return url.includes("/image/upload/")
    ? url.replace("/image/upload/", "/image/upload/c_fill,w_200,h_200,q_auto,f_auto/")
    : url;
}

export default function PhotoUpload({
  slug,
  min,
  max,
}: {
  slug: string;
  min: number;
  max: number;
}) {
  const photos = useBookingStore((s) => s.photos);
  const addPhoto = useBookingStore((s) => s.addPhoto);
  const removePhoto = useBookingStore((s) => s.removePhoto);

  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  const limit = max > 0 ? max : Infinity;
  const remaining = limit - photos.length - busy;

  async function uploadOne(file: File): Promise<UploadedPhoto> {
    // 1. Ask our API to sign an upload (it records a PENDING attachment row).
    const signed = await api<SignedUpload>("/uploads/sign", {
      method: "POST",
      body: { service_type: slug, mime_type: file.type, bytes: file.size },
    });

    // 2. POST the bytes straight to the provider. Not api(): this is a
    //    cross-origin multipart upload to storage, not a call to our JSON API.
    const form = new FormData();
    for (const [k, v] of Object.entries(signed.fields)) form.append(k, v);
    form.append("file", file);
    const res = await fetch(signed.upload_url, { method: "POST", body: form });
    if (!res.ok) throw new Error("upload rejected by storage");

    // 3. Confirm, so the row leaves PENDING and can be claimed at submit.
    //    Checked, not fire-and-forget: an unconfirmed row is rejected at submit,
    //    which would surface as a confusing failure five steps later.
    const ack = await fetch(`${API_BASE}/uploads/${signed.attachment_id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bytes: file.size }),
    });
    if (!ack.ok) throw new Error("upload could not be confirmed");

    return { id: signed.attachment_id, url: signed.public_url };
  }

  async function onPick(files: FileList | null) {
    if (!files?.length) return;
    const picked = Array.from(files).slice(0, Math.max(0, remaining));
    if (picked.length === 0) {
      setErr(`You can attach at most ${max} photo${max === 1 ? "" : "s"}.`);
      return;
    }
    setErr(null);
    setBusy((n) => n + picked.length);
    // Each file settles independently: one rejected image doesn't discard the rest.
    await Promise.all(
      picked.map(async (f) => {
        try {
          addPhoto(await uploadOne(f));
        } catch (e) {
          setErr(
            e instanceof ApiError ? e.message : `Couldn't upload ${f.name}. Please try a different image.`,
          );
        } finally {
          setBusy((n) => n - 1);
        }
      }),
    );
    // Let the same file be re-picked after a failure.
    if (inputRef.current) inputRef.current.value = "";
  }

  const needed = Math.max(0, min - photos.length);

  return (
    <div className="fld">
      <label>
        Photos of the job{min > 0 ? " *" : ""}
      </label>
      <p style={{ marginTop: -4, marginBottom: 10, fontSize: 13, color: "var(--slate4)" }}>
        {min > 0
          ? `Add at least ${min} photo${min === 1 ? "" : "s"} so your coordinator can price the work accurately.`
          : "Optional — photos help your coordinator quote more accurately."}
        {max > 0 ? ` Up to ${max}.` : ""}
      </p>

      {photos.length > 0 && (
        <div className="ph-grid">
          {photos.map((p) => (
            <div className="ph" key={p.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb(p.url)} alt="Photo of the job you uploaded" />
              <button type="button" aria-label="Remove photo" onClick={() => removePhoto(p.id)}>
                ×
              </button>
            </div>
          ))}
          {busy > 0 &&
            Array.from({ length: busy }).map((_, i) => <div className="ph skel" key={`up-${i}`} />)}
        </div>
      )}

      {busy > 0 && photos.length === 0 && (
        <div className="ph-grid">
          {Array.from({ length: busy }).map((_, i) => (
            <div className="ph skel" key={`up-${i}`} />
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple={limit !== 1}
        hidden
        onChange={(e) => void onPick(e.target.files)}
      />
      <button
        type="button"
        className="btn btn-line ripple"
        disabled={remaining <= 0}
        onClick={() => inputRef.current?.click()}
      >
        {photos.length === 0 ? "Add photos" : "Add more"}
      </button>

      {err && (
        <div className="quote-note" style={{ marginTop: 12 }} role="alert">
          <Info />
          <p>{err}</p>
        </div>
      )}
      {needed > 0 && !err && (
        <p style={{ marginTop: 10, fontSize: 13, color: "var(--slate4)" }}>
          {needed} more photo{needed === 1 ? "" : "s"} needed.
        </p>
      )}
      {min > 0 && needed === 0 && (
        <p style={{ marginTop: 10, fontSize: 13, color: "var(--bblue)", display: "flex", gap: 6, alignItems: "center" }}>
          <Check /> Photo requirement met.
        </p>
      )}
    </div>
  );
}
