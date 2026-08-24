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
    title: "Corporate Digital Presence",
    description:
      "A polished, conversion-focused company website built to communicate value and invite customer action.",
    tags: ["Responsive UI", "Performance", "SEO"],
    variant: "blue",
  },
];
