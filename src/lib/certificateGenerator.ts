import {
  PDFDocument,
  rgb,
  StandardFonts,
  PDFPage,
  PDFFont,
  Color,
  setTextRenderingMode,
  TextRenderingMode,
  setLineWidth,
  setStrokingColor,
  pushGraphicsState,
  popGraphicsState,
} from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export interface CertificateData {
  uuid: string;
  name: string;
  peopleId?: string | null;
  hsseProfileId?: string | null;
  certificateNo?: string | null;
  refNo?: string | null;
  issuedOn?: Date | string | null;
  validUntil?: Date | string | null;
  company?: string | null;
  issuanceNo?: string | null;
  courseType?: string | null;
  model?: string | null;
  trainer?: string | null;
  location?: string | null;
  photoUrl?: string | null;
}

function formatDate(d?: Date | string | null): string {
  if (!d) return '09/08/2026';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return '09/08/2026';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function drawBoldText(
  page: PDFPage,
  text: string,
  options: {
    x: number;
    y: number;
    size: number;
    font: PDFFont;
    color: Color;
  },
  strokeWidth: number = 0.65
) {
  page.pushOperators(
    pushGraphicsState(),
    setTextRenderingMode(TextRenderingMode.FillAndOutline),
    setLineWidth(strokeWidth),
    setStrokingColor(options.color)
  );
  page.drawText(text, options);
  page.pushOperators(popGraphicsState());
}

export async function generateCertificatePdf(
  data: CertificateData,
  baseUrl: string = 'http://localhost:3000'
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 745.25;
  const PAGE_HEIGHT = 475.5;

  // Exact colors matching generate-certificate.pdf
  const black = rgb(0.00, 0.00, 0.00);
  const certColor = rgb(0.18, 0.30, 0.64);
  const bkCertColor = rgb(0.02, 0.04, 0.84);
  const royalBlue = rgb(0.30, 0.29, 0.62)
  const redColor = rgb(0.99, 0.09, 0.09);

  // Load static assets
  const publicDir = path.join(process.cwd(), 'public');
  let logoImg: any = null;
  let watermarkImg: any = null;
  let avatarImg: any = null;

  try {
    const logoBytes = fs.readFileSync(path.join(publicDir, 'images/bv-logo-g.png'));
    logoImg = await doc.embedPng(logoBytes);
  } catch (e) {
    console.warn('Could not load bv-logo.png:', e);
  }

  try {
    const wmPath = path.join(publicDir, 'images/bv-logo-g.png');
    if (fs.existsSync(wmPath)) {
      const wmBytes = fs.readFileSync(wmPath);
      watermarkImg = await doc.embedPng(wmBytes);
    } else if (logoImg) {
      watermarkImg = logoImg;
    }
  } catch (e) {
    console.warn('Could not load watermark:', e);
  }

  // Handle Photo
  try {
    if (data.photoUrl && data.photoUrl.startsWith('data:image')) {
      const parts = data.photoUrl.split(',');
      const buffer = Buffer.from(parts[1], 'base64');
      if (data.photoUrl.includes('image/png')) {
        avatarImg = await doc.embedPng(buffer);
      } else {
        avatarImg = await doc.embedJpg(buffer);
      }
    } else {
      const avatarPng = path.join(publicDir, 'images/sample-avatar.png');
      const avatarJpg = path.join(publicDir, 'images/sample-avatar.jpg');
      if (fs.existsSync(avatarPng)) {
        const avatarBytes = fs.readFileSync(avatarPng);
        avatarImg = await doc.embedPng(avatarBytes);
      } else if (fs.existsSync(avatarJpg)) {
        const avatarBytes = fs.readFileSync(avatarJpg);
        avatarImg = await doc.embedJpg(avatarBytes);
      }
    }
  } catch (e) {
    console.warn('Could not embed avatar photo:', e);
  }

  // ==========================================
  // PAGE 1: FRONT SIDE
  // ==========================================
  const page1 = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Watermark (circular seal in center background)
  if (watermarkImg) {
    page1.drawImage(watermarkImg, {
      x: 160,
      y: 0,
      width: 400,
      height: 480,
      opacity: 1,
    });
  }

  // BV Logo top left (sits directly on top of divider line y=297)
  if (logoImg) {
    page1.drawImage(logoImg, {
      x: 20,
      y: 298.5,
      width: 125,
      height: 172,
    });
  }

  // Person Photo top right (sits directly on top of divider line y=297)
  if (avatarImg) {
    page1.drawImage(avatarImg, {
      x: 582,
      y: 298.5,
      width: 156,
      height: 170,
    });
  }

  // Divider Line 1 (top): y=297
  page1.drawLine({
    start: { x: 0, y: 297 },
    end: { x: PAGE_WIDTH, y: 297 },
    thickness: 3.5,
    color: black,
  });

  // Divider Line 2 (footer top): y=100.5
  page1.drawLine({
    start: { x: 0, y: 100.5 },
    end: { x: PAGE_WIDTH, y: 100.5 },
    thickness: 4.5,
    color: black,
  });

  // Divider Line 3 (footer middle): y=49.5
  page1.drawLine({
    start: { x: 0, y: 49.5 },
    end: { x: PAGE_WIDTH, y: 49.5 },
    thickness: 2.5,
    color: black,
  });

  // Header Details (Beside BV Logo)
  const headerX = 163.5;
  const certNo = data.certificateNo || '148-2026-090235-EN';
  const refNo = data.refNo || 'JUB.IVS.26.08.50021';
  const issuedDate = formatDate(data.issuedOn);
  const validUntilDate = formatDate(data.validUntil || '2027-08-08');

  // Certificate No
  drawBoldText(
    page1,
    'Certificate No:',
    {
      x: headerX,
      y: 441.75,
      size: 22,
      font: helveticaBold,
      color: black,
    },
    0.65
  );

  drawBoldText(
    page1,
    certNo,
    {
      x: headerX,
      y: 408.0,
      size: 22,
      font: helveticaBold,
      color: certColor,
    },
    0.65
  );

  // Ref.#
  drawBoldText(
    page1,
    `Ref.#  ${refNo}`,
    {
      x: headerX,
      y: 373.5,
      size: 22,
      font: helveticaBold,
      color: black,
    },
    0.65
  );

  // Issued On
  drawBoldText(
    page1,
    `Issued On:   ${issuedDate}`,
    {
      x: headerX,
      y: 339.0,
      size: 22,
      font: helveticaBold,
      color: black,
    },
    0.65
  );

  // Valid until
  drawBoldText(
    page1,
    `Valid until:  ${validUntilDate}`,
    {
      x: headerX,
      y: 304.5,
      size: 22,
      font: helveticaBold,
      color: black,
    },
    0.65
  );

  // Middle Details (Person info)
  const bodyX = 36.0;
  const nameUpper = (data.name || 'ZAHANGIR CHAKLADER').toUpperCase();
  const idValue = data.peopleId || data.hsseProfileId || '2631733033';
  const companyValue = (data.company || 'PRIVATE').toUpperCase();
  const issuanceValue = data.issuanceNo || '1';

  // Name
  drawBoldText(
    page1,
    'Name: ',
    {
      x: bodyX,
      y: 261.0,
      size: 25,
      font: helveticaBold,
      color: black,
    },
    0.75
  );

  let nameSize = 25;
  while (helveticaBold.widthOfTextAtSize(nameUpper, nameSize) > 590 && nameSize > 16) {
    nameSize -= 0.5;
  }

  drawBoldText(
    page1,
    nameUpper,
    {
      x: bodyX + 90,
      y: 261.0,
      size: nameSize,
      font: helveticaBold,
      color: royalBlue,
    },
    0.75
  );

  // ID No
  drawBoldText(
    page1,
    `ID No:  ${idValue}`,
    {
      x: bodyX,
      y: 213.0,
      size: 25,
      font: helveticaBold,
      color: black,
    },
    0.75
  );

  // Company
  drawBoldText(
    page1,
    `Company:   ${companyValue}`,
    {
      x: bodyX,
      y: 164.25,
      size: 25,
      font: helveticaBold,
      color: black,
    },
    0.75
  );

  // Issuance No
  drawBoldText(
    page1,
    `Issuance No.:  ${issuanceValue}`,
    {
      x: bodyX,
      y: 124.5,
      size: 25,
      font: helveticaBold,
      color: black,
    },
    0.75
  );

  // Footer Section
  const noticeLine1 =
    'This certifies that the above mentioned person has successfully';
  const noticeLine2 =
    'completed the BV Safety Course Refer to backside for details.';
  const enquiriesText =
    'For any enquiries: Tel. 013 347 9683';
  const emailText = 'bv.jubail.admin@bureauveritas.com';

  drawBoldText(
    page1,
    noticeLine1,
    {
      x: (PAGE_WIDTH - helveticaBold.widthOfTextAtSize(noticeLine1, 24)) / 2,
      y: 78.0,
      size: 24,
      font: helveticaBold,
      color: black,
    },
    0.55
  );

  drawBoldText(
    page1,
    noticeLine2,
    {
      x: (PAGE_WIDTH - helveticaBold.widthOfTextAtSize(noticeLine2, 24)) / 2,
      y: 57.75,
      size: 24,
      font: helveticaBold,
      color: black,
    },
    0.55
  );

  drawBoldText(
    page1,
    enquiriesText,
    {
      x: (PAGE_WIDTH - helveticaBold.widthOfTextAtSize(enquiriesText, 22)) / 2,
      y: 30.0,
      size: 22,
      font: helveticaBold,
      color: black,
    },
    0.5
  );

  drawBoldText(
    page1,
    emailText,
    {
      x: (PAGE_WIDTH - helveticaBold.widthOfTextAtSize(emailText, 22)) / 2,
      y: 11.0,
      size: 22,
      font: helveticaBold,
      color: black,
    },
    0.5
  );


  // ==========================================
  // PAGE 2: BACK SIDE (WITH QR CODE)
  // ==========================================
  const page2 = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Target URL that QR Code opens (Public verification page)
  const redirectUrl = `${baseUrl.replace(/\/$/, '')}/record/${data.uuid}`;

  // Generate QR Code as DataURL / Buffer
  const qrPngBuffer = await QRCode.toBuffer(redirectUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 800,
  });
  const qrImage = await doc.embedPng(qrPngBuffer);

  // Draw QR code on left side
  page2.drawImage(qrImage, {
    x: 39.0,
    y: 103.5,
    width: 315.0,
    height: 315.0,
  });

  // Right side Details
  const rightX = 393.0;

  page2.drawText('CERTIFICATE NO.:', {
    x: rightX,
    y: 414.0,
    size: 18,
    font: helveticaBold,
    color: black,
  });

  page2.drawText(certNo, {
    x: rightX,
    y: 390.75,
    size: 20.5,
    font: helveticaBold,
    color: bkCertColor,
  });

  const courseType = (data.courseType || 'WELDER 3G 4G').toUpperCase();
  page2.drawText(`TYPE: ${courseType}`, {
    x: rightX,
    y: 356.25,
    size: 17,
    font: helveticaBold,
    color: black,
  });

  page2.drawText(`MODEL: ${data.model || 'N/A'}`, {
    x: rightX,
    y: 334.5,
    size: 17,
    font: helveticaBold,
    color: black,
  });

  const trainer = (data.trainer || 'ZEESHAN KHAN').toUpperCase();
  page2.drawText(`TRAINER: ${trainer}`, {
    x: rightX,
    y: 312.0,
    size: 17,
    font: helveticaBold,
    color: black,
  });

  const loc = (data.location || 'JUBAIL').toUpperCase();
  page2.drawText(`LOCATION. ${loc}`, {
    x: rightX,
    y: 283.5,
    size: 17,
    font: helveticaBold,
    color: black,
  });

  // Disclaimer text (10 lines matching generate-certificate.pdf)
  const disclaimer = [
    'This card does not release the operator from his duty',
    'obligation with regards to the safehandling, perfomance',
    'in operation and/or reliability of the listed equipment.',
    'Any person not part of the contract pursuant which this',
    'card is delivered may not assert a claim against Pueau',
    'Veritas for any lability arising out of errors or ommissione',
    'which may be contained in said card, or for errors of',
    'judgment, faull or negligence committed by personnel of',
    'the society or of its Agents in est. or issuance of this card,',
    'and in connection with any activities for which it may ',
    'provide. SAG lcense is client responsibility.',
  ];

  let disclaimerY = 226.0;
  for (const line of disclaimer) {
    page2.drawText(line, {
      x: rightX,
      y: disclaimerY,
      size: 11,
      font: helveticaBold,
      color: black,
    });
    disclaimerY -= 15.0;
  }

  // Red verification footer
  const verifyPrefix = 'Scan QR code to verify this certificate at ';
  const verifyDomain = 'https://e-certificates.bureauveritas.com';

  page2.drawText(verifyPrefix, {
    x: 45.5,
    y: 51.75,
    size: 15.5,
    font: helveticaBold,
    color: redColor,
  });

  const prefixWidth = helveticaBold.widthOfTextAtSize(verifyPrefix, 14.5);
  page2.drawText(verifyDomain, {
    x: 65.5 + prefixWidth,
    y: 51.75,
    size: 15.5,
    font: helveticaBold,
    color: redColor,
  });

  // Underline red link
  const domainWidth = helveticaBold.widthOfTextAtSize(verifyDomain, 15.5);
  page2.drawLine({
    start: { x: 65.5 + prefixWidth, y: 49.5 },
    end: { x: 65.5 + prefixWidth + domainWidth, y: 49.5 },
    thickness: 1.4,
    color: redColor,
  });

  // Bottom line across page 2
  page2.drawLine({
    start: { x: 65, y: 16.5 },
    end: { x: PAGE_WIDTH, y: 16.5 },
    thickness: 1.5,
    color: black,
  });

  return await doc.save();
}
