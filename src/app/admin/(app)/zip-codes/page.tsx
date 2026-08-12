"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";
import { ConfirmModal, type ConfirmRequest } from "../../components/modal";

interface AreaOption {
  id: string;
  name: string;
}
interface ZipView {
  id: string;
  areaId: string;
  area: { id: string; name: string } | null;
  zipCode: string;
  city: string | null;
  state: string | null;
  status: "ACTIVE" | "INACTIVE";
  deletedAt: string | null;
}

export default function ZipCodesPage() {
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [rows, setRows] = useState<ZipView[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [areaId, setAreaId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  // create form
  const [nArea, setNArea] = useState("");
  const [nZip, setNZip] = useState("");
  const [nCity, setNCity] = useState("");
  const [nState, setNState] = useState("");
  // Incremented per load; a slower earlier request bails on resolve so it can't
  // overwrite the results of a newer one (per-keystroke search race).
  const loadRef = useRef(0);

  useEffect(() => {
    api<AreaOption[]>("/admin/areas?status=ACTIVE&limit=100")
      .then(setAreas)
      .catch(() => setAreas([]));
  }, []);

  const load = useCallback(async () => {
    const epoch = ++loadRef.current;
    const params = new URLSearchParams({ page: String(page), limit: "25" });
    if (areaId) params.set("areaId", areaId);
    if (search.trim()) params.set("search", search.trim());
    try {
      const { data, meta } = await apiWithMeta<ZipView[]>(`/admin/zip-codes?${params}`);
      if (loadRef.current !== epoch) return;
      setErr(null);
      setRows(data);
      setMeta(meta ?? null);
    } catch (e) {
      if (loadRef.current !== epoch) return;
      setErr(e instanceof ApiError ? e.message : "Failed to load ZIP codes");
    }
  }, [page, areaId, search]);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(fn: () => Promise<unknown>) {
    setErr(null);
    try {
      await fn();
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Action failed");
    }
  }

  function askToggle(z: ZipView) {
    const next = z.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setConfirm({
      title: `${next === "INACTIVE" ? "Deactivate" : "Activate"} ZIP ${z.zipCode}`,
      body: (
        <>
          Set ZIP <b>{z.zipCode}</b> ({z.city ?? "no city"}, {z.area?.name ?? "no area"}) to <b>{next}</b>?{" "}
          {next === "INACTIVE"
            ? "Customers in this ZIP can no longer book covered services."
            : "This ZIP becomes bookable wherever its area is covered."}
        </>
      ),
      confirmLabel: next === "INACTIVE" ? "Deactivate" : "Activate",
      action: async () => {
        await api(`/admin/zip-codes/${z.id}`, { method: "PATCH", body: { status: next } });
        await load();
      },
    });
  }

  function askDelete(z: ZipView) {
    setConfirm({
      title: `Delete ZIP ${z.zipCode}`,
      danger: true,
      body: (
        <>
          Delete ZIP <b>{z.zipCode}</b> ({z.city ?? "no city"}, {z.area?.name ?? "no area"})? It is removed from its
          area and stops being bookable immediately.
        </>
      ),
      confirmLabel: `Delete ${z.zipCode}`,
      action: async () => {
        await api(`/admin/zip-codes/${z.id}`, { method: "DELETE" });
        await load();
      },
    });
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}

      <div className="ax-card" style={{ marginBottom: 18 }}>
        <h3>Add ZIP code</h3>
        <form
          className="ax-row"
          style={{ marginTop: 10, alignItems: "flex-end" }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!nArea || !/^\d{5}$/.test(nZip)) {
              setErr("Choose an area and enter a 5-digit ZIP.");
              return;
            }
            void run(async () => {
              await api("/admin/zip-codes", {
                method: "POST",
                body: { areaId: nArea, zipCode: nZip, city: nCity || undefined, state: nState || undefined },
              });
              setNZip("");
              setNCity("");
              setNState("");
            });
          }}
        >
          <div className="ax-field" style={{ marginBottom: 0, minWidth: 180 }}>
            <label>Area</label>
            <select className="ax-select" value={nArea} onChange={(e) => setNArea(e.target.value)}>
              <option value="">— choose —</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="ax-field" style={{ marginBottom: 0, width: 110 }}>
            <label>ZIP</label>
            <input className="ax-input" value={nZip} onChange={(e) => setNZip(e.target.value)} placeholder="75001" />
          </div>
          <div className="ax-field" style={{ marginBottom: 0, width: 150 }}>
            <label>City</label>
            <input className="ax-input" value={nCity} onChange={(e) => setNCity(e.target.value)} />
          </div>
          <div className="ax-field" style={{ marginBottom: 0, width: 70 }}>
            <label>State</label>
            <input className="ax-input" value={nState} onChange={(e) => setNState(e.target.value)} placeholder="TX" maxLength={2} />
          </div>
          <button className="ax-btn">Add</button>
        </form>
      </div>

      <div className="ax-row" style={{ marginBottom: 12 }}>
        <select className="ax-select" style={{ maxWidth: 220 }} value={areaId} onChange={(e) => { setPage(1); setAreaId(e.target.value); }}>
          <option value="">All areas</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <input className="ax-input" style={{ maxWidth: 220 }} placeholder="Search ZIP or city…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
      </div>

      <table className="ax-table">
        <thead>
          <tr>
            <th>ZIP</th>
            <th>Area</th>
            <th>City</th>
            <th>State</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((z) => (
            <tr key={z.id}>
              <td>{z.zipCode}</td>
              <td className="ax-muted">{z.area?.name ?? "—"}</td>
              <td>{z.city ?? "—"}</td>
              <td>{z.state ?? "—"}</td>
              <td>
                <span className={`ax-badge ${z.status === "ACTIVE" ? "ok" : "muted"}`}>{z.status}</span>
              </td>
              <td>
                <div className="ax-row" style={{ gap: 6 }}>
                  <button className="ax-btn ghost sm" onClick={() => askToggle(z)}>
                    {z.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                  <button className="ax-btn danger sm" onClick={() => askDelete(z)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={6} className="ax-muted">No ZIP codes found.</td></tr>
          )}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />

      <ConfirmModal req={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
