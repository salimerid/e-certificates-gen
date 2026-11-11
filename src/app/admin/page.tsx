'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Users,
  Award,
  GraduationCap,
  Plus,
  Search,
  QrCode,
  Download,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  MapPin,
  Briefcase,
  X,
  FileCheck,
} from 'lucide-react';

interface Training {
  id: number;
  topic: string;
  trainingSite?: string | null;
  durationHours?: string | null;
}

interface PersonRecord {
  id: number;
  uuid: string;
  name: string;
  hsseProfileId?: string | null;
  peopleId?: string | null;
  site?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  roleScope?: string | null;
  peopleType?: string | null;
  certificateNo?: string | null;
  photoUrl?: string | null;
  trainings?: Training[];
  _count?: {
    trainings: number;
  };
}

export default function AllRecordsPage() {
  const [records, setRecords] = useState<PersonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // QR Modal State
  const [selectedRecord, setSelectedRecord] = useState<PersonRecord | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/records?q=${encodeURIComponent(search)}&page=${page}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the record for "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchRecords();
      } else {
        alert('Failed to delete record.');
      }
    } catch {
      alert('Error occurred while deleting record.');
    }
  };

  const handleOpenQrModal = async (record: PersonRecord) => {
    setSelectedRecord(record);
    setCopied(false);
    try {
      const origin = window.location.origin;
      const targetUrl = `${origin}/record/${record.uuid}`;
      const url = await QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
      setModalOpen(true);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const handleCopyLink = () => {
    if (selectedRecord) {
      const url = `${window.location.origin}/record/${selectedRecord.uuid}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Filter records by people type if selected
  const filteredRecords = records.filter((r) => {
    if (selectedType === 'ALL') return true;
    return r.peopleType?.toLowerCase() === selectedType.toLowerCase();
  });

  // Calculate training total across fetched records
  const totalTrainingsCount = records.reduce(
    (acc, r) => acc + (r._count?.trainings ?? r.trainings?.length ?? 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Top Header Row */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h3 className="fw-bold text-slate-900 mb-0" style={{ letterSpacing: '-0.02em' }}>
              Personnel &amp; Training Records
            </h3>
            <span className="badge bg-primary-subtle text-primary fw-semibold px-2.5 py-1 rounded-pill small">
              Active Registry
            </span>
          </div>
          <p className="text-muted small mb-0">
            Manage personnel certifications, live QR codes, and generate verified Bureau Veritas ID cards.
          </p>
        </div>

        <Link
          href="/admin/create"
          className="btn text-white fw-semibold d-flex align-items-center gap-2 px-3 py-2"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
            borderRadius: '10px',
            boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.25)',
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Personnel</span>
        </Link>
      </div>

      {/* Metrics / Stats Cards */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Total Personnel */}
        <div className="col-sm-6 col-md-4">
          <div className="tbc-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-medium d-block mb-1">Total Personnel</span>
              <h3 className="fw-bold text-slate-900 mb-0">{totalCount}</h3>
              <small className="text-emerald-600 fw-semibold">
                <FileCheck className="w-3.5 h-3.5 d-inline me-1" />
                Active in Registry
              </small>
            </div>
            <div
              className="p-3 rounded-3"
              style={{ background: '#eff6ff', color: '#1d4ed8' }}
            >
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 2: Total Training Logs */}
        <div className="col-sm-6 col-md-4">
          <div className="tbc-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-medium d-block mb-1">Total Training Logs</span>
              <h3 className="fw-bold text-slate-900 mb-0">{totalTrainingsCount}</h3>
              <small className="text-primary fw-semibold">Completed Modules</small>
            </div>
            <div
              className="p-3 rounded-3"
              style={{ background: '#f5f3ff', color: '#7c3aed' }}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 3: Certificates Issued */}
        <div className="col-sm-12 col-md-4">
          <div className="tbc-card p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-medium d-block mb-1">Certificates Issued</span>
              <h3 className="fw-bold text-slate-900 mb-0">{totalCount}</h3>
              <small className="text-amber-600 fw-semibold">QR Live Verified</small>
            </div>
            <div
              className="p-3 rounded-3"
              style={{ background: '#fffbeb', color: '#d97706' }}
            >
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="tbc-card p-3 mb-4">
        <div className="row g-2 align-items-center justify-content-between">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-1"
                placeholder="Search by name, Profile ID, people ID, or site..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ fontSize: '13.5px' }}
              />
            </div>
          </div>

          <div className="col-md-7 d-flex justify-content-md-end gap-2 flex-wrap">
            <div className="btn-group btn-group-sm" role="group">
              {['ALL', 'Employee', 'Subcontractor', 'Contractor'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`btn ${
                    selectedType === type ? 'btn-dark' : 'btn-outline-secondary'
                  }`}
                  style={{ fontSize: '12px', fontWeight: '500' }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Records Table Card */}
      <div className="tbc-card overflow-hidden">
        <div className="table-responsive">
          <table className="tbc-table">
            <thead>
              <tr>
                <th>Personnel</th>
                <th>Profile ID</th>
                <th>Site</th>
                <th>Job Title &amp; Scope</th>
                <th>People Type</th>
                <th className="text-center">Trainings</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Loading personnel registry...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    <Users className="w-8 h-8 mx-auto text-slate-300 d-block mb-2" />
                    No records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const trainingCount = r._count?.trainings ?? r.trainings?.length ?? 0;
                  const initials = r.name
                    ? r.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                    : 'TB';

                  return (
                    <tr key={r.id}>
                      {/* Name & Avatar */}
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                            style={{
                              width: '38px',
                              height: '38px',
                              background: '#f1f5f9',
                              color: '#1e3a8a',
                              fontSize: '13px',
                              border: '1.5px solid #cbd5e1',
                            }}
                          >
                            {r.photoUrl ? (
                              <img
                                src={r.photoUrl}
                                alt={r.name}
                                className="rounded-circle w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <div className="fw-bold text-slate-900" style={{ fontSize: '14px' }}>
                              {r.name}
                            </div>
                            <small className="text-muted" style={{ fontSize: '11.5px' }}>
                              ID: {r.peopleId || '—'}
                            </small>
                          </div>
                        </div>
                      </td>

                      {/* Profile ID */}
                      <td>
                        <span
                          className="d-inline-flex align-items-center px-2.5 py-1 rounded font-mono fw-semibold border"
                          style={{
                            fontSize: '12px',
                            backgroundColor: '#f1f5f9',
                            color: '#1e293b',
                            borderColor: '#cbd5e1',
                          }}
                        >
                          {r.hsseProfileId || '—'}
                        </span>
                      </td>

                      {/* Site */}
                      <td>
                        <div className="d-flex align-items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{r.site || 'Shaqra Wind'}</span>
                        </div>
                      </td>

                      {/* Job Title */}
                      <td>
                        <div className="d-flex align-items-center gap-1.5 text-slate-700">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="fw-medium">{r.jobTitle || 'HELPER'}</span>
                        </div>
                        {r.roleScope && (
                          <small className="text-muted d-block ps-4" style={{ fontSize: '11.5px' }}>
                            Scope: {r.roleScope}
                          </small>
                        )}
                      </td>

                      {/* People Type */}
                      <td>
                        <span
                          className="d-inline-flex align-items-center px-2.5 py-1 rounded-pill fw-semibold border"
                          style={{
                            fontSize: '11.5px',
                            backgroundColor:
                              r.peopleType === 'Employee'
                                ? '#eff6ff'
                                : r.peopleType === 'Subcontractor'
                                ? '#faf5ff'
                                : '#fffbeb',
                            color:
                              r.peopleType === 'Employee'
                                ? '#1d4ed8'
                                : r.peopleType === 'Subcontractor'
                                ? '#7e22ce'
                                : '#b45309',
                            borderColor:
                              r.peopleType === 'Employee'
                                ? '#bfdbfe'
                                : r.peopleType === 'Subcontractor'
                                ? '#e9d5ff'
                                : '#fde68a',
                          }}
                        >
                          {r.peopleType || 'Subcontractor'}
                        </span>
                      </td>

                      {/* Training Count */}
                      <td className="text-center">
                        <span
                          className="d-inline-flex align-items-center px-2.5 py-1 rounded-pill fw-bold border"
                          style={{
                            fontSize: '12px',
                            backgroundColor: '#f8fafc',
                            color: '#0f172a',
                            borderColor: '#cbd5e1',
                          }}
                        >
                          <GraduationCap className="w-3.5 h-3.5 d-inline me-1 text-primary" />
                          {trainingCount}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                        <div className="d-inline-flex align-items-center gap-1">
                          {/* QR Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => handleOpenQrModal(r)}
                            className="btn btn-sm btn-light border text-primary"
                            title="View QR Code & Verification"
                            style={{ borderRadius: '6px' }}
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Direct Certificate Download */}
                          <a
                            href={`/api/records/${r.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-light border text-success"
                            title="Download 2-Page Certificate PDF"
                            style={{ borderRadius: '6px' }}
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          {/* Edit Record */}
                          <Link
                            href={`/admin/${r.id}/edit`}
                            className="btn btn-sm btn-light border text-secondary"
                            title="Edit Record"
                            style={{ borderRadius: '6px' }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {/* Delete Record */}
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id, r.name)}
                            className="btn btn-sm btn-light border text-danger"
                            title="Delete Record"
                            style={{ borderRadius: '6px' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
          <p className="small text-muted mb-0">
            Showing Page <span className="fw-semibold text-slate-800">{page}</span> of{' '}
            <span className="fw-semibold text-slate-800">{totalPages}</span> ({totalCount} total personnel)
          </p>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(p)}>
                  {p}
                </button>
              </li>
            ))}
            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Interactive QR Code & Verification Drawer / Modal */}
      {modalOpen && selectedRecord && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
            <div className="modal-content shadow-2xl border-0 overflow-hidden" style={{ borderRadius: '16px' }}>
              {/* Modal Header */}
              <div
                className="modal-header px-4 py-3 text-white border-0"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <h5 className="modal-title fw-bold" style={{ fontSize: '1.05rem' }}>
                    TBC Verified Credential
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-white-50 hover:text-white p-0"
                  onClick={() => setModalOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 text-center">
                <div className="mb-2">
                  <h5 className="fw-bold text-slate-900 mb-0">{selectedRecord.name}</h5>
                  <p className="text-muted small mb-0">
                    Profile ID: <strong>{selectedRecord.hsseProfileId || 'N/A'}</strong> &nbsp;|&nbsp;
                    Cert #{selectedRecord.certificateNo || '148-2026-EN'}
                  </p>
                </div>

                {/* Scannable QR Code */}
                {qrDataUrl && (
                  <div className="p-3 bg-white border rounded-3 d-inline-block shadow-sm my-3">
                    <img
                      src={qrDataUrl}
                      alt="TBC Live QR Code"
                      style={{ width: '210px', height: '210px', display: 'block' }}
                    />
                  </div>
                )}

                <p className="text-slate-600 small px-3 mb-3">
                  Scanning this QR code with any smartphone redirects to the public training details page{' '}
                  <strong className="text-primary">without requiring any login</strong>.
                </p>

                {/* Copyable Public URL */}
                <div className="p-2.5 bg-slate-50 border rounded-3 text-start small mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-muted fw-semibold" style={{ fontSize: '11px' }}>
                      PUBLIC VERIFICATION URL
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="btn btn-link btn-sm p-0 text-decoration-none d-flex align-items-center gap-1 text-primary"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-success" />
                          <span className="text-success fw-bold" style={{ fontSize: '11px' }}>
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span style={{ fontSize: '11px' }}>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className="font-mono text-slate-700 text-truncate"
                    style={{ fontSize: '11.5px' }}
                  >
                    {typeof window !== 'undefined' ? window.location.origin : ''}/record/{selectedRecord.uuid}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2 justify-content-center">
                  <a
                    href={`/record/${selectedRecord.uuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2 fw-medium"
                    style={{ borderRadius: '8px' }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Public Log</span>
                  </a>
                  <a
                    href={`/api/records/${selectedRecord.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm d-flex align-items-center gap-1.5 px-3 py-2 fw-medium text-white"
                    style={{ borderRadius: '8px' }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Card</span>
                  </a>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-slate-50 py-2.5 px-4 border-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: '6px' }}
                  onClick={() => setModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
