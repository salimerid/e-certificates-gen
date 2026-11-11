'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck, User } from 'lucide-react';

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="tbc-navbar px-4 py-2 d-flex justify-content-between align-items-center">
      {/* Brand Logos */}
      <div className="d-flex align-items-center gap-3">
        <img
          src="/images/tbc-logo.png"
          alt="TBC Construction"
          style={{ height: '48px', objectFit: 'contain' }}
        />
      </div>

      {/* Center Tag / Portal indicator */}
      <div className="d-none d-lg-flex align-items-center gap-2 px-3 py-1 bg-slate-100 rounded-pill text-xs font-semibold text-slate-700">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>TBC Personnel &amp; Certificate Directorate</span>
      </div>

      {/* Right User & Actions */}
      <div className="d-flex align-items-center gap-3">
        <div className="d-none d-sm-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: '34px', height: '34px', background: '#0f172a', fontSize: '13px' }}
          >
            <User className="w-4 h-4 text-slate-200" />
          </div>
          <div className="d-flex flex-column text-start" style={{ lineHeight: '1.2' }}>
            <span className="fw-semibold text-dark small">TBC Administrator</span>
            <span className="text-muted" style={{ fontSize: '11px' }}>admin@tbc.com</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1.5 px-3 py-1.5"
          style={{ borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
