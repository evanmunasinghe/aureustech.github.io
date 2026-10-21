// One-off: puts the original workspace accounts into the User table (same ids as lib/data/mock.ts,
// so local projects and tasks keep pointing at the right people). Safe to re-run: existing emails are skipped.
//
//   SUPERADMIN_PASSWORD='…' node scripts/seed-users.mjs
//
// Only the super admin gets a usable password; set the others from the Users page.
import "dotenv/config";
import { randomBytes, scryptSync } from "node:crypto";
import mariadb from "mariadb";

const password = process.env.SUPERADMIN_PASSWORD;
if (!password || password.length < 8) throw new Error("Set SUPERADMIN_PASSWORD (8+ characters).");

const users = [
  ["u-superadmin", "Evan Munasinghe", "esmunasinghe@gmail.com", "SUPERADMIN"],
  ["u-admin", "Dev Perera", "dev@aureustechnologies.com", "ADMIN"],
  ["u-dev", "Dilan Fernando", "dilan@aureustechnologies.com", "DEVELOPER"],
  ["u-dev2", "Ishara Wickrama", "ishara@aureustechnologies.com", "DEVELOPER"],
  ["u-client1", "Ravindu Silva", "ravindu@fleeve.lk", "CLIENT"],
  ["u-client2", "Nimali Jayasuriya", "nimali@jayasuriyacorp.com", "CLIENT"],
];

// Same format as hashPassword() in lib/auth/server.ts.
const hash = (pw) => {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
};

const url = new URL(process.env.DATABASE_URL);
const conn = await mariadb.createConnection({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  ssl: url.searchParams.get("ssl-mode")?.toLowerCase() !== "disabled",
  connectTimeout: 15000,
});

for (const [id, name, email, role] of users) {
  const pw = role === "SUPERADMIN" ? password : randomBytes(24).toString("hex");
  const { affectedRows } = await conn.query(
    "INSERT IGNORE INTO `User` (id, name, email, role, passwordHash) VALUES (?, ?, ?, ?, ?)",
    [id, name, email, role, hash(pw)]
  );
  console.log(affectedRows ? "added  " : "exists ", email);
}
await conn.end();
