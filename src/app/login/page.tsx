'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      router.push(redirectUrl);
      router.refresh();
    } catch {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="card shadow-lg border-0"
      style={{
        width: '100%',
        maxWidth: '460px',
        borderRadius: '16px',
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner with TBC Logo */}
      <div
        className="text-center py-4 px-4"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        }}
      >
        <div className="d-flex justify-content-center align-items-center mb-2">
          <div className="p-2 bg-white rounded-3 shadow-sm d-inline-block">
            <img
              src="/images/tbc-logo.png"
              alt="TBC Construction"
              style={{ height: '48px', objectFit: 'contain' }}
            />
          </div>
        </div>
        <h5 className="fw-bold mb-1 text-white" style={{ letterSpacing: '0.3px' }}>
          TBC Construction Portal
        </h5>
        <p className="text-slate-300 small mb-0" style={{ fontSize: '12px' }}>
          Safety &amp; Personnel Credential Management System
        </p>
      </div>

      <div className="card-body p-4 p-md-5">
        <div className="text-center mb-4">
          <h5 className="fw-bold text-slate-800 mb-1">Welcome Back</h5>
          <p className="text-muted small">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div
            className="alert alert-danger py-2.5 px-3 small d-flex align-items-center gap-2 mb-3"
            role="alert"
            style={{ borderRadius: '8px' }}
          >
            <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-slate-700">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-slate-50 border-end-0">
                <Mail className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="email"
                className="form-control bg-slate-50 border-start-0 ps-1"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ fontSize: '14px' }}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-slate-700">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-slate-50 border-end-0">
                <Lock className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="password"
                className="form-control bg-slate-50 border-start-0 ps-1"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontSize: '14px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-100 py-2.5 text-white fw-semibold d-flex justify-content-center align-items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.2)',
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100 p-3"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <Suspense fallback={<div className="text-muted">Loading portal...</div>}>
        <LoginForm />
      </Suspense>

      <div className="text-center mt-4 text-muted small">
        © 2026 TBC Construction &nbsp;|&nbsp; All Rights Reserved
      </div>
    </div>
  );
}
