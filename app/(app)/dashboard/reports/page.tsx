"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/store/store-context";
import {
  projectById,
  sprintStats,
  teamHours,
  tasksInSprint,
} from "@/lib/store/selectors";
import { downloadCsv } from "@/lib/utils/csv";
import { ProjectFilter } from "@/components/app/ProjectFilter";
import { TASK_STATUS_LABELS } from "@/lib/types";
import type { TaskStatus } from "@/lib/types";

const SEG_TONE: Record<TaskStatus, string> = {
  BACKLOG: "seg-backlog",
  IN_PROGRESS: "seg-in-progress",
  REVIEW: "seg-review",
  DONE: "seg-done",
};

export default function ReportsPage() {
  const { data } = useData();
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    if (!projectId && data && data.projects.length > 0) {
      setProjectId(data.projects[0].id);
    }
  }, [data, projectId]);

  if (!data) return <div className="empty-hint">Loading reports…</div>;
  if (data.projects.length === 0) return <div className="empty-hint">No projects yet.</div>;

  const activeProject = data.projects.find((p) => p.id === projectId) ?? data.projects[0];
  const sprints = data.sprints.filter((s) => s.projectId === activeProject.id);
  const rows = teamHours(data);
  const maxHours = Math.max(1, ...rows.map((r) => r.hours));
  const statuses: TaskStatus[] = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"];

  const exportSprints = () => {
    downloadCsv(`sprint-report-${activeProject.name.replace(/\s+/g, "-").toLowerCase()}.csv`, [
      ...sprints.map((s) => {
        const st = sprintStats(data, s.id);
        return {
          sprint: s.name,
          tasks: st.tasks,
          done_tasks: st.doneTasks,
          planned_hours: st.totalEstimate,
          done_hours: st.doneEstimate,
          remaining_hours: st.remainingEstimate,
          logged_hours: st.loggedHours,
        };
      }),
    ]);
  };

  const exportTeam = () => {
    downloadCsv("team-hours.csv", [
      ...rows.map((r) => ({
        name: r.user.name,
        role: r.user.role,
        hours_logged: r.hours,
        tasks_touched: r.tasks,
        projects: r.projects.map((p) => projectById(data, p.projectId)?.name ?? p.projectId).join("; "),
      })),
    ]);
  };

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1>Reports</h1>
          <p>Burndown per sprint and hours logged per team member.</p>
        </div>
        <div className="app-topbar-actions">
          <button className="btn-app ghost" onClick={exportSprints}>
            <i className="bi bi-download me-1"></i> Sprint CSV
          </button>
          <button className="btn-app gold" onClick={exportTeam}>
            <i className="bi bi-download me-1"></i> Team hours CSV
          </button>
        </div>
      </div>

      <ProjectFilter projects={data.projects} value={activeProject.id} onChange={setProjectId} />

      <div className="app-card mb-3">
        <div className="app-card-head">
          <h3>Sprint burndown</h3>
        </div>
        <div className="app-card-body">
          {sprints.length === 0 && <div className="empty-hint">No sprints for this project.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {sprints.map((s) => {
              const st = sprintStats(data, s.id);
              const sprintTasks = tasksInSprint(data, s.id);
              const byStatus = statuses.map((status) => ({
                status,
                hours: sprintTasks
                  .filter((t) => t.status === status)
                  .reduce((sum, t) => sum + (t.estimateHours ?? 0), 0),
              }));
              const total = Math.max(1, byStatus.reduce((s2, b) => s2 + b.hours, 0));
              const pctDone =
                st.totalEstimate > 0 ? Math.round((st.doneEstimate / st.totalEstimate) * 100) : 0;
              return (
                <div key={s.id} className="report-sprint">
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                    <div>
                      <b style={{ color: "#eef1f4" }}>{s.name}</b>
                      {s.goal && <p className="text-muted-2 mb-0" style={{ fontSize: 12 }}>{s.goal}</p>}
                    </div>
                    <div className="text-muted-2" style={{ fontSize: 12 }}>
                      {st.doneTasks}/{st.tasks} tasks done · {pctDone}% planned complete ·{" "}
                      {st.loggedHours}h logged
                    </div>
                  </div>
                  <div className="report-bar">
                    {byStatus.map((seg) => (
                      <div
                        key={seg.status}
                        className={`report-seg ${SEG_TONE[seg.status]}`}
                        style={{ width: `${(seg.hours / total) * 100}%` }}
                        title={`${TASK_STATUS_LABELS[seg.status]}: ${seg.hours}h`}
                      />
                    ))}
                  </div>
                  <div className="report-legend">
                    {byStatus.map((seg) => (
                      <span key={seg.status}>
                        <i className={`seg-dot ${SEG_TONE[seg.status]}`}></i>
                        {TASK_STATUS_LABELS[seg.status]} · {seg.hours}h
                      </span>
                    ))}
                    <span className="ms-auto">
                      {st.remainingEstimate}h remaining of {st.totalEstimate}h planned
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="app-card">
        <div className="app-card-head">
          <h3>Team hours</h3>
        </div>
        <div className="app-card-body">
          {rows.length === 0 && <div className="empty-hint">No time logged yet.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {rows.map((r) => (
              <div key={r.user.id} className="report-team-row">
                <span className="avatar">{r.user.name.slice(0, 2).toUpperCase()}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="d-flex justify-content-between">
                    <b style={{ fontSize: 13, color: "#eef1f4" }}>{r.user.name}</b>
                    <span className="text-muted-2" style={{ fontSize: 12 }}>
                      {r.hours}h · {r.tasks} tasks
                    </span>
                  </div>
                  <div className="progress-track mt-1">
                    <div className="progress-fill" style={{ width: `${(r.hours / maxHours) * 100}%` }} />
                  </div>
                  <div className="report-team-projects">
                    {r.projects.map((p) => (
                      <span key={p.projectId}>
                        {projectById(data, p.projectId)?.name ?? p.projectId}: {p.hours}h
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
