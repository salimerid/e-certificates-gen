import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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

    return NextResponse.json({ record });
  } catch (error) {
    console.error('Get record error:', error);
    return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      hsse_profile_id,
      people_id,
      site,
      department,
      job_title,
      role_scope,
      people_type,
      joining_date,
      photo_url,
      certificate_no,
      ref_no,
      issued_on,
      valid_until,
      company,
      issuance_no,
      course_type,
      model,
      trainer,
      location,
      trainings = [],
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Delete existing trainings and re-create updated list in transaction
    const updated = await prisma.$transaction(async (tx) => {
      await tx.trainingRecord.deleteMany({
        where: { personId: numId },
      });

      return await tx.personRecord.update({
        where: { id: numId },
        data: {
          name: name.trim(),
          hsseProfileId: hsse_profile_id?.trim() || null,
          peopleId: people_id?.trim() || null,
          site: site?.trim() || null,
          department: department?.trim() || null,
          jobTitle: job_title?.trim() || null,
          roleScope: role_scope?.trim() || null,
          peopleType: people_type?.trim() || null,
          joiningDate: joining_date ? new Date(joining_date) : null,
          photoUrl: photo_url !== undefined ? photo_url : undefined,
          certificateNo: certificate_no?.trim() || null,
          refNo: ref_no?.trim() || null,
          issuedOn: issued_on ? new Date(issued_on) : null,
          validUntil: valid_until ? new Date(valid_until) : null,
          company: company?.trim() || 'PRIVATE',
          issuanceNo: issuance_no?.trim() || '1',
          courseType: course_type?.trim() || null,
          model: model?.trim() || 'N/A',
          trainer: trainer?.trim() || 'ZEESHAN KHAN',
          location: location?.trim() || 'JUBAIL',
          trainings: {
            create: trainings
              .filter((t: any) => t.topic && t.topic.trim())
              .map((t: any) => ({
                topic: t.topic.trim(),
                trainingSite: t.training_site?.trim() || null,
                fromDate: t.from_date ? new Date(t.from_date) : null,
                toDate: t.to_date ? new Date(t.to_date) : null,
                durationHours: t.duration_hours ? String(t.duration_hours) : null,
                assessmentScore: t.assessment_score ? String(t.assessment_score) : null,
                trainingDrive: t.training_drive?.trim() || null,
                methodology: t.methodology?.trim() || null,
                recertificationDate: t.recertification_date
                  ? new Date(t.recertification_date)
                  : null,
              })),
          },
        },
        include: {
          trainings: true,
        },
      });
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    console.error('Update record error:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.personRecord.delete({
      where: { id: numId },
    });

    return NextResponse.json({ success: true, message: 'Record deleted' });
  } catch (error) {
    console.error('Delete record error:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
