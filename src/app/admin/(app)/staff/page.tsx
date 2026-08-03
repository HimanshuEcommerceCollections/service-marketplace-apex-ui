"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../../lib/api";

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

  async function setStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
    setErr(null);
    setNotice(null);
    try {
      await api<StaffUser>(`/admin/users/${id}`, { method: "PATCH", body: { status } });
      setNotice(status === "SUSPENDED" ? "Account suspended — their sessions were signed out." : "Account reactivated.");
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Update failed");
    }
  }

  /** Pending invites only: deletes the account so the emailed link stops working. */
  async function revokeInvite(u: StaffUser) {
    if (!window.confirm(`Revoke the invite for ${u.email}? Their invite link stops working immediately and the account is removed.`)) {
      return;
    }
    setErr(null);
    setNotice(null);
    try {
      await api(`/admin/users/${u.id}`, { method: "DELETE" });
      setNotice(`Invite for ${u.email} revoked.`);
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not revoke the invite");
    }
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
                  {u.status === "SUSPENDED" ? (
                    <button className="ax-btn ghost sm" onClick={() => void setStatus(u.id, "ACTIVE")}>
                      Reactivate
                    </button>
                  ) : u.status === "ACTIVE" ? (
                    <button className="ax-btn danger sm" onClick={() => void setStatus(u.id, "SUSPENDED")}>
                      Suspend
                    </button>
                  ) : (
                    <button className="ax-btn danger sm" onClick={() => void revokeInvite(u)}>
                      Revoke invite
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
