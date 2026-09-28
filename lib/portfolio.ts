export interface PortfolioProject {
  id?: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  variant?: "blue" | null;
}

/** Shown while the database is unset, unreachable or empty; also the admin's "load starters" data. */
export const defaultProjects: PortfolioProject[] = [
  {
    category: "BUSINESS MANAGEMENT SYSTEM",
    title: "FLEEVE Garage Platform",
    description:
      "A unified workshop workspace for customers, vehicles, job cards, technicians, inspections and bookings.",
    tags: ["Laravel", "MySQL", "JavaScript"],
  },
  {
    category: "WEB DESIGN & DEVELOPMENT",
    title: "Meridian Consulting Site",
    description:
      "A fast, SEO-ready marketing site for a consulting firm, built around clear calls to action and lead capture.",
    tags: ["Responsive UI", "Performance", "SEO"],
    variant: "blue",
  },
];

/** Validates untrusted input; returns the clean project or null. */
export function parseProject(body: unknown): PortfolioProject | null {
  const b = body as Partial<Record<keyof PortfolioProject, unknown>> | null;
  if (!b || typeof b !== "object") return null;
  const str = (v: unknown, max: number) =>
    typeof v === "string" && v.trim() && v.length <= max ? v.trim() : null;
  const category = str(b.category, 120);
  const title = str(b.title, 160);
  const description = str(b.description, 2000);
  const tags = Array.isArray(b.tags)
    ? b.tags.map((t) => str(t, 40)).filter((t): t is string => !!t).slice(0, 12)
    : null;
  if (!category || !title || !description || !tags) return null;
  return { category, title, description, tags, variant: b.variant === "blue" ? "blue" : null };
}
