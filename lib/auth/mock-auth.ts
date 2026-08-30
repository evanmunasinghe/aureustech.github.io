import type { User } from "@/lib/types";

export interface Credential {
  userId: string;
  password: string;
  label: string;
}

export interface SelfCredential {
  userId: string;
  password: string;
}

const SIGNUP_CREDENTIALS_KEY = "aureus-pms-signup-credentials-v1";

export const DEMO_CREDENTIALS: Credential[] = [
  { userId: "u-superadmin", password: "Evan@2003", label: "Super Admin" },
  { userId: "u-admin", password: "admin123", label: "Admin (Staff)" },
  { userId: "u-dev", password: "dev123", label: "Developer (Team)" },
  { userId: "u-dev2", password: "dev123", label: "Developer 2 (Team)" },
  { userId: "u-client1", password: "client123", label: "Client — FLEEVE" },
  { userId: "u-client2", password: "client123", label: "Client — Jayasuriya Corp" },
];

export function loadSelfCredentials(): SelfCredential[] {
  try {
    const raw = window.localStorage.getItem(SIGNUP_CREDENTIALS_KEY);
    const parsed = raw ? (JSON.parse(raw) as SelfCredential[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSelfCredential(credential: SelfCredential): void {
  const all = loadSelfCredentials().filter((c) => c.userId !== credential.userId);
  try {
    window.localStorage.setItem(
      SIGNUP_CREDENTIALS_KEY,
      JSON.stringify([...all, credential])
    );
  } catch {}
}

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
  const demo = DEMO_CREDENTIALS.find((c) => c.userId === user.id);
  if (demo && demo.password === password) {
    return { user, error: null };
  }
  const self = loadSelfCredentials().find((c) => c.userId === user.id);
  if (self && self.password === password) {
    return { user, error: null };
  }
  return { user: null, error: "Incorrect password. Try again." };
}
