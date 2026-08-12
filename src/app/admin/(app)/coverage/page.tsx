"use client";

import { useEffect, useRef, useState } from "react";
import { api, apiWithMeta, ApiError } from "../../lib/api";
import { ConfirmModal, type ConfirmRequest } from "../../components/modal";
import { CardSkeleton } from "../../components/skeleton";

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
  // The service the granted/overrides state currently belongs to. Stays "" while
  // a load is in flight or after it failed, which is what gates the editor and
  // guards Save from writing one service's coverage onto another.
  const [loadedSlug, setLoadedSlug] = useState("");
  const [zipsByArea, setZipsByArea] = useState<Record<string, ZipRow[]>>({});
  const [zipErr, setZipErr] = useState<Record<string, boolean>>({});
  const [openArea, setOpenArea] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  // Incremented per loadCoverage call so a slow response for a previously
  // selected service can't land on top of a newer selection.
  const loadRef = useRef(0);

  useEffect(() => {
    api<ServiceOption[]>("/services").then(setServices).catch(() => setServices([]));
    api<AreaOption[]>("/admin/areas?status=ACTIVE&limit=100").then(setAreas).catch(() => setAreas([]));
  }, []);

  async function loadCoverage(slug: string) {
    const epoch = ++loadRef.current;
    setErr(null);
    setNotice(null);
    setServiceSlug(slug);
    setOpenArea({});
    // Clear the editor for the newly selected service until its own coverage
    // loads; a failed/stale load therefore can't leave the previous service's
    // grants and overrides on screen and saveable.
    setGranted(new Set());
    setOverrides({});
    setLoadedSlug("");
    if (!slug) return;
    try {
      const c = await api<Coverage>(`/admin/coverage/${slug}`);
      if (loadRef.current !== epoch) return; // a newer selection superseded this one
      setGranted(new Set(c.grantedAreaIds));
      setOverrides(Object.fromEntries(c.overrides.map((o) => [o.zipCodeId, o.effect])));
      setLoadedSlug(slug);
    } catch (e) {
      if (loadRef.current !== epoch) return;
      setErr(e instanceof ApiError ? e.message : "Failed to load coverage");
    }
  }

  // The server caps the zip-code list at limit=200, so page through results
  // until every active ZIP for the area is collected (an area may have >200).
  async function fetchActiveZips(areaId: string): Promise<ZipRow[]> {
    const all: ZipRow[] = [];
    let page = 1;
    for (;;) {
      const { data, meta } = await apiWithMeta<ZipRow[]>(
        `/admin/zip-codes?areaId=${areaId}&status=ACTIVE&limit=200&page=${page}`,
      );
      all.push(...data);
      if (!meta || page >= meta.totalPages) break;
      page += 1;
    }
    return all;
  }

  async function toggleArea(areaId: string) {
    const next = new Set(granted);
    if (next.has(areaId)) next.delete(areaId);
    else next.add(areaId);
    setGranted(next);
  }

  async function expand(areaId: string) {
    const willOpen = !openArea[areaId];
    setOpenArea((o) => ({ ...o, [areaId]: !o[areaId] }));
    // Fetch on open only when not already loaded. A prior failure is recorded in
    // zipErr (not as an empty array in zipsByArea), so the entry stays unset and
    // reopening retries instead of caching [] forever.
    if (willOpen && zipsByArea[areaId] === undefined) {
      setZipErr((m) => ({ ...m, [areaId]: false }));
      try {
        const zips = await fetchActiveZips(areaId);
        setZipsByArea((m) => ({ ...m, [areaId]: zips }));
      } catch {
        setZipErr((m) => ({ ...m, [areaId]: true }));
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

  function askSave() {
    // Never PUT unless the state in hand belongs to the service currently
    // selected (guards against saving stale/other-service coverage).
    if (!serviceSlug || loadedSlug !== serviceSlug) return;
    const serviceName = services.find((s) => s.slug === serviceSlug)?.name ?? serviceSlug;
    const includes = Object.values(overrides).filter((e) => e === "INCLUDE").length;
    const excludes = Object.values(overrides).filter((e) => e === "EXCLUDE").length;
    setConfirm({
      title: `Save coverage — ${serviceName}`,
      body: (
        <>
          Save the coverage for <b>{serviceName}</b>: <b>{granted.size}</b> whole area(s), <b>{includes}</b> ZIP
          include(s), <b>{excludes}</b> ZIP exclude(s)? This replaces the previous coverage and changes which ZIPs can
          book this service immediately.
        </>
      ),
      confirmLabel: "Save coverage",
      action: async () => {
        await api(`/admin/coverage/${serviceSlug}`, {
          method: "PUT",
          body: {
            areaIds: [...granted],
            zipOverrides: Object.entries(overrides).map(([zipCodeId, effect]) => ({ zipCodeId, effect })),
          },
        });
        setNotice("Coverage saved.");
      },
    });
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

      {serviceSlug && loadedSlug !== serviceSlug && !err && (
        <>
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
        </>
      )}

      {serviceSlug && loadedSlug === serviceSlug && (
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
                    {zipErr[a.id] ? (
                      <p className="ax-muted">Couldn’t load ZIPs. Hide and reopen to retry.</p>
                    ) : !zips ? (
                      <p className="ax-muted">Loading ZIPs…</p>
                    ) : zips.length === 0 ? (
                      <p className="ax-muted">No active ZIPs in this area.</p>
                    ) : (
                      <div className="ax-table-wrap">
                      <table className="ax-table">
                        <thead>
                          <tr><th>ZIP</th><th className="ax-hide-md">City</th><th>Coverage</th></tr>
                        </thead>
                        <tbody>
                          {zips.map((z) => {
                            const choice: ZipChoice = overrides[z.id] ?? "DEFAULT";
                            return (
                              <tr key={z.id}>
                                <td>{z.zipCode}</td>
                                <td className="ax-muted ax-hide-md">{z.city ?? "—"}</td>
                                <td>
                                  <select className="ax-select" style={{ maxWidth: 200, minWidth: 150 }} value={choice} onChange={(e) => setZipChoice(z.id, e.target.value as ZipChoice)}>
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
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button className="ax-btn" onClick={askSave} style={{ marginTop: 8 }}>
            Save coverage
          </button>
        </>
      )}

      <ConfirmModal req={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
