import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create or update admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@tbc.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@tbc.com',
      password: hashedPassword,
      name: 'TBC Administrator',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hsse.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@hsse.com',
      password: hashedPassword,
      name: 'TBC Admin',
    },
  });
  console.log('Admin users seeded: admin@tbc.com and admin@hsse.com');

  // 2. Sample records
  const people = [
    {
      uuid: '58ef6dfa-3ff6-4d0a-9682-bcc38cf2836e',
      name: 'MD IKRAM HUSSAIN',
      hsseProfileId: '85320',
      peopleId: '2621620588',
      site: 'Shaqra Wind',
      department: 'Construction',
      jobTitle: 'HELPER',
      roleScope: 'Civil',
      peopleType: 'Subcontractor',
      joiningDate: new Date('2026-03-31'),
      certificateNo: '148-2026-090235-EN',
      refNo: 'JUB.IVS.26.08.50021',
      issuedOn: new Date('2026-08-09'),
      validUntil: new Date('2027-08-08'),
      company: 'PRIVATE',
      issuanceNo: '1',
      courseType: 'WELDER 3G 4G',
      model: 'N/A',
      trainer: 'ZEESHAN KHAN',
      location: 'JUBAIL',
      photoUrl: '/images/sample-avatar.jpg',
      trainings: [
        {
          topic: 'Site HSSE Induction - Employee',
          trainingSite: 'Shaqra Wind Construction',
          fromDate: new Date('2026-03-31'),
          toDate: new Date('2026-03-31'),
          durationHours: '2.00',
          trainingDrive: 'TBC Mandatory Requirement',
          methodology: 'Classroom',
          assessmentScore: '—',
          recertificationDate: null,
        },
      ],
    },
    {
      uuid: '6a83d47f-1d89-4bc2-a192-37eb8329ef01',
      name: 'MD MEHEDI HASAN',
      hsseProfileId: '85318',
      peopleId: '2621620589',
      site: 'Shaqra Wind',
      department: 'Construction',
      jobTitle: 'HELPER',
      roleScope: 'Civil',
      peopleType: 'Subcontractor',
      joiningDate: new Date('2026-03-31'),
      certificateNo: '148-2026-090236-EN',
      refNo: 'JUB.IVS.26.08.50022',
      issuedOn: new Date('2026-08-09'),
      validUntil: new Date('2027-08-08'),
      company: 'PRIVATE',
      issuanceNo: '1',
      courseType: 'HSSE INDUCTION',
      model: 'N/A',
      trainer: 'ZEESHAN KHAN',
      location: 'JUBAIL',
      trainings: [
        {
          topic: 'Site HSSE Induction - Employee',
          trainingSite: 'Shaqra Wind Construction',
          fromDate: new Date('2026-03-31'),
          toDate: new Date('2026-03-31'),
          durationHours: '2.00',
          trainingDrive: 'TBC Mandatory Requirement',
          methodology: 'Classroom',
          assessmentScore: '85.00',
          recertificationDate: new Date('2027-03-31'),
        },
      ],
    },
    {
      uuid: '7b94e580-2e9a-4cd3-b203-48fc9430f012',
      name: 'MOHAMMAD EKRAMUL HOQ',
      hsseProfileId: '85316',
      peopleId: '2621620590',
      site: 'Shaqra Wind',
      department: 'Mechanical',
      jobTitle: 'HELPER',
      roleScope: 'Civil',
      peopleType: 'Subcontractor',
      joiningDate: new Date('2026-04-01'),
      certificateNo: '148-2026-090237-EN',
      refNo: 'JUB.IVS.26.08.50023',
      issuedOn: new Date('2026-08-09'),
      validUntil: new Date('2027-08-08'),
      company: 'PRIVATE',
      issuanceNo: '1',
      courseType: 'WORKING AT HEIGHT',
      model: 'N/A',
      trainer: 'ZEESHAN KHAN',
      location: 'JUBAIL',
      trainings: [
        {
          topic: 'Working at Height & Fall Protection',
          trainingSite: 'Shaqra Wind Construction',
          fromDate: new Date('2026-04-01'),
          toDate: new Date('2026-04-01'),
          durationHours: '4.00',
          trainingDrive: 'TBC Mandatory Requirement',
          methodology: 'Classroom & Practical',
          assessmentScore: '90.00',
          recertificationDate: new Date('2027-04-01'),
        },
      ],
    },
    {
      uuid: '8ca5f691-3fab-4de4-c314-59ad0541a123',
      name: 'MD PIARUL ISLAM',
      hsseProfileId: '85314',
      peopleId: '2621620591',
      site: 'Shaqra Wind',
      department: 'Construction',
      jobTitle: 'HELPER',
      roleScope: 'Civil',
      peopleType: 'Subcontractor',
      joiningDate: new Date('2026-04-01'),
      certificateNo: '148-2026-090238-EN',
      refNo: 'JUB.IVS.26.08.50024',
      issuedOn: new Date('2026-08-09'),
      validUntil: new Date('2027-08-08'),
      company: 'PRIVATE',
      issuanceNo: '1',
      courseType: 'SCAFFOLDING SAFETY',
      model: 'N/A',
      trainer: 'ZEESHAN KHAN',
      location: 'JUBAIL',
      trainings: [
        {
          topic: 'Scaffolding Safety Awareness',
          trainingSite: 'Shaqra Wind Construction',
          fromDate: new Date('2026-04-01'),
          toDate: new Date('2026-04-01'),
          durationHours: '3.00',
          trainingDrive: 'TBC Mandatory Requirement',
          methodology: 'Classroom',
          assessmentScore: '88.00',
          recertificationDate: new Date('2027-04-01'),
        },
      ],
    },
    {
      uuid: '9db6a702-4abc-4ef5-d425-60be1652b234',
      name: 'MD ASHIKUR RAHMAN SHEIKH',
      hsseProfileId: '85313',
      peopleId: '2621620592',
      site: 'Shaqra Wind',
      department: 'Construction',
      jobTitle: 'HELPER',
      roleScope: 'Civil',
      peopleType: 'Subcontractor',
      joiningDate: new Date('2026-04-02'),
      certificateNo: '148-2026-090239-EN',
      refNo: 'JUB.IVS.26.08.50025',
      issuedOn: new Date('2026-08-09'),
      validUntil: new Date('2027-08-08'),
      company: 'PRIVATE',
      issuanceNo: '1',
      courseType: 'FIRE SAFETY & PREVENTION',
      model: 'N/A',
      trainer: 'ZEESHAN KHAN',
      location: 'JUBAIL',
      trainings: [
        {
          topic: 'Basic Fire Fighting & Prevention',
          trainingSite: 'Shaqra Wind Construction',
          fromDate: new Date('2026-04-02'),
          toDate: new Date('2026-04-02'),
          durationHours: '2.50',
          trainingDrive: 'TBC Mandatory Requirement',
          methodology: 'Workshop',
          assessmentScore: '92.00',
          recertificationDate: new Date('2027-04-02'),
        },
      ],
    },
    {
      uuid: 'ae07b813-5bcd-4fa6-e536-71cf2763c345',
      name: 'MD MAFIJUL MOLLA',
      hsseProfileId: '85309',
      peopleId: '2621620593',
      site: 'Shaqra Wind',
      department: 'Civil',
      jobTitle: 'STEEL FIXER',
      roleScope: 'Civil',
      peopleType: 'Subcontractor',
      joiningDate: new Date('2026-04-05'),
      certificateNo: '148-2026-090240-EN',
      refNo: 'JUB.IVS.26.08.50026',
      issuedOn: new Date('2026-08-09'),
      validUntil: new Date('2027-08-08'),
      company: 'PRIVATE',
      issuanceNo: '1',
      courseType: 'STEEL FIXING & REBAR SAFETY',
      model: 'N/A',
      trainer: 'ZEESHAN KHAN',
      location: 'JUBAIL',
      trainings: [
        {
          topic: 'Rebar & Steel Fixing Safety Measures',
          trainingSite: 'Shaqra Wind Construction',
          fromDate: new Date('2026-04-05'),
          toDate: new Date('2026-04-05'),
          durationHours: '3.00',
          trainingDrive: 'TBC Mandatory Requirement',
          methodology: 'Toolbox Talk',
          assessmentScore: '95.00',
          recertificationDate: new Date('2027-04-05'),
        },
      ],
    },
  ];

  for (const person of people) {
    const { trainings, ...personData } = person;
    const existing = await prisma.personRecord.findUnique({
      where: { uuid: person.uuid },
    });

    if (!existing) {
      await prisma.personRecord.create({
        data: {
          ...personData,
          trainings: {
            create: trainings,
          },
        },
      });
      console.log(`Created person: ${person.name}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
