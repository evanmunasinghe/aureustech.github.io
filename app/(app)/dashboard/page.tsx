"use client";

import Link from "next/link";
import { useData } from "@/lib/store/store-context";
import { RoleSwitcher } from "@/components/app/RoleSwitcher";
import { ProgressBar } from "@/components/app/ProgressBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import {
  projectHealth,
  projectProgress,
  userById,
} from "@/lib/store/selectors";
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

export default function DashboardOverview() {
  const { data, currentUser } = useData();

  if (!data) return <div className="empty-hint">Loading workspace…</div>;

  const activeProjects = data.projects.filter((p) => p.status === "ACTIVE");
  const openTasks = data.tasks.filter((t) => t.status !== "DONE");
  const hoursLogged = data.timeEntries.reduce((sum, e) => sum + e.hours, 0);
  const atRisk = data.projects.filter((p) => projectHealth(data, p.id) === "AT_RISK").length;
  const team = data.users.filter((u) => u.role !== "CLIENT");
  const myOpenTasks = currentUser
    ? openTasks.filter((t) => t.assignedTo === currentUser.id).length
    : 0;
  const maxOpen = Math.max(
    1,
    ...team.map((m) => data.tasks.filter((t) => t.assignedTo === m.id && t.status !== "DONE").length)
  );

  const activity = [...data.activityLog]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 7);

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1>Workspace Overview</h1>
          <p>
            Welcome back, {currentUser?.name ?? "team member"}. Here is how the work is tracking.
          </p>
        </div>
        <div className="app-topbar-actions">
          <RoleSwitcher />
        </div>
      </div>

      <div className="app-grid cols-4 mb-3">
        <div className="app-card stat-card">
          <div className="stat-icon tone-gold">
            <i className="bi bi-briefcase"></i>
          </div>
          <b>{activeProjects.length}</b>
          <span>Active projects</span>
        </div>
        <div className="app-card stat-card">
          <div className="stat-icon tone-blue">
            <i className="bi bi-check2-square"></i>
          </div>
          <b>{openTasks.length}</b>
          <span>Open tasks</span>
        </div>
        <div className="app-card stat-card">
          <div className="stat-icon tone-green">
            <i className="bi bi-stopwatch"></i>
          </div>
          <b>{hoursLogged.toFixed(1)}h</b>
          <span>Hours logged</span>
        </div>
        <div className="app-card stat-card">
          <div className="stat-icon tone-red">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <b>{atRisk}</b>
          <span>Projects at risk</span>
        </div>
      </div>

      <div className="app-grid cols-2">
        <div className="app-card">
          <div className="app-card-head">
            <h3>
              <i className="bi bi-stack me-2 text-gold"></i>
              Projects
            </h3>
            <Link href="/dashboard/kanban" className="btn-app sm ghost">
              Open board <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="app-card-body">
            {data.projects.map((project) => {
              const client = userById(data, project.clientId);
              const progress = projectProgress(data, project.id);
              const health = projectHealth(data, project.id);
              return (
                <div key={project.id} className="project-row">
                  <div className="project-row-icon">
                    <i className="bi bi-stack"></i>
                  </div>
                  <div className="project-row-main">
                    <div className="project-row-top">
                      <b>{project.name}</b>
                      <StatusBadge tone={HEALTH_TONE[health]} label={HEALTH_LABEL[health]} />
                    </div>
                    <div className="project-row-sub">
                      <span>
                        <i className="bi bi-person me-1"></i>
                        {client?.name ?? "—"}
                      </span>
                      <span>
                        <i className="bi bi-calendar3 me-1"></i>
                        {project.deadline ?? "No deadline"}
                      </span>
                      <span className="text-gold">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="app-card">
          <div className="app-card-head">
            <h3>
              <i className="bi bi-people me-2 text-gold"></i>
              Team workload
            </h3>
            <span className="text-muted-2" style={{ fontSize: 12 }}>
              {myOpenTasks} assigned to you
            </span>
          </div>
          <div className="app-card-body">
            {team.map((member) => {
              const open = data.tasks.filter(
                (t) => t.assignedTo === member.id && t.status !== "DONE"
              ).length;
              const hours = data.timeEntries
                .filter((e) => e.userId === member.id)
                .reduce((s, e) => s + e.hours, 0);
              const workloadPct = maxOpen > 0 ? Math.round((open / maxOpen) * 100) : 0;
              return (
                <div key={member.id} className="workload-row">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <span className="avatar">{member.name.slice(0, 2).toUpperCase()}</span>
                      <div>
                        <div className="text-strong">{member.name}</div>
                        <div className="text-muted-2" style={{ fontSize: 11 }}>
                          {member.role === "ADMIN" ? "Admin" : "Developer"}
                        </div>
                      </div>
                    </div>
                    <div className="text-end" style={{ fontSize: 12 }}>
                      <div className="text-strong">
                        <b>{open}</b> open
                      </div>
                      <div className="text-muted-2">{hours.toFixed(1)}h logged</div>
                    </div>
                  </div>
                  <div className="progress-track workload-track mt-2">
                    <div className="progress-fill" style={{ width: `${workloadPct}%` }} />
                  </div>
                </div>
              );
            })}
            {data.tasks.filter((t) => t.assignedTo === null && t.status !== "DONE").length > 0 && (
              <div className="text-gold mt-3" style={{ fontSize: 12 }}>
                <i className="bi bi-inbox me-1"></i>
                {data.tasks.filter((t) => t.assignedTo === null && t.status !== "DONE").length}{" "}
                unassigned task(s) in backlog
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="app-card mt-3">
        <div className="app-card-head">
          <h3>
            <i className="bi bi-activity me-2 text-gold"></i>
            Recent activity
          </h3>
          <Link href="/dashboard/clients" className="btn-app sm ghost">
            Publish client update
          </Link>
        </div>
        <div className="app-card-body">
          <div className="activity-list">
            {activity.map((entry) => {
              const project = data.projects.find((p) => p.id === entry.projectId);
              return (
                <div key={entry.id} className="activity-item">
                  <div className="activity-icon">
                    <i className={`bi ${entry.type === "milestone" ? "bi-flag" : entry.type === "deliverable" ? "bi-box" : entry.type === "update" ? "bi-megaphone" : "bi-gear"}`}></i>
                  </div>
                  <div>
                    <p>
                      {entry.message} {project && <span className="text-muted-2">· {project.name}</span>}
                    </p>
                    <small>
                      {entry.createdAt} · {userById(data, entry.authorId)?.name ?? "System"}
                      {!entry.clientVisible && <span className="text-muted-2"> · internal</span>}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
