import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Automatically sanitize any accidental linebreaks or whitespace from environment variable
const rawUrl = process.env.DATABASE_URL;
const cleanUrl = rawUrl ? rawUrl.replace(/[\r\n\t ]+/g, '') : undefined;
if (cleanUrl) {
  process.env.DATABASE_URL = cleanUrl;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: cleanUrl ? { db: { url: cleanUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

globalForPrisma.prisma = prisma;
