import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, parseUserInput, PUBLIC_USER, sessionUser } from "@/lib/auth/server";

const iso = <T extends { createdAt: Date }>(u: T) => ({ ...u, createdAt: u.createdAt.toISOString() });

// Staff see everyone; clients see the team and themselves (enough to show names, not other clients).
export async function GET() {
  const me = await sessionUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await prisma.user.findMany({
    where: me.role === "CLIENT" ? { OR: [{ role: { not: "CLIENT" } }, { id: me.id }] } : undefined,
    select: PUBLIC_USER,
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(users.map(iso));
}

export async function POST(req: Request) {
  if ((await sessionUser())?.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Only the super admin can add users." }, { status: 403 });
  }
  const input = parseUserInput(await req.json().catch(() => null), true);
  if (typeof input === "string") return NextResponse.json({ error: input }, { status: 400 });
  if (await prisma.user.findUnique({ where: { email: input.email } })) {
    return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
  }
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, role: input.role, passwordHash: hashPassword(input.password!) },
    select: PUBLIC_USER,
  });
  return NextResponse.json(iso(user), { status: 201 });
}
