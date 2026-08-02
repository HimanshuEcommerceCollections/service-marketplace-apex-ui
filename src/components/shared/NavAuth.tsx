'use client';

// The navbar's auth control, rendered as the last item in .navlinks.
//
//   loading  → an inert placeholder. The session is resolved by a cookie refresh
//              after mount, so rendering "Sign in" here would flash the wrong
//              state at every already-signed-in visitor on every page load.
//   signed out → "Sign in" link to /login
//   signed in  → initials avatar opening a menu: My Bookings / Log out
//
// The Services dropdown next to it is hover/focus-driven from CSS; this one is
// click-driven (as specified) and so needs its own outside-click + Escape close.

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { initials, useCustomerAuth } from '../../app/lib/customer-auth';

export default function NavAuth({ onNavigate }: { onNavigate?: () => void }) {
  const { user, loading, logout } = useCustomerAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (loading) return <span className="nav-auth-idle" aria-hidden="true" />;

  if (!user) {
    return (
      <Link
        href="/login"
        className="nav-signin"
        onClick={() => {
          onNavigate?.();
        }}
      >
        Sign in
      </Link>
    );
  }

  const onLogout = async () => {
    if (busy) return;
    setBusy(true);
    await logout();
    setOpen(false);
    onNavigate?.();
    router.push('/');
    setBusy(false);
  };

  return (
    <div className={`nav-auth${open ? ' open' : ''}`} ref={wrapRef}>
      <button
        type="button"
        className="nav-avatar"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{initials(user.name)}</span>
      </button>

      <div className="nav-avatar-menu" role="menu" aria-label="Account">
        <div className="nav-avatar-id">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
        <Link
          href="/my-bookings"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            onNavigate?.();
          }}
        >
          My Bookings
        </Link>
        <button type="button" role="menuitem" className="nav-avatar-out" onClick={onLogout} disabled={busy}>
          {busy ? 'Logging out…' : 'Logout'}
        </button>
      </div>
    </div>
  );
}
