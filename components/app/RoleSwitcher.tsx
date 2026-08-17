"use client";

import { useData } from "@/lib/store/store-context";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  DEVELOPER: "Developer",
  CLIENT: "Client",
};

export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const { data, currentUser, setCurrentUser } = useData();

  if (!data) return null;

  return (
    <div className="app-form" style={{ minWidth: compact ? 150 : 200 }}>
      {!compact && <label htmlFor="roleSwitcher">Viewing as</label>}
      <select
        id={compact ? "roleSwitcherCompact" : "roleSwitcher"}
        className="form-select"
        value={currentUser?.id ?? ""}
        onChange={(e) => setCurrentUser(e.target.value || null)}
      >
        {data.users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} — {ROLE_LABEL[u.role]}
          </option>
        ))}
      </select>
    </div>
  );
}
