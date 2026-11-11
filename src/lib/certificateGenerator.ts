import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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

export async function generateCertificatePdf(
  data: CertificateData,
  baseUrl: string = 'http://localhost:3000'
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 755.25;
  const PAGE_HEIGHT = 475.5;

  // Colors
  const black = rgb(0.08, 0.08, 0.08);
  const darkBlue = rgb(0.12, 0.25, 0.58); // #1e4094
  const redText = rgb(0.85, 0.1, 0.1);
  const darkGray = rgb(0.25, 0.25, 0.25);

  // Load static assets
  const publicDir = path.join(process.cwd(), 'public');
  let logoImg: any = null;
  let watermarkImg: any = null;
  let avatarImg: any = null;

  try {
    const logoBytes = fs.readFileSync(path.join(publicDir, 'images/bv-logo.png'));
    logoImg = await doc.embedPng(logoBytes);
  } catch (e) {
    console.warn('Could not load bv-logo.png:', e);
  }

  try {
    const watermarkBytes = fs.readFileSync(path.join(publicDir, 'images/bv-watermark.png'));
    watermarkImg = await doc.embedPng(watermarkBytes);
  } catch (e) {
    console.warn('Could not load bv-watermark.png:', e);
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

  // Watermark in center background
  if (watermarkImg) {
    const wmWidth = 240;
    const wmHeight = 320;
    page1.drawImage(watermarkImg, {
      x: (PAGE_WIDTH - wmWidth) / 2 + 30,
      y: (PAGE_HEIGHT - wmHeight) / 2 - 20,
      width: wmWidth,
      height: wmHeight,
      opacity: 0.16,
    });
  }

  // BV Logo top left
  if (logoImg) {
    page1.drawImage(logoImg, {
      x: 32,
      y: PAGE_HEIGHT - 170,
      width: 110,
      height: 145,
    });
  }

  // Header Details (Beside BV Logo)
  const headerX = 165;
  let topY = PAGE_HEIGHT - 48;

  // Certificate No
  page1.drawText('Certificate No:', {
    x: headerX,
    y: topY,
    size: 20,
    font: helveticaBold,
    color: black,
  });

  const certNo = data.certificateNo || '148-2026-090235-EN';
  page1.drawText(certNo, {
    x: headerX,
    y: topY - 32,
    size: 23,
    font: helveticaBold,
    color: darkBlue,
  });

  // Ref.#
  topY -= 62;
  const refNo = data.refNo || 'JUB.IVS.26.08.50021';
  page1.drawText(`Ref.#  ${refNo}`, {
    x: headerX,
    y: topY,
    size: 19,
    font: helveticaBold,
    color: black,
  });

  // Issued On
  topY -= 28;
  page1.drawText(`Issued On:   ${formatDate(data.issuedOn)}`, {
    x: headerX,
    y: topY,
    size: 19,
    font: helveticaBold,
    color: black,
  });

  // Valid until
  topY -= 28;
  page1.drawText(`Valid until:  ${formatDate(data.validUntil || '2027-08-08')}`, {
    x: headerX,
    y: topY,
    size: 19,
    font: helveticaBold,
    color: black,
  });

  // Person Photo top right
  if (avatarImg) {
    const photoWidth = 150;
    const photoHeight = 175;
    page1.drawImage(avatarImg, {
      x: PAGE_WIDTH - photoWidth - 30,
      y: PAGE_HEIGHT - photoHeight - 20,
      width: photoWidth,
      height: photoHeight,
    });
  }

  // Thick Horizontal Divider Line
  const lineY = PAGE_HEIGHT - 195;
  page1.drawLine({
    start: { x: 0, y: lineY },
    end: { x: PAGE_WIDTH, y: lineY },
    thickness: 4,
    color: black,
  });

  // Person Details
  let bodyY = lineY - 42;
  const bodyX = 35;

  // Name
  page1.drawText('Name: ', {
    x: bodyX,
    y: bodyY,
    size: 25,
    font: helveticaBold,
    color: black,
  });
  page1.drawText((data.name || 'MD IKRAM HUSSAIN').toUpperCase(), {
    x: bodyX + 95,
    y: bodyY,
    size: 25,
    font: helveticaBold,
    color: darkBlue,
  });

  // ID No
  bodyY -= 42;
  const idValue = data.peopleId || data.hsseProfileId || '2631733033';
  page1.drawText(`ID No:  ${idValue}`, {
    x: bodyX,
    y: bodyY,
    size: 25,
    font: helveticaBold,
    color: black,
  });

  // Company
  bodyY -= 42;
  const companyValue = data.company || 'TBC CONSTRUCTION';
  page1.drawText(`Company:   ${companyValue.toUpperCase()}`, {
    x: bodyX,
    y: bodyY,
    size: 25,
    font: helveticaBold,
    color: black,
  });

  // Issuance No
  bodyY -= 36;
  const issuanceValue = data.issuanceNo || '1';
  page1.drawText(`Issuance No.:  ${issuanceValue}`, {
    x: bodyX,
    y: bodyY,
    size: 21,
    font: helveticaBold,
    color: black,
  });

  // Bottom Notice Box / Footer
  const footerLineY = 82;
  page1.drawLine({
    start: { x: 0, y: footerLineY },
    end: { x: PAGE_WIDTH, y: footerLineY },
    thickness: 3.5,
    color: black,
  });

  // Footer text
  const noticeLine1 =
    'This certifies that the above mentioned person has successfully';
  const noticeLine2 =
    'completed the BV Safety Course Refer to backside for details.';
  const enquiriesText =
    'For any enquiries: Tel. 013 347 9683';
  const emailText = 'bv.jubail.admin@bureauveritas.com';

  page1.drawText(noticeLine1, {
    x: (PAGE_WIDTH - helveticaBold.widthOfTextAtSize(noticeLine1, 16)) / 2,
    y: footerLineY - 20,
    size: 16,
    font: helveticaBold,
    color: black,
  });

  page1.drawText(noticeLine2, {
    x: (PAGE_WIDTH - helveticaBold.widthOfTextAtSize(noticeLine2, 16)) / 2,
    y: footerLineY - 38,
    size: 16,
    font: helveticaBold,
    color: black,
  });

  page1.drawText(enquiriesText, {
    x: (PAGE_WIDTH - helveticaBold.widthOfTextAtSize(enquiriesText, 14.5)) / 2,
    y: footerLineY - 56,
    size: 14.5,
    font: helveticaBold,
    color: black,
  });

  page1.drawText(emailText, {
    x: (PAGE_WIDTH - helveticaBold.widthOfTextAtSize(emailText, 14.5)) / 2,
    y: footerLineY - 73,
    size: 14.5,
    font: helveticaBold,
    color: black,
  });


  // ==========================================
  // PAGE 2: BACK SIDE (WITH QR CODE)
  // ==========================================
  const page2 = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Target URL that QR Code opens (Public details page without login)
  const redirectUrl = `${baseUrl.replace(/\/$/, '')}/record/${data.uuid}`;

  // Generate QR Code as DataURL / Buffer
  const qrPngBuffer = await QRCode.toBuffer(redirectUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 600,
  });
  const qrImage = await doc.embedPng(qrPngBuffer);

  // Draw QR code on left side
  const qrSize = 310;
  page2.drawImage(qrImage, {
    x: 45,
    y: PAGE_HEIGHT - qrSize - 40,
    width: qrSize,
    height: qrSize,
  });

  // Right side Details
  const rightX = 390;
  let p2Y = PAGE_HEIGHT - 55;

  page2.drawText('CERTIFICATE NO.:', {
    x: rightX,
    y: p2Y,
    size: 19,
    font: helveticaBold,
    color: black,
  });

  p2Y -= 30;
  page2.drawText(certNo, {
    x: rightX,
    y: p2Y,
    size: 21,
    font: helveticaBold,
    color: darkBlue,
  });

  p2Y -= 36;
  const courseType = (data.courseType || 'WELDER 3G 4G').toUpperCase();
  page2.drawText(`TYPE: ${courseType}`, {
    x: rightX,
    y: p2Y,
    size: 18,
    font: helveticaBold,
    color: black,
  });

  p2Y -= 26;
  page2.drawText(`MODEL: ${data.model || 'N/A'}`, {
    x: rightX,
    y: p2Y,
    size: 18,
    font: helveticaBold,
    color: black,
  });

  p2Y -= 26;
  const trainer = (data.trainer || 'ZEESHAN KHAN').toUpperCase();
  page2.drawText(`TRAINER: ${trainer}`, {
    x: rightX,
    y: p2Y,
    size: 18,
    font: helveticaBold,
    color: black,
  });

  p2Y -= 26;
  const loc = (data.location || 'JUBAIL').toUpperCase();
  page2.drawText(`LOCATION. ${loc}`, {
    x: rightX,
    y: p2Y,
    size: 18,
    font: helveticaBold,
    color: black,
  });

  // Disclaimer text
  const disclaimer = [
    'This card does not release the operator from his duty obligation',
    'with regards to the safehandling, perfomance in operation',
    'and/or reliability of the listed equipment. Any person not part of',
    'the contract pursuant which this card is delivered may not assert',
    'a claim against Pueau Veritas for any lability arising out of errors',
    'or ommissione which may be contained in said card, or for errors',
    'of judgment, faull or negligence committed by personnel of',
    'the society or of its Agents in est. or issuance of this card, and',
    'in connection with any activities for which it may provide.',
    'SAG lcense is client responsibility.',
  ];

  p2Y -= 32;
  for (const line of disclaimer) {
    page2.drawText(line, {
      x: rightX,
      y: p2Y,
      size: 11.5,
      font: helveticaBold,
      color: black,
    });
    p2Y -= 15.5;
  }

  // Red verification footer
  const verifyPrefix = 'Scan QR code to verify this certificate at ';
  const verifyUrlText = redirectUrl;

  const p2FooterY = 46;
  page2.drawText(verifyPrefix, {
    x: 45,
    y: p2FooterY,
    size: 15,
    font: helveticaBold,
    color: redText,
  });

  const prefixWidth = helveticaBold.widthOfTextAtSize(verifyPrefix, 15);
  page2.drawText(verifyUrlText, {
    x: 45 + prefixWidth,
    y: p2FooterY,
    size: 15,
    font: helveticaBold,
    color: redText,
  });

  // Underline red link
  const urlWidth = helveticaBold.widthOfTextAtSize(verifyUrlText, 15);
  page2.drawLine({
    start: { x: 45 + prefixWidth, y: p2FooterY - 2 },
    end: { x: 45 + prefixWidth + urlWidth, y: p2FooterY - 2 },
    thickness: 1.2,
    color: redText,
  });

  // Bottom line across page 2
  page2.drawLine({
    start: { x: 50, y: 18 },
    end: { x: PAGE_WIDTH - 50, y: 18 },
    thickness: 2,
    color: black,
  });

  return await doc.save();
}
