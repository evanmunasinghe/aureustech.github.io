"use client";

import { useCallback, useEffect, useState } from "react";
import { useData } from "@/lib/store/store-context";
import { AccountMenu } from "@/components/app/AccountMenu";
import { defaultProjects } from "@/lib/portfolio";
import type { PortfolioProject } from "@/lib/portfolio";

const EMPTY = { category: "", title: "", description: "", tags: "", blue: false };

async function api(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.error ?? "Request failed"), { status: res.status });
  return json;
}

export default function PortfolioAdminPage() {
  const { currentUser } = useData();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<PortfolioProject[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setRows(await api("/api/portfolio", "GET"));
    } catch {
      setError("Could not load projects. Is DATABASE_URL set and the table created (npx prisma db push)?");
    }
  }, []);

  useEffect(() => {
    api("/api/admin/login", "GET").then((r) => setAuthed(r.ok), () => setAuthed(false));
    load();
  }, [load]);

  // Runs a request, surfacing errors and bouncing to the login form if the session expired.
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await load();
    } catch (e) {
      if ((e as { status?: number }).status === 401) setAuthed(false);
      else setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (currentUser && currentUser.role !== "ADMIN" && currentUser.role !== "SUPERADMIN") {
    return <div className="empty-hint">Only admins can edit the portfolio.</div>;
  }

  const toBody = () => ({
    category: form.category,
    title: form.title,
    description: form.description,
    tags: form.tags.split(","),
    variant: form.blue ? "blue" : null,
  });

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const save = () =>
    run(async () => {
      await (editingId ? api(`/api/portfolio/${editingId}`, "PUT", toBody()) : api("/api/portfolio", "POST", toBody()));
      reset();
    });

  const edit = (p: PortfolioProject) => {
    setEditingId(p.id ?? null);
    setForm({
      category: p.category,
      title: p.title,
      description: p.description,
      tags: p.tags.join(", "),
      blue: p.variant === "blue",
    });
  };

  const remove = (p: PortfolioProject) => {
    if (!confirm(`Delete "${p.title}" from the portfolio?`)) return;
    run(() => api(`/api/portfolio/${p.id}`, "DELETE"));
  };

  const loadStarters = () =>
    run(async () => {
      for (const p of defaultProjects) await api("/api/portfolio", "POST", p);
    });

  const login = async () => {
    setBusy(true);
    setError(null);
    try {
      await api("/api/admin/login", "POST", { password });
      setPassword("");
      setAuthed(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1>Portfolio</h1>
          <p>Projects shown in the “Our Recent Projects” section of the public site.</p>
        </div>
        <div className="app-topbar-actions">
          <AccountMenu />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {authed === false && (
        <form
          className="app-card mb-3 app-form"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <div className="app-card-head">
            <h3>Confirm admin password</h3>
          </div>
          <div className="app-card-body">
            <p className="text-muted-2" style={{ fontSize: 13 }}>
              Saving changes to the live site needs the server-side admin password (<code>ADMIN_PASSWORD</code>).
            </p>
            <div className="d-flex gap-2">
              <input
                type="password"
                className="form-control"
                placeholder="Admin password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn-app gold" disabled={busy || !password}>
                Unlock
              </button>
            </div>
          </div>
        </form>
      )}

      {authed && (
        <form
          className="app-card mb-3 app-form"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <div className="app-card-head">
            <h3>{editingId ? "Edit project" : "Add project"}</h3>
          </div>
          <div className="app-card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="pfTitle">Title *</label>
                <input id="pfTitle" className="form-control" required maxLength={160} value={form.title} onChange={set("title")} />
              </div>
              <div className="col-md-6">
                <label htmlFor="pfCategory">Category label *</label>
                <input
                  id="pfCategory"
                  className="form-control"
                  required
                  maxLength={120}
                  placeholder="e.g. WEB DESIGN & DEVELOPMENT"
                  value={form.category}
                  onChange={set("category")}
                />
              </div>
              <div className="col-12">
                <label htmlFor="pfDesc">Description *</label>
                <textarea id="pfDesc" className="form-control" rows={3} required maxLength={2000} value={form.description} onChange={set("description")} />
              </div>
              <div className="col-md-8">
                <label htmlFor="pfTags">Tags (comma separated)</label>
                <input id="pfTags" className="form-control" placeholder="Laravel, MySQL, SEO" value={form.tags} onChange={set("tags")} />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <label className="d-flex align-items-center gap-2 mb-2">
                  <input type="checkbox" checked={form.blue} onChange={set("blue")} /> Blue card style
                </label>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn-app gold" disabled={busy}>
                {editingId ? "Save changes" : "Add project"}
              </button>
              {editingId && (
                <button type="button" className="btn-app ghost" onClick={reset}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      <div className="app-card">
        <div className="app-card-head">
          <h3>Live projects ({rows.length})</h3>
        </div>
        {rows.length === 0 ? (
          <div className="app-card-body">
            <p className="text-muted-2">
              No projects saved yet, so the site is showing the two starter projects. Load them here to edit or delete them.
            </p>
            {authed && (
              <button className="btn-app" disabled={busy} onClick={loadStarters}>
                Load starter projects
              </button>
            )}
          </div>
        ) : (
          <table className="app-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Tags</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td>{p.tags.join(", ")}</td>
                  <td className="text-end">
                    {authed && (
                      <>
                        <button className="btn-app sm ghost" onClick={() => edit(p)}>
                          Edit
                        </button>{" "}
                        <button className="btn-app sm danger" onClick={() => remove(p)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
