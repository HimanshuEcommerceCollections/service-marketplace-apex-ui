"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";
import { ConfirmModal, type ConfirmRequest } from "../../components/modal";
import { TableSkeleton } from "../../components/skeleton";

interface AreaView {
  id: string;
  name: string;
  slug: string;
  duration: string | null;
  status: "ACTIVE" | "INACTIVE";
  deletedAt: string | null;
}

export default function AreasPage() {
  // null = first load in flight (skeleton); [] = genuinely empty.
  const [rows, setRows] = useState<AreaView[] | null>(null);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [search, setSearch] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  // Incremented per load; a slower earlier request bails on resolve so it can't
  // overwrite the results of a newer one (per-keystroke search race).
  const loadRef = useRef(0);

  const load = useCallback(async () => {
    const epoch = ++loadRef.current;
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search.trim()) params.set("search", search.trim());
    if (includeDeleted) params.set("includeDeleted", "true");
    try {
      const { data, meta } = await apiWithMeta<AreaView[]>(`/admin/areas?${params}`);
      if (loadRef.current !== epoch) return;
      setErr(null);
      setRows(data);
      setMeta(meta ?? null);
    } catch (e) {
      if (loadRef.current !== epoch) return;
      setErr(e instanceof ApiError ? e.message : "Failed to load areas");
    }
  }, [page, search, includeDeleted]);

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

  function askToggle(a: AreaView) {
    const next = a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setConfirm({
      title: `${next === "INACTIVE" ? "Deactivate" : "Activate"} ${a.name}`,
      body: (
        <>
          Set area <b>{a.name}</b> to <b>{next}</b>?{" "}
          {next === "INACTIVE"
            ? "Its ZIPs stop being bookable through the area grant."
            : "Its ZIPs become bookable again wherever this area is covered."}
        </>
      ),
      confirmLabel: next === "INACTIVE" ? "Deactivate" : "Activate",
      action: async () => {
        await api(`/admin/areas/${a.id}`, { method: "PATCH", body: { status: next } });
        await load();
      },
    });
  }

  function askDelete(a: AreaView) {
    setConfirm({
      title: `Delete ${a.name}`,
      danger: true,
      body: (
        <>
          Delete area <b>{a.name}</b>? Its ZIP codes and coverage stop applying immediately. Deleted areas can be
          restored from this list with “Show deleted”.
        </>
      ),
      confirmLabel: `Delete ${a.name}`,
      action: async () => {
        await api(`/admin/areas/${a.id}`, { method: "DELETE" });
        await load();
      },
    });
  }

  function askRestore(a: AreaView) {
    setConfirm({
      title: `Restore ${a.name}`,
      body: (
        <>
          Restore area <b>{a.name}</b>? It returns to the active list and its grants apply again.
        </>
      ),
      confirmLabel: "Restore",
      action: async () => {
        await api(`/admin/areas/${a.id}/restore`, { method: "POST" });
        await load();
      },
    });
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}

      <div className="ax-card" style={{ marginBottom: 18 }}>
        <h3>Add area</h3>
        <form
          className="ax-row"
          style={{ marginTop: 10 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!newName.trim()) return;
            void run(async () => {
              await api("/admin/areas", {
                method: "POST",
                body: { name: newName.trim(), duration: newDuration.trim() || undefined },
              });
              setNewName("");
              setNewDuration("");
            });
          }}
        >
          <input className="ax-input" style={{ maxWidth: 260 }} placeholder="Area name (e.g. Dallas)" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input className="ax-input" style={{ maxWidth: 160 }} placeholder="Response time (e.g. 15 MIN)" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
          <button className="ax-btn">Add area</button>
        </form>
      </div>

      <div className="ax-row" style={{ marginBottom: 12 }}>
        <input
          className="ax-input"
          style={{ maxWidth: 260 }}
          placeholder="Search areas…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <label className="ax-row" style={{ gap: 6 }}>
          <input type="checkbox" checked={includeDeleted} onChange={(e) => { setPage(1); setIncludeDeleted(e.target.checked); }} />
          Show deleted
        </label>
      </div>

      <div className="ax-table-wrap">
      <table className="ax-table">
        <thead>
          <tr>
            <th>Name</th>
            <th className="ax-hide-md">Slug</th>
            <th className="ax-hide-md">Response time</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows === null && !err && <TableSkeleton cols={5} />}
          {(rows ?? []).map((a) => (
            <tr key={a.id}>
              <td>
                {editId === a.id ? (
                  <input className="ax-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                ) : (
                  a.name
                )}
              </td>
              <td className="ax-muted ax-hide-md">{a.slug}</td>
              <td className="ax-hide-md">
                {editId === a.id ? (
                  <input className="ax-input" style={{ maxWidth: 140 }} placeholder="e.g. 15 MIN" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} />
                ) : (
                  a.duration ?? <span className="ax-muted">—</span>
                )}
              </td>
              <td>
                {a.deletedAt ? (
                  <span className="ax-badge danger">DELETED</span>
                ) : (
                  <span className={`ax-badge ${a.status === "ACTIVE" ? "ok" : "muted"}`}>{a.status}</span>
                )}
              </td>
              <td>
                <div className="ax-row" style={{ gap: 6 }}>
                  {a.deletedAt ? (
                    <button className="ax-btn ghost sm" onClick={() => askRestore(a)}>Restore</button>
                  ) : editId === a.id ? (
                    <>
                      <button className="ax-btn sm" onClick={() => void run(async () => { await api(`/admin/areas/${a.id}`, { method: "PATCH", body: { name: editName.trim(), duration: editDuration.trim() } }); setEditId(null); })}>Save</button>
                      <button className="ax-btn ghost sm" onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="ax-btn ghost sm" onClick={() => { setEditId(a.id); setEditName(a.name); setEditDuration(a.duration ?? ""); }}>Edit</button>
                      <button className="ax-btn ghost sm" onClick={() => askToggle(a)}>
                        {a.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                      <button className="ax-btn danger sm" onClick={() => askDelete(a)}>Delete</button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {rows !== null && rows.length === 0 && (
            <tr><td colSpan={5} className="ax-muted">No areas found.</td></tr>
          )}
        </tbody>
      </table>
      </div>

      <Pager meta={meta} page={page} setPage={setPage} />

      <ConfirmModal req={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
