'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserPlus, Shield, Award, HelpCircle } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const isAllRecords = pathname === '/admin';
  const isAddRecord = pathname === '/admin/create';

  return (
    <nav className="col-md-2 d-none d-md-block tbc-sidebar p-3">
      <div className="mb-4">
        <span
          className="text-uppercase text-muted fw-bold px-3 d-block mb-2"
          style={{ fontSize: '11px', letterSpacing: '0.08em' }}
        >
          Management
        </span>
        <div className="d-flex flex-column gap-1">
          <Link
            href="/admin"
            className={`tbc-nav-item ${isAllRecords ? 'active' : ''}`}
          >
            <Users className="w-4 h-4" />
            <span>All Records</span>
          </Link>
          <Link
            href="/admin/create"
            className={`tbc-nav-item ${isAddRecord ? 'active' : ''}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Record</span>
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <span
          className="text-uppercase text-muted fw-bold px-3 d-block mb-2"
          style={{ fontSize: '11px', letterSpacing: '0.08em' }}
        >
          System &amp; Verification
        </span>
        <div className="d-flex flex-column gap-1">
          <div className="tbc-nav-item text-secondary opacity-75">
            <Award className="w-4 h-4 text-primary" />
            <span>ID Card Generator</span>
          </div>
          <div className="tbc-nav-item text-secondary opacity-75">
            <Shield className="w-4 h-4 text-success" />
            <span>QR Live Audit</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-top">
        <div className="p-3 bg-light rounded-3 text-start small border">
          <div className="d-flex align-items-center gap-1.5 fw-semibold text-dark mb-1">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>Helpdesk</span>
          </div>
          <p className="text-muted mb-0" style={{ fontSize: '11.5px', lineHeight: '1.4' }}>
            Instant QR validation active. Any scanned certificate links directly to its public verified log.
          </p>
        </div>
      </div>
    </nav>
  );
}
