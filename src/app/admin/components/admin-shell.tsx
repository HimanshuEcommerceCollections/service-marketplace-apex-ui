"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import { NAV } from "../lib/permissions";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const items = NAV.filter((n) => user && n.roles.includes(user.role));
  const active = [...items].sort((a, b) => b.href.length - a.href.length).find((n) => pathname === n.href || pathname.startsWith(n.href + "/"));

  return (
    <div className="admin">
      <div className="ax-shell">
        <aside className="ax-side">
          <div className="ax-brand">
            Apex <span>Admin</span>
          </div>
          <nav className="ax-nav">
            {items.map((n) => (
              <Link key={n.href} href={n.href} className={active?.href === n.href ? "active" : ""}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ax-side-foot">
            <div className="ax-who">
              <b>{user?.name}</b>
              <small>{user?.email}</small>
              <div style={{ marginTop: 6 }}>
                <span className="ax-badge muted">{user?.role}</span>
              </div>
            </div>
            <button className="ax-btn ghost sm" onClick={() => void logout()} style={{ marginTop: 8 }}>
              Sign out
            </button>
          </div>
        </aside>
        <main className="ax-main">
          <div className="ax-top">
            <h1>{active?.label ?? "Dashboard"}</h1>
          </div>
          <div className="ax-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
