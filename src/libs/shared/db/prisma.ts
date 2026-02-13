import { PrismaClient } from '@generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../config/index.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({
    adapter,
    log: config.isDev
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (!config.isProd) {
  globalForPrisma.prisma = prisma;
}

export async function disconnectDb(): Promise<void> {
  await prisma.$disconnect();
}
