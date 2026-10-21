import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, parseUserInput, PUBLIC_USER, sessionUser } from "@/lib/auth/server";

type Ctx = { params: Promise<{ id: string }> };

const forbidden = () => NextResponse.json({ error: "Only the super admin can manage users." }, { status: 403 });

export async function PATCH(req: Request, { params }: Ctx) {
  const me = await sessionUser();
  if (me?.role !== "SUPERADMIN") return forbidden();
  const { id } = await params;
  const input = parseUserInput(await req.json().catch(() => null), false);
  if (typeof input === "string") return NextResponse.json({ error: input }, { status: 400 });
  if (id === me.id && input.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "You can't change your own role." }, { status: 400 });
  }
  const clash = await prisma.user.findUnique({ where: { email: input.email } });
  if (clash && clash.id !== id) return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
  const user = await prisma.user
    .update({
      where: { id },
      data: {
        name: input.name,
        email: input.email,
        role: input.role,
        ...(input.password && { passwordHash: hashPassword(input.password) }),
      },
      select: PUBLIC_USER,
    })
    .catch(() => null);
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ ...user, createdAt: user.createdAt.toISOString() });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const me = await sessionUser();
  if (me?.role !== "SUPERADMIN") return forbidden();
  const { id } = await params;
  if (id === me.id) return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
  const deleted = await prisma.user.delete({ where: { id } }).catch(() => null);
  if (!deleted) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
