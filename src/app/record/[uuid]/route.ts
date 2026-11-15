import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function formatDate(d?: Date | null): string {
  if (!d) return '09/08/2026';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '09/08/2026';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function replaceField(content: string, fieldName: string, newVal: string): string {
  const regex = new RegExp(
    `(<span class=["']key["']>${fieldName}\\s*:\\s*<\\/span>\\s*<span class=["']value["']>)([\\s\\S]*?)(<\\/span>)`,
    'i'
  );
  return content.replace(regex, `$1${newVal}$3`);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params;

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
    return new NextResponse('Record Not Found', { status: 404 });
  }

  const deliverableId = record.certificateNo || '148-2026-090235-EN';
  const publishedOn = record.issuedOn ? formatDate(record.issuedOn) : '09/08/2026';
  const qrStatus = 'Validated';
  const name = record.name ? record.name.toUpperCase() : 'ZAHANGIR CHAKLADER';
  const peopleId = record.peopleId || '2631733033';
  const issuedOn = record.issuedOn ? formatDate(record.issuedOn) : '09/08/2026';
  const validUntil = record.validUntil ? formatDate(record.validUntil) : '08/08/2027';
  const courseType = record.courseType || record.trainings?.[0]?.topic || 'WELDER 3G 4G';
  const model = record.model || 'N/A';
  const company = (record.company || 'PRIVATE').toUpperCase();
  const location = (record.location || record.site || 'JUBAIL').toUpperCase();
  const trainer = (record.trainer || 'ZEESHAN KHAN').toUpperCase();

  const templatePath = path.join(
    process.cwd(),
    'src/app/record/Authenticate your Document.html'
  );

  let html = fs.readFileSync(templatePath, 'utf-8');

  // Ensure base href exists so all relative images and files resolve from /
  if (!html.includes('<base href="/"')) {
    html = html.replace('<head>', '<head><base href="/" />');
  }

  // Inject dynamic values
  const deliverableLink = `<a href="/api/records/${record.uuid}/pdf" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;" title="Download Certificate PDF">${deliverableId}</a>`;

  html = replaceField(html, 'Deliverable Id', deliverableLink);
  html = replaceField(html, 'Published on', publishedOn);
  html = replaceField(html, 'QR Code Status', qrStatus);
  html = replaceField(html, 'NAME', name);
  html = replaceField(html, 'ID', peopleId);
  html = replaceField(html, 'ISSUED ON', issuedOn);
  html = replaceField(html, 'VALID UNTIL', validUntil);
  html = replaceField(html, 'TYPE', courseType);
  html = replaceField(html, 'MODEL', model);
  html = replaceField(html, 'COMPANY', company);
  html = replaceField(html, 'TRAINING LOCATION', location);
  html = replaceField(html, 'TRAINER', trainer);

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
