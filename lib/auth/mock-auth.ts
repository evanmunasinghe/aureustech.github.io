import type { User } from "@/lib/types";

export interface Credential {
  userId: string;
  password: string;
  label: string;
}

export const DEMO_CREDENTIALS: Credential[] = [
  { userId: "u-admin", password: "admin123", label: "Admin (Staff)" },
  { userId: "u-dev", password: "dev123", label: "Developer (Team)" },
  { userId: "u-dev2", password: "dev123", label: "Developer 2 (Team)" },
  { userId: "u-client1", password: "client123", label: "Client — FLEEVE" },
  { userId: "u-client2", password: "client123", label: "Client — Jayasuriya Corp" },
];

export function authenticate(
  email: string,
  password: string,
  users: User[]
): { user: User | null; error: string | null } {
  const normalized = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalized) ?? null;
  if (!user) {
    return { user: null, error: "No account found for that email." };
  }
  const credential = DEMO_CREDENTIALS.find((c) => c.userId === user.id);
  if (!credential || credential.password !== password) {
    return { user: null, error: "Incorrect password. Try again." };
  }
  return { user, error: null };
}
