import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, parseUserInput, PUBLIC_USER, sessionCookie } from "@/lib/auth/server";

// Public client self-signup: always creates a CLIENT and signs them in.
export async function POST(req: Request) {
  const input = parseUserInput({ ...(await req.json().catch(() => ({}))), role: "CLIENT" }, true);
  if (typeof input === "string") return NextResponse.json({ error: input }, { status: 400 });
  if (await prisma.user.findUnique({ where: { email: input.email } })) {
    return NextResponse.json({ error: "An account with this email already exists. Try signing in." }, { status: 409 });
  }
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, role: "CLIENT", passwordHash: hashPassword(input.password!) },
    select: PUBLIC_USER,
  });
  const res = NextResponse.json({ user: { ...user, createdAt: user.createdAt.toISOString() } }, { status: 201 });
  res.cookies.set(sessionCookie(user.id));
  return res;
}
