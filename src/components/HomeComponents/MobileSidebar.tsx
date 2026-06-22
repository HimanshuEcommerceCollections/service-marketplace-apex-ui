'use client';
import { useEffect } from 'react';
import { navLinks } from '../../data/HomeData/footer';
import { services } from '../../data/HomeData/services';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(0,0,0,0.6)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sidebar panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 280, zIndex: 999,
        background: '#000000',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 0' }}>
          <span style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 15, letterSpacing: 2, color: '#FFFFFF' }}>APEX</span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFFFFF', fontSize: 18 }}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', margin: '16px 20px' }} />

        {/* Book Now CTA */}
        <div style={{ padding: '0 20px 16px' }}>
          <button className="btn-amber" style={{ width: '100%', height: 44, fontSize: 14, fontWeight: 600, borderRadius: 6 }}>
            Book Now
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '0 20px' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 8px' }}>NAVIGATION</p>
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              style={{
                display: 'block',
                fontFamily: 'Inter', fontWeight: 500, fontSize: 15, color: '#FFFFFF',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                textDecoration: 'none',
              }}
              onClick={onClose}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', margin: '16px 20px' }} />

        {/* Services List */}
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 8px' }}>SERVICES</p>
          {services.map((svc) => (
            <a
              key={svc.id}
              href="#"
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontFamily: 'Inter', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.8)',
                padding: '9px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
              }}
              onClick={onClose}
            >
              <span>{svc.name}</span>
              <span style={{ color: '#C07820', fontSize: 12, fontWeight: 600 }}>
                {svc.price.startsWith('Quote') ? 'Quote' : svc.price.split(' ').slice(0, 2).join(' ')}
              </span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', margin: '16px 20px' }} />

        {/* Footer note */}
        <div style={{ padding: '0 20px 32px', marginTop: 'auto' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: '155%', margin: 0 }}>
            Wake County · Raleigh, NC<br />
            DRAFT — Not for public distribution.
          </p>
        </div>
      </div>
    </>
  );
}
