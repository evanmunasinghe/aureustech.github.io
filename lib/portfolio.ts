export interface PortfolioProject {
  number: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  variant?: "blue";
}

export const projects: PortfolioProject[] = [
  {
    number: "01",
    category: "BUSINESS MANAGEMENT SYSTEM",
    title: "FLEEVE Garage Platform",
    description:
      "A unified workshop workspace for customers, vehicles, job cards, technicians, inspections and bookings.",
    tags: ["Laravel", "MySQL", "JavaScript"],
  },
  {
    number: "02",
    category: "WEB DESIGN & DEVELOPMENT",
    title: "Meridian Consulting Site",
    description:
      "A fast, SEO-ready marketing site for a consulting firm, built around clear calls to action and lead capture.",
    tags: ["Responsive UI", "Performance", "SEO"],
    variant: "blue",
  },
];
