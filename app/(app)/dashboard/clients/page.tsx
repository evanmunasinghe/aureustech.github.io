"use client";

import { useState } from "react";
import { useData } from "@/lib/store/store-context";
import { milestonesByProject, projectHealth, projectProgress, userById } from "@/lib/store/selectors";
import { ProgressBar } from "@/components/app/ProgressBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { RoleSwitcher } from "@/components/app/RoleSwitcher";
import type { BadgeTone } from "@/components/app/StatusBadge";
import { MILESTONE_STATUS_LABELS } from "@/lib/types";

const HEALTH_TONE: Record<string, BadgeTone> = {
  ON_TRACK: "on-track",
  AT_RISK: "at-risk",
  COMPLETED: "completed",
};

const PROJECT_TONE: Record<string, BadgeTone> = {
  ACTIVE: "active",
  PLANNING: "planning",
  ON_HOLD: "on-hold",
  COMPLETED: "completed",
};

export default function ClientsPage() {
  const { data, updateMilestoneProgress, publishClientUpdate, updateProject } = useData();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (!data) return <div className="empty-hint">Loading clients…</div>;

  const clients = data.users.filter((u) => u.role === "CLIENT");

  const publish = (projectId: string) => {
    const message = drafts[projectId]?.trim();
    if (!message) return;
    publishClientUpdate(projectId, message);
    setDrafts((prev) => ({ ...prev, [projectId]: "" }));
  };

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1>Client Management</h1>
          <p>Update milestone progress and publish updates your clients can see.</p>
        </div>
        <div className="app-topbar-actions">
          <RoleSwitcher />
        </div>
      </div>

      {clients.length === 0 && <div className="empty-hint">No clients yet.</div>}

      {clients.map((client) => {
        const projects = data.projects.filter((p) => p.clientId === client.id);
        return (
          <div key={client.id} className="app-card mb-3">
            <div className="app-card-head">
              <div className="d-flex align-items-center gap-3">
                <span className="avatar">{client.name.slice(0, 2).toUpperCase()}</span>
                <div>
                  <h3>{client.name}</h3>
                  <div className="text-muted-2" style={{ fontSize: 12 }}>
                    {client.email}
                  </div>
                </div>
              </div>
              <span className="text-muted-2" style={{ fontSize: 12 }}>
                {projects.length} project{projects.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="app-card-body">
              {projects.map((project) => {
                const milestones = milestonesByProject(data, project.id);
                const health = projectHealth(data, project.id);
                const progress = projectProgress(data, project.id);
                return (
                  <div
                    key={project.id}
                    className="mb-3"
                    style={{
                      padding: 18,
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      background: "#0f1217",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-2">
                      <div>
                        <b style={{ color: "#fff", fontSize: 15 }}>{project.name}</b>
                        <div className="text-muted-2" style={{ fontSize: 12 }}>
                          Budget: LKR {project.budget?.toLocaleString() ?? "—"} · Deadline: {project.deadline ?? "—"}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        {project.stagingUrl && (
                          <a className="btn-app sm ghost" href={project.stagingUrl} target="_blank" rel="noopener">
                            <i className="bi bi-box-arrow-up-right"></i> Staging
                          </a>
                        )}
                        <StatusBadge tone={HEALTH_TONE[health]} label={health === "ON_TRACK" ? "On Track" : health === "AT_RISK" ? "At Risk" : "Completed"} />
                        <StatusBadge tone={PROJECT_TONE[project.status]} label={project.status} />
                      </div>
                    </div>

                    <div className="mb-3" style={{ maxWidth: 420 }}>
                      <ProgressBar value={progress} showLabel label="Overall progress" />
                    </div>

                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span className="text-muted-2" style={{ fontSize: 12 }}>
                        Status
                      </span>
                      <select
                        className="form-select"
                        style={{ width: 180 }}
                        value={project.status}
                        onChange={(e) =>
                          updateProject(project.id, { status: e.target.value as typeof project.status })
                        }
                      >
                        {["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"].map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row g-3">
                      <div className="col-lg-7">
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {milestones.map((m) => (
                            <div key={m.id}>
                              <div className="d-flex align-items-center justify-content-between mb-1">
                                <span style={{ color: "#cdd3da", fontSize: 13 }}>
                                  {m.title}
                                </span>
                                <div className="d-flex align-items-center gap-2">
                                  <span className="text-muted-2" style={{ fontSize: 11 }}>
                                    {MILESTONE_STATUS_LABELS[m.status]}
                                  </span>
                                  {m.clientApproved && (
                                    <span className="text-success" style={{ fontSize: 11 }}>
                                      <i className="bi bi-patch-check"></i> approved
                                    </span>
                                  )}
                                  <b className="text-gold" style={{ fontSize: 12 }}>
                                    {m.progressPercentage}%
                                  </b>
                                </div>
                              </div>
                              <input
                                className="progress-input"
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                value={m.progressPercentage}
                                onChange={(e) => updateMilestoneProgress(m.id, Number(e.target.value))}
                                style={{ accentColor: "#d4a62a" }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-lg-5">
                        <label className="text-muted-2" style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                          Publish client update
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="e.g. The workshop dashboard is ready to review on staging…"
                          value={drafts[project.id] ?? ""}
                          onChange={(e) => setDrafts((prev) => ({ ...prev, [project.id]: e.target.value }))}
                        />
                        <button
                          className="btn-app gold mt-2 w-100"
                          disabled={!drafts[project.id]?.trim()}
                          onClick={() => publish(project.id)}
                        >
                          <i className="bi bi-megaphone"></i> Publish to client portal
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {projects.length === 0 && <div className="empty-hint">No projects assigned.</div>}
            </div>
          </div>
        );
      })}
    </>
  );
}
