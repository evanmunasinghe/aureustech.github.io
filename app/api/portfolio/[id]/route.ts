import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { parseProject } from "@/lib/portfolio";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = parseProject(await req.json().catch(() => null));
  if (!data) return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  const { id } = await params;
  try {
    return NextResponse.json(
      await prisma.portfolioProject.update({ where: { id }, data: data })
    );
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.portfolioProject.deleteMany({ where: { id } });
  return NextResponse.json({ ok: true });
}
