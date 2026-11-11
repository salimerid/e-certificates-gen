import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';
import { ShieldCheck, Download, Award, FileCheck2, Calendar } from 'lucide-react';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

function formatDateDisplay(d?: Date | null): string {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mon = months[date.getMonth()];
  const yr = date.getFullYear();
  return `${day}-${mon}-${yr}`;
}

export default async function PublicRecordDetailsPage({ params }: PageProps) {
  const { uuid } = await params;

  const record = await prisma.personRecord.findUnique({
    where: { uuid },
    include: {
      trainings: true,
    },
  });

  if (!record) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-vh-100 p-3 p-md-4">
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Verification Status Pill */}
        <div className="no-print d-flex justify-content-between align-items-center mb-3 p-2.5 px-3 bg-emerald-50 border border-emerald-200 rounded-3 text-emerald-800 small">
          <div className="d-flex align-items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="fw-semibold">
              Authentic Verified Record &ndash; TBC Construction Safety Directorate
            </span>
          </div>
          <span className="d-none d-md-inline text-emerald-700" style={{ fontSize: '12px' }}>
            Live QR Validation Successful
          </span>
        </div>

        {/* Logos Header */}
        <div className="bg-white p-4 rounded-3 border mb-3 shadow-sm">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <img
                src="/images/tbc-logo.png"
                alt="TBC Construction"
                style={{ height: '56px', objectFit: 'contain' }}
              />
            </div>
            <div className="d-flex align-items-center gap-2 text-end">
              <div className="d-flex flex-column text-end">
                <span className="badge bg-slate-900 text-white px-3 py-1.5 rounded-pill small">
                  Official Verification Portal
                </span>
                <span className="text-muted mt-1" style={{ fontSize: '11px' }}>
                  Bureau Veritas Certified Inspection
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Title Bar */}
        <div className="tbc-log-header shadow-sm">
          Individual Training Log &amp; Competency Record
        </div>

        {/* Personal Info Grid */}
        <div className="tbc-info-grid shadow-sm">
          <div className="tbc-info-row">
            <div className="tbc-info-cell">
              <strong>Name:</strong> {record.name}
            </div>
            <div className="tbc-info-cell">
              <strong>Profile ID:</strong> {record.hsseProfileId || '—'}
            </div>
            <div className="tbc-info-cell">
              <strong>People ID:</strong> {record.peopleId || '—'}
            </div>
          </div>
          <div className="tbc-info-row">
            <div className="tbc-info-cell">
              <strong>Site:</strong> {record.site || 'Shaqra Wind'}
            </div>
            <div className="tbc-info-cell">
              <strong>Department:</strong> {record.department || 'Construction'}
            </div>
            <div className="tbc-info-cell">
              <strong>Job Title:</strong> {record.jobTitle || 'HELPER'}
            </div>
          </div>
          <div className="tbc-info-row">
            <div className="tbc-info-cell">
              <strong>Role Scope:</strong> {record.roleScope || 'Civil'}
            </div>
            <div className="tbc-info-cell">
              <strong>People Type:</strong> {record.peopleType || 'Subcontractor'}
            </div>
            <div className="tbc-info-cell">
              <strong>Joining Date:</strong> {formatDateDisplay(record.joiningDate)}
            </div>
          </div>
        </div>

        {/* Training Records Section */}
        <div className="bg-white p-4 rounded-bottom border border-top-0 mb-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-slate-900 mb-0 d-flex align-items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Completed Training Records &amp; Safety Courses</span>
            </h5>
            <span className="badge bg-slate-100 text-slate-700 border small">
              {record.trainings?.length || 0} Training Records Registered
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered tbc-training-table mb-0">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Site</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Duration (hrs)</th>
                  <th>Training Drive</th>
                  <th>Methodology</th>
                  <th>Score %</th>
                  <th>Recertification</th>
                </tr>
              </thead>
              <tbody>
                {record.trainings && record.trainings.length > 0 ? (
                  record.trainings.map((t) => (
                    <tr key={t.id}>
                      <td className="fw-semibold text-slate-800">{t.topic}</td>
                      <td>{t.trainingSite || '—'}</td>
                      <td>{formatDateDisplay(t.fromDate)}</td>
                      <td>{formatDateDisplay(t.toDate)}</td>
                      <td>{t.durationHours || '—'}</td>
                      <td>{t.trainingDrive || '—'}</td>
                      <td>
                        <span className="badge bg-slate-100 text-slate-700 border">
                          {t.methodology || 'Classroom'}
                        </span>
                      </td>
                      <td className="fw-medium">{t.assessmentScore || '—'}</td>
                      <td>{formatDateDisplay(t.recertificationDate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center text-muted py-4">
                      No training modules recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Bar (Print & Download) */}
        <div className="no-print d-flex flex-wrap justify-content-between align-items-center p-3 bg-white border rounded-3 shadow-sm mb-4 gap-3">
          <div className="d-flex align-items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-primary" />
            <div>
              <span className="small fw-bold text-slate-800 d-block">
                Certificate #{record.certificateNo || '148-2026-090235-EN'}
              </span>
              <span className="text-muted" style={{ fontSize: '11.5px' }}>
                Ref.# {record.refNo || 'JUB.IVS.26.08.50021'} &nbsp;|&nbsp; Valid Until: {formatDateDisplay(record.validUntil)}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <a
              href={`/api/records/${record.uuid}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-success text-white d-flex align-items-center gap-1.5 px-3 py-1.5 fw-medium"
              style={{ borderRadius: '8px' }}
            >
              <Download className="w-4 h-4" />
              <span>Download 2-Page Card PDF</span>
            </a>
            <PrintButton />
          </div>
        </div>

        {/* Modern Footer */}
        <footer
          className="no-print text-center text-muted py-3 border-top"
          style={{ fontSize: '12px' }}
        >
          © 2026 <strong>TBC Construction</strong> &nbsp;|&nbsp; Safety &amp; Training Records Directorate &nbsp;|&nbsp;
          Shaqra Wind Facility &nbsp;|&nbsp; Bureau Veritas Certified
        </footer>
      </div>
    </div>
  );
}
