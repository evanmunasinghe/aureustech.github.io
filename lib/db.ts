import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Database access layer.
 *
 * CONNECTION STRING:
 * Set the connection string in your environment before any server-side code runs:
 *
 *   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME?ssl-mode=required"
 *
 * The connection string must be a URL, not a `mysql` shell command. For example, a
 * TiDB Cloud "connect" snippet like `mysql -u user -h host -P 4000 -D db -p'pass'`
 * becomes: `mysql://user:pass@host:4000/db?ssl-mode=required`.
 *
 * 1. Development: add it to `.env` (already loaded by prisma.config.ts for the CLI).
 * 2. Deployment: set it as an environment variable on your host (Vercel, Railway, etc.).
 *
 * NOTE ON STATIC EXPORT:
 * This app currently builds with `output: "export"`, so no server runtime exists and
 * Prisma cannot be used on pages yet. The services in `lib/services` therefore default
 * to mock data. When you move to a serverless/server deployment and set `DATABASE_URL`,
 * serve the data from `lib/services/prisma-repository.ts` (same Repository contract) and
 * the UI keeps working unchanged.
 */

export const DATABASE_URL = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  if (!DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env or set it on the deployment environment."
    );
  }
  const adapter = new PrismaMariaDb(DATABASE_URL);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
