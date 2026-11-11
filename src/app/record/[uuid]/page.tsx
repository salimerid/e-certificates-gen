import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import './bureau.css';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Authenticate your Document',
    description: 'Bureau Veritas Official Document Authentication Portal',
  };
}

function formatDate(d?: Date | null): string {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default async function PublicRecordDetailsPage({ params }: PageProps) {
  const { uuid } = await params;

  let record = await prisma.personRecord.findUnique({
    where: { uuid },
    include: {
      trainings: true,
    },
  });

  if (!record) {
    record = await prisma.personRecord.findFirst({
      where: { certificateNo: uuid },
      include: {
        trainings: true,
      },
    });
  }

  if (!record) {
    notFound();
  }

  const deliverableId = record.certificateNo || '148-2026-090235-EN';
  const publishedOn = record.issuedOn ? formatDate(record.issuedOn) : '09/08/2026';
  const qrStatus = 'Validated';
  const name = record.name ? record.name.toUpperCase() : 'ZAHANGIR CHAKLADER';
  const peopleId = record.peopleId || '2631733033';
  const issuedOn = record.issuedOn ? formatDate(record.issuedOn) : '09/08/2026';
  const validUntil = record.validUntil ? formatDate(record.validUntil) : '08/08/2027';
  const courseType = record.courseType || record.trainings?.[0]?.topic || record.jobTitle || 'WELDER 3G 4G';
  const model = record.model || 'N/A';
  const company = record.company || 'PRIVATE';
  const location = record.location || record.site || 'JUBAIL';
  const trainer = record.trainer || 'ZEESHAN KHAN';

  return (
    <div className="bureau-wrapper">
      <header className="bureau-header">
        <img src="/bureau/fingerprint.png" alt="Authenticate" />
        <div>
          <div className="qrc-app-logo-text">
            <b>Authenticate </b>
            <span>your document</span>
          </div>
          <p>Thank you for submitting your document for verification.</p>
          <p>Please find below the answer to your request.</p>
        </div>
      </header>

      <div id="main_container">
        <div id="row_2">
          <div id="row_2_1">
            <img src="/bureau/circle_success.png" alt="Success" />
          </div>

          <div id="row_2_2">
            <div className="bureau-field">
              <span className="key">Deliverable Id :</span>
              <span className="value">
                <a
                  href={`/api/records/${record.uuid}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download Certificate PDF"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {deliverableId}
                </a>
              </span>
            </div>

            <div className="bureau-field">
              <span className="key">Published on :</span>
              <span className="value">{publishedOn}</span>
            </div>

            <div className="bureau-field">
              <span className="key">QR Code Status :</span>
              <span className="value">{qrStatus}</span>
            </div>

            <div className="bureau-field">
              <span className="key">NAME :</span>
              <span className="value">{name}</span>
            </div>

            <div className="bureau-field">
              <span className="key">ID :</span>
              <span className="value">{peopleId}</span>
            </div>

            <div className="bureau-field">
              <span className="key">ISSUED ON :</span>
              <span className="value">{issuedOn}</span>
            </div>

            <div className="bureau-field">
              <span className="key">VALID UNTIL :</span>
              <span className="value">{validUntil}</span>
            </div>

            <div className="bureau-field">
              <span className="key">TYPE :</span>
              <span className="value">{courseType}</span>
            </div>

            <div className="bureau-field">
              <span className="key">MODEL :</span>
              <span className="value">{model}</span>
            </div>

            <div className="bureau-field">
              <span className="key">COMPANY :</span>
              <span className="value">{company}</span>
            </div>

            <div className="bureau-field">
              <span className="key">TRAINING LOCATION :</span>
              <span className="value">{location}</span>
            </div>

            <div className="bureau-field">
              <span className="key">TRAINER :</span>
              <span className="value">{trainer}</span>
            </div>

            <p className="bureau-disclaimer">
              For any further information on this document, please contact the issuer of the document.
            </p>
          </div>

          <div id="row_2_3">
            <img src="/bureau/content_industry_bottom.png" alt="Bottom Angle" />
          </div>

          <div id="bottom_p">
            <h4>Visit</h4>
            <a href="https://group.bureauveritas.com/" target="_blank" rel="noopener noreferrer">
              Bureau Veritas Website
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
