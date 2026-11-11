import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasDbUrl = !!process.env.DATABASE_URL;
  const dbUrlMasked = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/:([^:@]{3})[^:@]*@/, ':***@')
    : 'NOT_SET';
  const hasJwtSecret = !!process.env.JWT_SECRET;

  try {
    // Test database connection
    const userCount = await prisma.user.count();

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      userCount,
      hasDbUrl,
      dbUrlMasked,
      hasJwtSecret,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        database: 'failed_to_connect',
        errorMessage: error?.message || String(error),
        errorCode: error?.code,
        hasDbUrl,
        dbUrlMasked,
        hasJwtSecret,
        hint: !hasDbUrl
          ? 'DATABASE_URL environment variable is missing on Vercel. Add it in Vercel Project Settings > Environment Variables.'
          : 'Database connection failed. Ensure your database allows connections and credentials are valid.',
      },
      { status: 500 }
    );
  }
}
