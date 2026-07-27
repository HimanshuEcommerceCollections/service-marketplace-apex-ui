"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  const [serviceCount, setServiceCount] = useState<number | null>(null);
  const [staffCount, setStaffCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const svcs = await api<unknown[]>("/services");
        setServiceCount(svcs.length);
      } catch {
        /* ignore */
      }
      if (user?.role === "ADMIN") {
        try {
          const staff = await api<unknown[]>("/admin/users");
          setStaffCount(staff.length);
        } catch {
          /* ignore */
        }
      }
    })();
  }, [user]);

  return (
    <>
      <h2 className="ax-section-title">Welcome, {user?.name}</h2>
      <div className="ax-grid">
        <div className="ax-card">
          <h3>Services</h3>
          <div className="ax-stat">{serviceCount ?? "—"}</div>
          <p>In the live catalog</p>
          <p>
            <Link href="/admin/services">Browse catalog →</Link>
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <div className="ax-card">
            <h3>Staff</h3>
            <div className="ax-stat">{staffCount ?? "—"}</div>
            <p>Coordinators &amp; admins</p>
            <p>
              <Link href="/admin/staff">Manage staff →</Link>
            </p>
          </div>
        )}
        <div className="ax-card">
          <h3>Your role</h3>
          <div className="ax-stat" style={{ fontSize: 20 }}>
            {user?.role}
          </div>
          <p>{user?.role === "ADMIN" ? "Full access" : "Operations access"}</p>
        </div>
      </div>
    </>
  );
}
