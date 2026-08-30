import type { AppData } from "@/lib/data/mock";
import { mockData } from "@/lib/data/mock";

/**
 * Data access contract used by the UI store.
 *
 * The UI layer never talks to Prisma (or any ORM) directly — it consumes this
 * interface. The store currently loads through the mock repository because the app
 * builds as a static export (no server runtime, and Prisma cannot be bundled into
 * browser chunks).
 *
 * FUTURE — live database:
 * When the app is deployed to a serverless/server runtime with DATABASE_URL set, the
 * store should receive server-fetched data instead of calling this client-side. At that
 * point, `lib/services/prisma-repository.ts` (which implements the same Repository
 * contract against Prisma) becomes the provider, and this module is not needed by the
 * browser bundle.
 */
export interface Repository {
  loadAll(): Promise<AppData>;
}

export const mockRepository: Repository = {
  loadAll: async () => mockData,
};

export async function getRepository(): Promise<Repository> {
  return mockRepository;
}
