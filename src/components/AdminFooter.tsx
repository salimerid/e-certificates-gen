import React from 'react';

export default function AdminFooter() {
  return (
    <footer
      style={{
        background: '#0f172a',
        color: '#94a3b8',
        fontSize: '13px',
        padding: '14px 24px',
        textAlign: 'center',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div className="d-flex flex-wrap justify-content-between align-items-center container-fluid">
        <div>
          © 2026 <strong className="text-white">TBC Construction</strong> &nbsp;|&nbsp; Safety &amp; Training Directorate
        </div>
        <div>
          Bureau Veritas Certified &nbsp;|&nbsp; Official Credential Registry
        </div>
      </div>
    </footer>
  );
}
