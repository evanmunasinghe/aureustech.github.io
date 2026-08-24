/**
 * App environment, driven by NEXT_PUBLIC_ENV.
 * - "local"      → developer machine (`npm run dev`)
 * - "demo"       → shared preview/staging builds
 * - "production" → live site
 *
 * Unset values fall back to NODE_ENV so builds stay safe by default.
 */
const RAW = (process.env.NEXT_PUBLIC_ENV ?? "").trim().toLowerCase();

export type AppEnv = "local" | "demo" | "production";

export const APP_ENV: AppEnv =
  RAW === "demo" ? "demo" : RAW === "production" || process.env.NODE_ENV === "production" ? "production" : "local";

/** Demo credentials UI is only exposed on non-production environments. */
export const SHOW_DEMO_LOGINS = APP_ENV === "local" || APP_ENV === "demo";
