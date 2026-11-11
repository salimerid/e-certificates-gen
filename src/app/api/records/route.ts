import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10));
    const skip = (page - 1) * limit;

    const where: any = q
      ? {
          OR: [
            { name: { contains: q } },
            { hsseProfileId: { contains: q } },
            { peopleId: { contains: q } },
            { site: { contains: q } },
            { jobTitle: { contains: q } },
            { department: { contains: q } },
            { certificateNo: { contains: q } },
          ],
        }
      : {};

    const [total, records] = await Promise.all([
      prisma.personRecord.count({ where }),
      prisma.personRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          _count: {
            select: { trainings: true },
          },
          trainings: true,
        },
      }),
    ]);

    return NextResponse.json({
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch records error:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const currentYear = new Date().getFullYear();
    const randomCertNum = Math.floor(100000 + Math.random() * 900000);
    const randomRefNum = Math.floor(10000 + Math.random() * 90000);

    const record = await prisma.personRecord.create({
      data: {
        uuid: randomUUID(),
        name: name.trim(),
        hsseProfileId: hsse_profile_id?.trim() || null,
        peopleId: people_id?.trim() || null,
        site: site?.trim() || null,
        department: department?.trim() || null,
        jobTitle: job_title?.trim() || null,
        roleScope: role_scope?.trim() || null,
        peopleType: people_type?.trim() || null,
        joiningDate: joining_date ? new Date(joining_date) : null,
        photoUrl: photo_url || null,
        certificateNo:
          certificate_no?.trim() || `148-${currentYear}-${randomCertNum}-EN`,
        refNo: ref_no?.trim() || `JUB.IVS.26.08.${randomRefNum}`,
        issuedOn: issued_on ? new Date(issued_on) : new Date(),
        validUntil: valid_until
          ? new Date(valid_until)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        company: company?.trim() || 'TBC CONSTRUCTION',
        issuanceNo: issuance_no?.trim() || '1',
        courseType:
          course_type?.trim() ||
          trainings[0]?.topic?.trim() ||
          'WELDER 3G 4G',
        model: model?.trim() || 'N/A',
        trainer: trainer?.trim() || 'ZEESHAN KHAN',
        location: location?.trim() || site?.trim() || 'JUBAIL',
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

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Create record error:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
