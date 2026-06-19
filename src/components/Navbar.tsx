'use client';
import { useState } from 'react';
import MobileSidebar from './MobileSidebar';
import { navLinks } from '../data/footer';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <nav style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E4E2DC',
        position: 'sticky', top: 0, zIndex: 50,
        boxSizing: 'border-box',
      }}>
        {/* Desktop nav: 1440px wide, 72px tall */}
        <div
          style={{ maxWidth: 1440, margin: '0 auto', padding: '0 64px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          className="hidden-mobile hidden-tablet"
        >
          <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 16, letterSpacing: 2, color: '#1B2D4F' }}>APEX</span>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {navLinks.map(link => (
              <a key={link} href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 14, color: '#1C1C1A', textDecoration: 'none' }}>{link}</a>
            ))}
          </div>
          <button className="btn-primary" style={{ width: 120, height: 40, fontSize: 15 }}>Book Now</button>
        </div>

        {/* Tablet nav: 64px tall */}
        <div
          style={{ maxWidth: 768, margin: '0 auto', padding: '0 32px', height: 64, alignItems: 'center', justifyContent: 'space-between' }}
          className="tablet-only"
        >
          <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 15, letterSpacing: 2, color: '#1B2D4F' }}>APEX</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="btn-primary" style={{ width: 106, height: 40, fontSize: 14 }}>Book Now</button>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 0 }}
              aria-label="Open menu"
            >
              <div className="hamburger-line" />
              <div className="hamburger-line" />
              <div className="hamburger-line" />
            </button>
          </div>
        </div>

        {/* Mobile nav: 56px tall */}
        <div
          style={{ padding: '0 20px', height: 56, alignItems: 'center', justifyContent: 'space-between' }}
          className="mobile-only"
        >
          <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 15, letterSpacing: 2, color: '#1B2D4F' }}>APEX</span>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 0 }}
            aria-label="Open menu"
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </button>
        </div>
      </nav>
    </>
  );
}
