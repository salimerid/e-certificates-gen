'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

interface TrainingRow {
  topic: string;
  training_site: string;
  from_date: string;
  to_date: string;
  duration_hours: string;
  assessment_score: string;
  training_drive: string;
  methodology: string;
  recertification_date: string;
}

const emptyTrainingRow: TrainingRow = {
  topic: '',
  training_site: '',
  from_date: '',
  to_date: '',
  duration_hours: '',
  assessment_score: '',
  training_drive: '',
  methodology: '',
  recertification_date: '',
};

export default function AddRecordPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Personal Information
  const [name, setName] = useState('');
  const [hsseProfileId, setHsseProfileId] = useState('');
  const [peopleId, setPeopleId] = useState('');
  const [site, setSite] = useState('Shaqra Wind');
  const [department, setDepartment] = useState('Construction');
  const [jobTitle, setJobTitle] = useState('HELPER');
  const [roleScope, setRoleScope] = useState('Civil');
  const [peopleType, setPeopleType] = useState('Subcontractor');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoUrl, setPhotoUrl] = useState('');

  // Certificate Specific Fields
  const [certificateNo, setCertificateNo] = useState('');
  const [refNo, setRefNo] = useState('');
  const [issuedOn, setIssuedOn] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [company, setCompany] = useState('TBC CONSTRUCTION');
  const [courseType, setCourseType] = useState('WELDER 3G 4G');
  const [trainer, setTrainer] = useState('ZEESHAN KHAN');
  const [location, setLocation] = useState('JUBAIL');

  // Dynamic Training Rows
  const [trainings, setTrainings] = useState<TrainingRow[]>([
    {
      ...emptyTrainingRow,
      topic: 'Site Safety Induction - Employee',
      training_site: 'Shaqra Wind Construction',
      training_drive: 'TBC Mandatory Requirement',
      methodology: 'Classroom',
      duration_hours: '2.00',
    },
  ]);

  const handleAddTraining = () => {
    setTrainings([...trainings, { ...emptyTrainingRow }]);
  };

  const handleRemoveTraining = (index: number) => {
    setTrainings(trainings.filter((_, i) => i !== index));
  };

  const handleTrainingChange = (index: number, field: keyof TrainingRow, value: string) => {
    const updated = [...trainings];
    updated[index][field] = value;
    setTrainings(updated);
  };

  const handleAutoGenerateCertNo = () => {
    const yr = new Date().getFullYear();
    const randCert = Math.floor(100000 + Math.random() * 900000);
    const randRef = Math.floor(10000 + Math.random() * 90000);
    setCertificateNo(`148-${yr}-${randCert}-EN`);
    setRefNo(`JUB.IVS.26.08.${randRef}`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          hsse_profile_id: hsseProfileId,
          people_id: peopleId,
          site,
          department,
          job_title: jobTitle,
          role_scope: roleScope,
          people_type: peopleType,
          joining_date: joiningDate,
          photo_url: photoUrl,
          certificate_no: certificateNo,
          ref_no: refNo,
          issued_on: issuedOn,
          valid_until: validUntil,
          company,
          course_type: courseType,
          trainer,
          location,
          trainings,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create record');
        setSubmitting(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('An error occurred while saving the record');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Link
          href="/admin"
          className="btn btn-sm btn-light border me-3 text-slate-700 d-flex align-items-center justify-content-center"
          style={{ width: '36px', height: '36px', borderRadius: '8px' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h4 className="fw-bold text-slate-900 mb-0">Add New Personnel Record</h4>
          <p className="text-muted small mb-0">
            Create a verified personnel entry in TBC Construction database with QR credentials.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2.5 px-3 small d-flex align-items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Card 1: Personal Information */}
        <div className="tbc-card mb-4 overflow-hidden border-0 shadow-sm">
          <div
            className="px-4 py-3 d-flex align-items-center justify-content-between"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              color: '#ffffff',
            }}
          >
            <div className="d-flex align-items-center gap-2.5">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-0" style={{ letterSpacing: '0.2px' }}>
                  Personal Information
                </h6>
                <small style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '11.5px' }}>
                  Core personnel identity and site assignment details
                </small>
              </div>
            </div>
            <span
              className="badge text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                fontWeight: 500,
                fontSize: '11px',
              }}
            >
              Section 1 of 3
            </span>
          </div>
          <div className="p-4">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-slate-700">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-slate-700">
                  TBC Profile ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={hsseProfileId}
                  onChange={(e) => setHsseProfileId(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-slate-700">
                  National / People ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={peopleId}
                  onChange={(e) => setPeopleId(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-slate-700">Site</label>
                <input
                  type="text"
                  className="form-control"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-slate-700">Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-slate-700">Job Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-slate-700">Role Scope</label>
                <input
                  type="text"
                  className="form-control"
                  value={roleScope}
                  onChange={(e) => setRoleScope(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-slate-700">People Type</label>
                <select
                  className="form-select"
                  value={peopleType}
                  onChange={(e) => setPeopleType(e.target.value)}
                >
                  <option value="Employee">Employee</option>
                  <option value="Subcontractor">Subcontractor</option>
                  <option value="Contractor">Contractor</option>
                  <option value="Visitor">Visitor</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-slate-700">Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                />
              </div>

              {/* Photo Upload */}
              <div className="col-md-12 mt-3 pt-3 border-top">
                <label className="form-label small fw-semibold text-slate-700 d-block">
                  Person Portrait Photo (Printed on ID Certificate Card)
                </label>
                <div className="d-flex align-items-center gap-4">
                  <div className="flex-grow-1" style={{ maxWidth: '420px' }}>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <Upload className="w-4 h-4 text-muted" />
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handlePhotoUpload}
                      />
                    </div>
                    <small className="text-muted d-block mt-1">
                      Leave empty to use standard portrait avatar.
                    </small>
                  </div>
                  {photoUrl && (
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        style={{
                          width: '54px',
                          height: '64px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="btn btn-sm btn-link text-danger p-0"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Certificate Configuration */}
        <div className="tbc-card mb-4 overflow-hidden border-0 shadow-sm">
          <div
            className="px-4 py-3 d-flex justify-content-between align-items-center"
            style={{
              background: 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)',
              color: '#ffffff',
            }}
          >
            <div className="d-flex align-items-center gap-2.5">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-0" style={{ letterSpacing: '0.2px' }}>
                  Certificate &amp; ID Card Configuration
                </h6>
                <small style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '11.5px' }}>
                  Official 2-page landscape certificate parameters &amp; verification codes
                </small>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoGenerateCertNo}
              className="btn btn-sm text-white d-flex align-items-center gap-1.5 shadow-sm"
              style={{
                borderRadius: '7px',
                background: 'rgba(255, 255, 255, 0.22)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                fontSize: '12.5px',
                fontWeight: 500,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Generate Cert Numbers</span>
            </button>
          </div>
          <div className="p-4">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-slate-700">Certificate No.</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value)}
                  placeholder="e.g. 148-2026-090235-EN"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-slate-700">Ref.#</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="e.g. JUB.IVS.26.08.50021"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-slate-700">Issued On</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={issuedOn}
                  onChange={(e) => setIssuedOn(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-slate-700">Valid Until</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-slate-700">Company</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. TBC Construction Co. / Subcontractor"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-slate-700">Course Type</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                  placeholder="e.g. WELDER 3G 4G / Working at Height"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-slate-700">Trainer</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={trainer}
                  onChange={(e) => setTrainer(e.target.value)}
                  placeholder="e.g. Eng. Zeeshan Khan (Lead Instructor)"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-slate-700">Location</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Jubail Industrial City Campus"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Training Records */}
        <div className="tbc-card mb-4 overflow-hidden border-0 shadow-sm">
          <div
            className="px-4 py-3 d-flex justify-content-between align-items-center"
            style={{
              background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
              color: '#ffffff',
            }}
          >
            <div className="d-flex align-items-center gap-2.5">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-0" style={{ letterSpacing: '0.2px' }}>
                  Training Records
                </h6>
                <small style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '11.5px' }}>
                  Safety inductions, technical courses, and competency certifications
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-light fw-semibold text-emerald-900 d-flex align-items-center gap-1.5 shadow-sm"
              style={{
                borderRadius: '7px',
                fontSize: '12.5px',
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}
              onClick={handleAddTraining}
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Add Training</span>
            </button>
          </div>
          <div className="p-0">
            {trainings.map((t, idx) => (
              <div key={idx} className="border-bottom p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span
                    className="badge bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono px-2.5 py-1"
                    style={{ fontSize: '12px' }}
                  >
                    Training Record #{idx + 1}
                  </span>
                  {trainings.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger p-0 d-flex align-items-center gap-1"
                      onClick={() => handleRemoveTraining(idx)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Topic</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={t.topic}
                      onChange={(e) => handleTrainingChange(idx, 'topic', e.target.value)}
                      placeholder="e.g. Site HSSE Induction & Emergency Response / Scaffolding Safety"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Training Site</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={t.training_site}
                      onChange={(e) =>
                        handleTrainingChange(idx, 'training_site', e.target.value)
                      }
                      placeholder="e.g. Shaqra Wind Project - On-site Safety Training Center"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-muted">From Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={t.from_date}
                      onChange={(e) => handleTrainingChange(idx, 'from_date', e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-muted">To Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={t.to_date}
                      onChange={(e) => handleTrainingChange(idx, 'to_date', e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-muted">Duration (hours)</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      className="form-control form-control-sm"
                      value={t.duration_hours}
                      onChange={(e) =>
                        handleTrainingChange(idx, 'duration_hours', e.target.value)
                      }
                      placeholder="e.g. 4.00 (Total credit hours)"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-muted">Assessment Score %</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={t.assessment_score}
                      onChange={(e) =>
                        handleTrainingChange(idx, 'assessment_score', e.target.value)
                      }
                      placeholder="e.g. 95.00% (or 'Passed' / '—')"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-muted">Training Drive</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={t.training_drive}
                      onChange={(e) =>
                        handleTrainingChange(idx, 'training_drive', e.target.value)
                      }
                      placeholder="e.g. TBC Corporate Mandatory / Client Compliance Drive"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-muted">Methodology</label>
                    <select
                      className="form-select form-select-sm"
                      value={t.methodology}
                      onChange={(e) =>
                        handleTrainingChange(idx, 'methodology', e.target.value)
                      }
                    >
                      <option value="Classroom">Classroom</option>
                      <option value="Online">Online</option>
                      <option value="On-the-Job">On-the-Job</option>
                      <option value="Blended">Blended</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Toolbox Talk">Toolbox Talk</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-muted">Recertification Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={t.recertification_date}
                      onChange={(e) =>
                        handleTrainingChange(idx, 'recertification_date', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn text-white px-4 py-2 fw-semibold d-flex align-items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
              borderRadius: '8px',
            }}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm"></span>
                <span>Saving to Registry...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Record</span>
              </>
            )}
          </button>
          <Link href="/admin" className="btn btn-outline-secondary px-3 py-2" style={{ borderRadius: '8px' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
