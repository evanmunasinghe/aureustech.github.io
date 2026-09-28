import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { parseProject } from "@/lib/portfolio";

export async function GET() {
  const rows = await prisma.portfolioProject.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = parseProject(await req.json().catch(() => null));
  if (!data) return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  const row = await prisma.portfolioProject.create({ data: data });
  return NextResponse.json(row, { status: 201 });
}
