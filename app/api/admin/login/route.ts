import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdmin, passwordOk, sessionToken } from "@/lib/admin-auth";

export async function GET() {
  return NextResponse.json({ ok: await isAdmin() });
}

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  if (typeof password !== "string" || !passwordOk(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
