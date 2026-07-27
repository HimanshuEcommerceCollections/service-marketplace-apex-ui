"use client";

import { useCallback, useEffect, useState } from "react";
import { api, apiWithMeta, ApiError, type PageMeta } from "../../lib/api";
import { Pager } from "../../components/pager";

interface AreaView {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  deletedAt: string | null;
}

export default function AreasPage() {
  const [rows, setRows] = useState<AreaView[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [search, setSearch] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const load = useCallback(async () => {
    setErr(null);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search.trim()) params.set("search", search.trim());
    if (includeDeleted) params.set("includeDeleted", "true");
    try {
      const { data, meta } = await apiWithMeta<AreaView[]>(`/admin/areas?${params}`);
      setRows(data);
      setMeta(meta ?? null);
    } catch (e) {
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
              await api("/admin/areas", { method: "POST", body: { name: newName.trim() } });
              setNewName("");
            });
          }}
        >
          <input className="ax-input" style={{ maxWidth: 300 }} placeholder="Area name (e.g. Dallas)" value={newName} onChange={(e) => setNewName(e.target.value)} />
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
          <input type="checkbox" checked={includeDeleted} onChange={(e) => setIncludeDeleted(e.target.checked)} />
          Show deleted
        </label>
      </div>

      <table className="ax-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id}>
              <td>
                {editId === a.id ? (
                  <input className="ax-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                ) : (
                  a.name
                )}
              </td>
              <td className="ax-muted">{a.slug}</td>
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
                    <button className="ax-btn ghost sm" onClick={() => void run(() => api(`/admin/areas/${a.id}/restore`, { method: "POST" }))}>Restore</button>
                  ) : editId === a.id ? (
                    <>
                      <button className="ax-btn sm" onClick={() => void run(async () => { await api(`/admin/areas/${a.id}`, { method: "PATCH", body: { name: editName.trim() } }); setEditId(null); })}>Save</button>
                      <button className="ax-btn ghost sm" onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="ax-btn ghost sm" onClick={() => { setEditId(a.id); setEditName(a.name); }}>Rename</button>
                      <button className="ax-btn ghost sm" onClick={() => void run(() => api(`/admin/areas/${a.id}`, { method: "PATCH", body: { status: a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } }))}>
                        {a.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>
                      <button className="ax-btn danger sm" onClick={() => void run(() => api(`/admin/areas/${a.id}`, { method: "DELETE" }))}>Delete</button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={4} className="ax-muted">No areas found.</td></tr>
          )}
        </tbody>
      </table>

      <Pager meta={meta} page={page} setPage={setPage} />
    </>
  );
}
