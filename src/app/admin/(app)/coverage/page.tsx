"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";

interface ServiceOption { id: string; name: string; slug: string }
interface AreaOption { id: string; name: string }
interface ZipRow { id: string; zipCode: string; city: string | null }
type Effect = "INCLUDE" | "EXCLUDE";
type ZipChoice = "DEFAULT" | Effect;

interface Coverage {
  grantedAreaIds: string[];
  overrides: { zipCodeId: string; effect: Effect }[];
}

export default function CoveragePage() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [serviceSlug, setServiceSlug] = useState("");
  const [granted, setGranted] = useState<Set<string>>(new Set());
  const [overrides, setOverrides] = useState<Record<string, Effect>>({});
  const [zipsByArea, setZipsByArea] = useState<Record<string, ZipRow[]>>({});
  const [openArea, setOpenArea] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<ServiceOption[]>("/services").then(setServices).catch(() => setServices([]));
    api<AreaOption[]>("/admin/areas?status=ACTIVE&limit=100").then(setAreas).catch(() => setAreas([]));
  }, []);

  async function loadCoverage(slug: string) {
    setErr(null);
    setNotice(null);
    setServiceSlug(slug);
    setOpenArea({});
    if (!slug) return;
    try {
      const c = await api<Coverage>(`/admin/coverage/${slug}`);
      setGranted(new Set(c.grantedAreaIds));
      setOverrides(Object.fromEntries(c.overrides.map((o) => [o.zipCodeId, o.effect])));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed to load coverage");
    }
  }

  async function toggleArea(areaId: string) {
    const next = new Set(granted);
    if (next.has(areaId)) next.delete(areaId);
    else next.add(areaId);
    setGranted(next);
  }

  async function expand(areaId: string) {
    setOpenArea((o) => ({ ...o, [areaId]: !o[areaId] }));
    if (!zipsByArea[areaId]) {
      try {
        const zips = await api<ZipRow[]>(`/admin/zip-codes?areaId=${areaId}&status=ACTIVE&limit=500`);
        setZipsByArea((m) => ({ ...m, [areaId]: zips }));
      } catch {
        setZipsByArea((m) => ({ ...m, [areaId]: [] }));
      }
    }
  }

  function setZipChoice(zipId: string, choice: ZipChoice) {
    setOverrides((o) => {
      const next = { ...o };
      if (choice === "DEFAULT") delete next[zipId];
      else next[zipId] = choice;
      return next;
    });
  }

  async function save() {
    if (!serviceSlug) return;
    setSaving(true);
    setErr(null);
    setNotice(null);
    try {
      await api(`/admin/coverage/${serviceSlug}`, {
        method: "PUT",
        body: {
          areaIds: [...granted],
          zipOverrides: Object.entries(overrides).map(([zipCodeId, effect]) => ({ zipCodeId, effect })),
        },
      });
      setNotice("Coverage saved.");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {notice && <div className="ax-alert ok">{notice}</div>}

      <div className="ax-field" style={{ maxWidth: 340 }}>
        <label>Service</label>
        <select className="ax-select" value={serviceSlug} onChange={(e) => void loadCoverage(e.target.value)}>
          <option value="">— choose a service —</option>
          {services.map((s) => (
            <option key={s.id} value={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>

      {serviceSlug && (
        <>
          <p className="ax-muted" style={{ margin: "6px 0 16px" }}>
            Check an area to cover its whole territory. Expand it to override individual ZIPs
            (<b>Include</b> adds a ZIP even without the area grant; <b>Exclude</b> carves one out).
          </p>

          {areas.map((a) => {
            const isGranted = granted.has(a.id);
            const zips = zipsByArea[a.id];
            return (
              <div className="ax-card" key={a.id} style={{ marginBottom: 12 }}>
                <div className="ax-row" style={{ justifyContent: "space-between" }}>
                  <label className="ax-row" style={{ gap: 8, fontWeight: 600 }}>
                    <input type="checkbox" checked={isGranted} onChange={() => void toggleArea(a.id)} />
                    {a.name}
                    {isGranted && <span className="ax-badge ok">whole area</span>}
                  </label>
                  <button className="ax-btn ghost sm" onClick={() => void expand(a.id)}>
                    {openArea[a.id] ? "Hide ZIPs" : "ZIP overrides"}
                  </button>
                </div>

                {openArea[a.id] && (
                  <div style={{ marginTop: 12 }}>
                    {!zips ? (
                      <p className="ax-muted">Loading ZIPs…</p>
                    ) : zips.length === 0 ? (
                      <p className="ax-muted">No active ZIPs in this area.</p>
                    ) : (
                      <table className="ax-table">
                        <thead>
                          <tr><th>ZIP</th><th>City</th><th>Coverage</th></tr>
                        </thead>
                        <tbody>
                          {zips.map((z) => {
                            const choice: ZipChoice = overrides[z.id] ?? "DEFAULT";
                            return (
                              <tr key={z.id}>
                                <td>{z.zipCode}</td>
                                <td className="ax-muted">{z.city ?? "—"}</td>
                                <td>
                                  <select className="ax-select" style={{ maxWidth: 200 }} value={choice} onChange={(e) => setZipChoice(z.id, e.target.value as ZipChoice)}>
                                    <option value="DEFAULT">Default ({isGranted ? "covered" : "not covered"})</option>
                                    <option value="INCLUDE">Include</option>
                                    <option value="EXCLUDE">Exclude</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button className="ax-btn" onClick={() => void save()} disabled={saving} style={{ marginTop: 8 }}>
            {saving ? "Saving…" : "Save coverage"}
          </button>
        </>
      )}
    </>
  );
}
