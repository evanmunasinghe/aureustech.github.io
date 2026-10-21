import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, sessionCookie, sessionUser, verifyPassword } from "@/lib/auth/server";

// Who is signed in.
export async function GET() {
  return NextResponse.json({ user: await sessionUser() });
}

// Sign in.
export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  const row = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!row || !verifyPassword(password, row.passwordHash)) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }
  const { passwordHash: _, ...user } = row;
  const res = NextResponse.json({ user: { ...user, createdAt: user.createdAt.toISOString() } });
  res.cookies.set(sessionCookie(user.id));
  return res;
}

// Sign out.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
