import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "aureus_admin";

// Both sides are HMAC'd to equal-length digests so the compare is constant-time.
const sign = (s: string) => createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update(s).digest();
const same = (a: string, b: string) => timingSafeEqual(sign(a), sign(b));

export const passwordOk = (p: string) => !!process.env.ADMIN_PASSWORD && same(p, process.env.ADMIN_PASSWORD);

// ponytail: stateless cookie = HMAC keyed by ADMIN_PASSWORD; rotating the password logs everyone out.
export const sessionToken = () => sign("portfolio-admin").toString("hex");

export async function isAdmin() {
  const v = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!process.env.ADMIN_PASSWORD && !!v && same(v, sessionToken());
}
