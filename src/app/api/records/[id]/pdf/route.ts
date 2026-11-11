import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCertificatePdf } from '@/lib/certificateGenerator';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const isNum = !isNaN(Number(id));

    const record = await prisma.personRecord.findFirst({
      where: isNum ? { id: parseInt(id, 10) } : { uuid: id },
      include: {
        trainings: true,
      },
    });

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Determine base URL dynamically from request headers
    const url = new URL(request.url);
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
    const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '') || 'http';
    const baseUrl = `${proto}://${host}`;

    const pdfBytes = await generateCertificatePdf(
      {
        uuid: record.uuid,
        name: record.name,
        peopleId: record.peopleId,
        hsseProfileId: record.hsseProfileId,
        certificateNo: record.certificateNo,
        refNo: record.refNo,
        issuedOn: record.issuedOn,
        validUntil: record.validUntil,
        company: record.company,
        issuanceNo: record.issuanceNo,
        courseType: record.courseType || record.trainings[0]?.topic,
        model: record.model,
        trainer: record.trainer,
        location: record.location || record.site,
        photoUrl: record.photoUrl,
      },
      baseUrl
    );

    const filename = `certificate-${record.certificateNo || record.id}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Generate PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate PDF' },
      { status: 500 }
    );
  }
}
