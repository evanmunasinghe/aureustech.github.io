"use client";

import { useState } from "react";
import { useData } from "@/lib/store/store-context";
import { AccountMenu } from "@/components/app/AccountMenu";
import type { Role } from "@/lib/types";

const ROLES: { value: Role; label: string }[] = [
  { value: "SUPERADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "DEVELOPER", label: "Developer" },
  { value: "CLIENT", label: "Client" },
];

const EMPTY = { name: "", email: "", role: "CLIENT" as Role, password: "" };

export default function UsersPage() {
  const { data, authUser, saveUser, deleteUser } = useData();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Role | "ALL">("ALL");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!data) return <div className="empty-hint">Loading users…</div>;
  if (authUser?.role !== "SUPERADMIN") {
    return <div className="empty-hint">Only the super admin can manage users.</div>;
  }

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError(null);
  };

  const save = async () => {
    setBusy(true);
    const err = await saveUser(editingId, { ...form, password: form.password || undefined });
    setBusy(false);
    if (err) setError(err);
    else reset();
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setBusy(true);
    setError(await deleteUser(id));
    setBusy(false);
  };

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const users = data.users.filter((u) => filter === "ALL" || u.role === filter);

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1>Users</h1>
          <p>Add, edit and remove clients, developers and admins.</p>
        </div>
        <div className="app-topbar-actions">
          <AccountMenu />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form
        className="app-card mb-3 app-form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="app-card-head">
          <h3>{editingId ? "Edit user" : "Add user"}</h3>
        </div>
        <div className="app-card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="uName">Name *</label>
              <input id="uName" className="form-control" required value={form.name} onChange={set("name")} />
            </div>
            <div className="col-md-6">
              <label htmlFor="uEmail">Email *</label>
              <input id="uEmail" type="email" className="form-control" required value={form.email} onChange={set("email")} />
            </div>
            <div className="col-md-6">
              <label htmlFor="uRole">Role *</label>
              <select
                id="uRole"
                className="form-select"
                value={form.role}
                onChange={set("role")}
                disabled={editingId === authUser.id}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="uPassword">{editingId ? "New password (leave blank to keep)" : "Password *"}</label>
              <input
                id="uPassword"
                type="password"
                className="form-control"
                autoComplete="new-password"
                minLength={8}
                required={!editingId}
                value={form.password}
                onChange={set("password")}
              />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn-app gold" disabled={busy}>{editingId ? "Save changes" : "Add user"}</button>
            {editingId && (
              <button type="button" className="btn-app ghost" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="app-card">
        <div className="app-card-head">
          <h3>All users ({users.length})</h3>
          <select
            className="form-select"
            style={{ width: 160 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value as Role | "ALL")}
            aria-label="Filter by role"
          >
            <option value="ALL">All roles</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <table className="app-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{ROLES.find((r) => r.value === u.role)?.label}</td>
                <td className="text-end">
                  <button
                    className="btn-app sm ghost"
                    onClick={() => {
                      setEditingId(u.id);
                      setForm({ name: u.name, email: u.email, role: u.role, password: "" });
                      setError(null);
                    }}
                  >
                    Edit
                  </button>{" "}
                  {u.id !== authUser.id && (
                    <button className="btn-app sm danger" disabled={busy} onClick={() => remove(u.id, u.name)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
