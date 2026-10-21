import { defaultProjects } from "@/lib/portfolio";
import type { PortfolioProject } from "@/lib/portfolio";

// A cold connection to the remote DB takes 2-4s; anything much past that means
// it is down, so stop making the homepage wait and show the starters instead.
const DB_READ_TIMEOUT_MS = 6000;

async function readProjects(): Promise<PortfolioProject[]> {
  // Dynamic: lib/db throws at import when DATABASE_URL is missing.
  const { prisma } = await import("@/lib/db");
  const rows = await prisma.portfolioProject.findMany({ orderBy: { createdAt: "asc" } });
  if (!rows.length) return defaultProjects;
  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    title: r.title,
    description: r.description,
    tags: r.tags as string[],
    variant: r.variant === "blue" ? "blue" : null,
  }));
}

/** Server-only. Falls back to the starters if the DB is unset, unreachable, slow or empty. */
export async function getProjects(): Promise<PortfolioProject[]> {
  if (!process.env.DATABASE_URL) return defaultProjects;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      readProjects(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`timed out after ${DB_READ_TIMEOUT_MS}ms`)),
          DB_READ_TIMEOUT_MS
        );
      }),
    ]);
  } catch (err) {
    console.error("portfolio: DB read failed, using defaults", err);
    return defaultProjects;
  } finally {
    clearTimeout(timer);
  }
}
