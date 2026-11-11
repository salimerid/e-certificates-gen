'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 px-3 py-1.5 fw-medium"
      style={{ borderRadius: '8px' }}
    >
      <Printer className="w-4 h-4" />
      <span>Print Record</span>
    </button>
  );
}
