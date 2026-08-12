"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";
import { ConfirmModal, type ConfirmRequest } from "../../components/modal";

type StaffRole = "COORDINATOR" | "ADMIN";
type StaffStatus = "INVITED" | "ACTIVE" | "SUSPENDED";

interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  emailVerified: boolean;
}

const statusBadge: Record<StaffStatus, string> = {
  ACTIVE: "ok",
  INVITED: "warn",
  SUSPENDED: "danger",
};

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffUser[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  // invite form
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffRole>("COORDINATOR");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setStaff(await api<StaffUser[]>("/admin/users"));
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) setForbidden(true);
      else setErr(e instanceof ApiError ? e.message : "Failed to load staff");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function invite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setNotice(null);
    setBusy(true);
    try {
      await api<StaffUser>("/admin/users", {
        method: "POST",
        body: { email: email.trim(), name: name.trim(), role },
      });
      setNotice(`Invitation sent to ${email.trim()}.`);
      setEmail("");
      setName("");
      setRole("COORDINATOR");
      await load();
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Invite failed");
    } finally {
      setBusy(false);
    }
  }

  function askSetStatus(u: StaffUser, status: "ACTIVE" | "SUSPENDED") {
    const suspending = status === "SUSPENDED";
    setConfirm({
      title: suspending ? `Suspend ${u.name}` : `Reactivate ${u.name}`,
      danger: suspending,
      body: suspending ? (
        <>
          Suspend <b>{u.name}</b> ({u.email})? They are signed out everywhere immediately and can&apos;t sign back in
          until reactivated.
        </>
      ) : (
        <>
          Reactivate <b>{u.name}</b> ({u.email})? They can sign in again with their existing password.
        </>
      ),
      confirmLabel: suspending ? "Suspend" : "Reactivate",
      action: async () => {
        await api<StaffUser>(`/admin/users/${u.id}`, { method: "PATCH", body: { status } });
        setNotice(suspending ? "Account suspended — their sessions were signed out." : "Account reactivated.");
        await load();
      },
    });
  }

  /**
   * Soft delete. The account keeps its row (bookings and assignments reference
   * it) but can no longer sign in, hold a session, or redeem an outstanding
   * invite link, and it drops off this list.
   */
  function askRemove(u: StaffUser) {
    const pending = u.status === "INVITED";
    setConfirm({
      title: pending ? `Revoke invite — ${u.email}` : `Delete ${u.name}`,
      danger: true,
      body: pending ? (
        <>
          Revoke the invite for <b>{u.email}</b>? Their invite link stops working immediately.
        </>
      ) : (
        <>
          Delete <b>{u.name}</b> ({u.email})? They are signed out everywhere and can no longer sign in. Their booking
          and assignment history is kept.
        </>
      ),
      confirmLabel: pending ? "Revoke invite" : `Delete ${u.name}`,
      action: async () => {
        await api(`/admin/users/${u.id}`, { method: "DELETE" });
        setNotice(pending ? `Invite for ${u.email} revoked.` : `${u.email} deleted.`);
        await load();
      },
    });
  }

  if (forbidden) {
    return <div className="ax-card"><h3>Admins only</h3><p className="ax-muted">Staff management requires the admin role.</p></div>;
  }

  return (
    <>
      {err && <div className="ax-alert err">{err}</div>}
      {notice && <div className="ax-alert ok">{notice}</div>}

      <div className="ax-card" style={{ marginBottom: 20 }}>
        <h3>Invite a staff member</h3>
        <p className="ax-muted" style={{ marginTop: 4, marginBottom: 14 }}>
          They receive an email invite and set their own password to activate.
        </p>
        <form onSubmit={invite}>
          <div className="ax-row" style={{ gap: 14, alignItems: "flex-end" }}>
            <div className="ax-field" style={{ flex: "1 1 200px", marginBottom: 0 }}>
              <label>Name</label>
              <input className="ax-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="ax-field" style={{ flex: "1 1 220px", marginBottom: 0 }}>
              <label>Email</label>
              <input className="ax-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="ax-field" style={{ flex: "0 0 160px", marginBottom: 0 }}>
              <label>Role</label>
              <select className="ax-select" value={role} onChange={(e) => setRole(e.target.value as StaffRole)}>
                <option value="COORDINATOR">Coordinator</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button className="ax-btn" disabled={busy}>{busy ? "Sending…" : "Send invite"}</button>
          </div>
        </form>
      </div>

      {staff === null ? (
        <p className="ax-muted">Loading staff…</p>
      ) : (
        <table className="ax-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {staff.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td className="ax-muted">{u.email}</td>
                <td>
                  <span className="ax-badge muted">{u.role}</span>
                </td>
                <td>
                  <span className={`ax-badge ${statusBadge[u.status]}`}>{u.status}</span>
                </td>
                <td>
                  <div className="ax-row" style={{ gap: 8, justifyContent: "flex-end" }}>
                    {u.status === "SUSPENDED" && (
                      <button className="ax-btn ghost sm" onClick={() => askSetStatus(u, "ACTIVE")}>
                        Reactivate
                      </button>
                    )}
                    {u.status === "ACTIVE" && (
                      <button className="ax-btn ghost sm" onClick={() => askSetStatus(u, "SUSPENDED")}>
                        Suspend
                      </button>
                    )}
                    <button className="ax-btn danger sm" onClick={() => askRemove(u)}>
                      {u.status === "INVITED" ? "Revoke invite" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmModal req={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}
