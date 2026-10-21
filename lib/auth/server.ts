import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import type { Role, User } from "@/lib/types";

export const SESSION_COOKIE = "aureus_session";
const SESSION_DAYS = 7;
const ROLES: Role[] = ["SUPERADMIN", "ADMIN", "DEVELOPER", "CLIENT"];

// Never send the hash to the browser.
export const PUBLIC_USER = { id: true, name: true, email: true, role: true, createdAt: true } as const;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hash, "hex"));
}

// Stateless session: "<userId>.<expiresAt>.<hmac>". Fails closed when SESSION_SECRET is unset.
// ponytail: changing a password doesn't end existing sessions; add a session table if that matters.
const sign = (payload: string) =>
  createHmac("sha256", process.env.SESSION_SECRET ?? "").update(payload).digest("hex");

export function sessionCookie(userId: string) {
  const payload = `${userId}.${Date.now() + SESSION_DAYS * 864e5}`;
  return {
    name: SESSION_COOKIE,
    value: `${payload}.${sign(payload)}`,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  };
}

export async function sessionUser(): Promise<User | null> {
  if (!process.env.SESSION_SECRET) return null;
  const raw = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  const cut = raw.lastIndexOf(".");
  const payload = raw.slice(0, cut);
  const sig = Buffer.from(raw.slice(cut + 1), "hex");
  const expected = Buffer.from(sign(payload), "hex");
  if (cut < 0 || sig.length !== expected.length || !timingSafeEqual(sig, expected)) return null;
  const [userId, expires] = [payload.slice(0, payload.lastIndexOf(".")), Number(payload.split(".").pop())];
  if (!(expires > Date.now())) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: PUBLIC_USER });
  return user && { ...user, createdAt: user.createdAt.toISOString() };
}

export const isAdminRole = (role?: Role) => role === "ADMIN" || role === "SUPERADMIN";

export async function isAdmin() {
  return isAdminRole((await sessionUser())?.role);
}

export interface UserInput {
  name: string;
  email: string;
  role: Role;
  password?: string;
}

/** Validates a create/update body. Returns the cleaned input or an error message. */
export function parseUserInput(body: unknown, creating: boolean): UserInput | string {
  const b = (body ?? {}) as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const password = typeof b.password === "string" && b.password ? b.password : undefined;
  const role = b.role as Role;
  if (name.length < 2 || name.length > 120) return "Please enter a name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 191) return "Please enter a valid email address.";
  if (!ROLES.includes(role)) return "Please choose a role.";
  if (creating && !password) return "New users need a password.";
  if (password && password.length < 8) return "Password must be at least 8 characters.";
  return { name, email, role, password };
}
