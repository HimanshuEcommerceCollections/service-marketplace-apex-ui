"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth-context";
import { NAV } from "../lib/permissions";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  // Below 820px the sidebar becomes this drawer, opened from the top bar.
  const [drawer, setDrawer] = useState(false);
  const items = NAV.filter((n) => user && n.roles.includes(user.role));
  const active = [...items].sort((a, b) => b.href.length - a.href.length).find((n) => pathname === n.href || pathname.startsWith(n.href + "/"));

  // Route change = navigation happened — the drawer's job is done. Adjusted
  // during render (not in an effect) so the closed state paints immediately.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setDrawer(false);
  }

  useEffect(() => {
    if (!drawer) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawer(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [drawer]);

  const navBlock = (
    <>
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
    </>
  );

  return (
    <div className="admin">
      <div className="ax-shell">
        <aside className="ax-side">{navBlock}</aside>
        <main className="ax-main">
          <div className="ax-top">
            <div className="ax-row" style={{ gap: 10, flexWrap: "nowrap" }}>
              <button
                type="button"
                className="ax-menu-btn"
                aria-label="Open navigation"
                aria-expanded={drawer}
                onClick={() => setDrawer(true)}
              >
                ☰
              </button>
              <h1>{active?.label ?? "Dashboard"}</h1>
            </div>
          </div>
          <div className="ax-content">{children}</div>
        </main>
      </div>

      {drawer && (
        <>
          <div className="ax-drawer-overlay" onClick={() => setDrawer(false)} aria-hidden />
          <aside className="ax-drawer" role="dialog" aria-modal="true" aria-label="Navigation">
            {navBlock}
          </aside>
        </>
      )}
    </div>
  );
}
