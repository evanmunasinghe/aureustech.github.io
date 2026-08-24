"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "@/lib/store/store-context";
import { RoleSwitcher } from "@/components/app/RoleSwitcher";
import { ProgressBar } from "@/components/app/ProgressBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { ProjectModal } from "@/components/app/ProjectModal";
import {
  projectHealth,
  projectProgress,
  milestonesByProject,
  tasksByProject,
  userById,
} from "@/lib/store/selectors";
import { PROJECT_CATEGORY_LABELS } from "@/lib/types";
import type { BadgeTone } from "@/components/app/StatusBadge";

const HEALTH_TONE: Record<string, BadgeTone> = {
  ON_TRACK: "on-track",
  AT_RISK: "at-risk",
  COMPLETED: "completed",
};

const HEALTH_LABEL: Record<string, string> = {
  ON_TRACK: "On Track",
  AT_RISK: "At Risk",
  COMPLETED: "Completed",
};

const PROJECT_TONE: Record<string, BadgeTone> = {
  ACTIVE: "active",
  PLANNING: "planning",
  ON_HOLD: "on-hold",
  COMPLETED: "completed",
};

const PROJECTStatusLabel: Record<string, string> = {
  ACTIVE: "Active",
  PLANNING: "Planning",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
};

export default function ProjectsPage() {
  const { data, currentUser } = useData();
  const [showModal, setShowModal] = useState(false);

  if (!data) return <div className="empty-hint">Loading projects…</div>;

  const all = data.projects;
  const active = all.filter((p) => p.status === "ACTIVE").length;
  const completed = all.filter((p) => p.status === "COMPLETED").length;
  const onHold = all.filter((p) => p.status === "ON_HOLD").length;

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1>Projects</h1>
          <p>
            All projects across {currentUser?.name ?? "the team"}. Track status, progress and
            milestones.
          </p>
        </div>
        <div className="app-topbar-actions">
          <button className="btn-app gold" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg"></i> New project
          </button>
          <RoleSwitcher />
        </div>
      </div>

      <div className="app-grid cols-4 mb-3">
        <div className="app-card stat-card">
          <div className="stat-icon tone-gold">
            <i className="bi bi-briefcase"></i>
          </div>
          <b>{all.length}</b>
          <span>Total projects</span>
        </div>
        <div className="app-card stat-card">
          <div className="stat-icon tone-blue">
            <i className="bi bi-play-circle"></i>
          </div>
          <b>{active}</b>
          <span>Active</span>
        </div>
        <div className="app-card stat-card">
          <div className="stat-icon tone-green">
            <i className="bi bi-check-circle"></i>
          </div>
          <b>{completed}</b>
          <span>Completed</span>
        </div>
        <div className="app-card stat-card">
          <div className="stat-icon tone-red">
            <i className="bi bi-pause-circle"></i>
          </div>
          <b>{onHold}</b>
          <span>On Hold</span>
        </div>
      </div>

      {all.length === 0 && <div className="empty-hint">No projects yet.</div>}

      <div className="app-grid cols-2">
        {all.map((project) => {
          const client = userById(data, project.clientId);
          const progress = projectProgress(data, project.id);
          const health = projectHealth(data, project.id);
          const milestones = milestonesByProject(data, project.id);
          const tasks = tasksByProject(data, project.id);
          const doneTasks = tasks.filter((t) => t.status === "DONE").length;
          const completedMilestones = milestones.filter((m) => m.status === "COMPLETED").length;

          return (
            <div key={project.id} className="app-card">
              <div className="app-card-head">
                <div className="d-flex align-items-center gap-3">
                  <div className="project-row-icon">
                    <i className="bi bi-stack"></i>
                  </div>
                  <div>
                    <h3 style={{ marginBottom: 2 }}>{project.name}</h3>
                    <div className="text-muted-2" style={{ fontSize: 12 }}>
                      <i className="bi bi-person me-1"></i>
                      {client?.name ?? "—"}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="status-badge tone-info">
                    {PROJECT_CATEGORY_LABELS[project.category]}
                  </span>
                  <StatusBadge
                    tone={HEALTH_TONE[health]}
                    label={HEALTH_LABEL[health]}
                  />
                  <StatusBadge
                    tone={PROJECT_TONE[project.status]}
                    label={PROJECTStatusLabel[project.status]}
                  />
                </div>
              </div>
              <div className="app-card-body">
                <div className="mb-3">
                  <ProgressBar value={progress} showLabel label="Overall progress" />
                </div>

                <div
                  className="d-flex gap-3 flex-wrap mb-3"
                  style={{ fontSize: 12 }}
                >
                  <span className="text-muted-2">
                    <i className="bi bi-calendar3 me-1"></i>
                    {project.deadline ?? "No deadline"}
                  </span>
                  {project.budget != null && (
                    <span className="text-muted-2">
                      <i className="bi bi-cash me-1"></i>
                      LKR {project.budget.toLocaleString()}
                    </span>
                  )}
                  {project.stagingUrl && (
                    <a
                      href={project.stagingUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-gold"
                      style={{ fontSize: 12 }}
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>
                      Staging
                    </a>
                  )}
                </div>

                {milestones.length > 0 && (
                  <div className="mb-3">
                    <div
                      className="text-muted-2 mb-2"
                      style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}
                    >
                      Milestones
                    </div>
                    <div className="d-flex flex-column" style={{ gap: 8 }}>
                      {milestones.map((m) => (
                        <div key={m.id}>
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <span style={{ fontSize: 13, color: "#cdd3da" }}>
                              {m.title}
                            </span>
                            <div className="d-flex align-items-center gap-2">
                              {m.clientApproved && (
                                <span className="text-success" style={{ fontSize: 11 }}>
                                  <i className="bi bi-patch-check"></i>
                                </span>
                              )}
                              <b className="text-gold" style={{ fontSize: 12 }}>
                                {m.progressPercentage}%
                              </b>
                            </div>
                          </div>
                          <div className="progress-track" style={{ height: 4 }}>
                            <div
                              className="progress-fill"
                              style={{ width: `${m.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="d-flex align-items-center justify-content-between pt-2"
                  style={{
                    borderTop: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                >
                  <span className="text-muted-2">
                    {doneTasks}/{tasks.length} tasks · {completedMilestones}/{milestones.length} milestones
                  </span>
                  <Link
                    href={`/dashboard/kanban`}
                    className="btn-app sm ghost"
                  >
                    Open board <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ProjectModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
