"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/store/store-context";
import { tasksInSprint, tasksByProject, projectById } from "@/lib/store/selectors";
import { ProgressBar } from "@/components/app/ProgressBar";
import { TaskModal } from "@/components/app/TaskModal";
import { ProjectFilter } from "@/components/app/ProjectFilter";
import { RoleSwitcher } from "@/components/app/RoleSwitcher";
import type { Task } from "@/lib/types";

export default function SprintsPage() {
  const { data } = useData();
  const [projectId, setProjectId] = useState<string>("");
  const [modal, setModal] = useState<{ open: boolean; task: Task | null; sprintId: string | null }>({
    open: false,
    task: null,
    sprintId: null,
  });

  useEffect(() => {
    if (!projectId && data && data.projects.length > 0) {
      setProjectId(data.projects[0].id);
    }
  }, [data, projectId]);

  if (!data) return <div className="empty-hint">Loading sprints…</div>;
  if (data.projects.length === 0) return <div className="empty-hint">No projects yet.</div>;

  const activeProject = data.projects.find((p) => p.id === projectId) ?? data.projects[0];
  const sprints = data.sprints.filter((s) => s.projectId === activeProject.id);
  const backlog = tasksByProject(data, activeProject.id).filter((t) => t.sprintId === null);

  const sprintDoneRatio = (sprintId: string) => {
    const tasks = tasksInSprint(data, sprintId);
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter((t) => t.status === "DONE").length / tasks.length) * 100);
  };

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1>Sprints</h1>
          <p>Plan delivery around focused sprint windows.</p>
        </div>
        <div className="app-topbar-actions">
          <RoleSwitcher />
        </div>
      </div>

      <ProjectFilter
        projects={data.projects}
        value={activeProject.id}
        onChange={setProjectId}
        meta={`${sprints.length} sprints · ${backlog.length} backlog tasks`}
      />

      <div className="app-grid cols-2">
        {sprints.map((sprint) => {
          const tasks = tasksInSprint(data, sprint.id);
          const done = tasks.filter((t) => t.status === "DONE").length;
          return (
            <div key={sprint.id} className="app-card">
              <div className="app-card-head">
                <div>
                  <h3>{sprint.name}</h3>
                  <div className="text-muted-2" style={{ fontSize: 11, marginTop: 4 }}>
                    {sprint.startDate ?? "—"} → {sprint.endDate ?? "—"}
                  </div>
                </div>
                <button
                  className="btn-app sm ghost"
                  onClick={() => setModal({ open: true, task: null, sprintId: sprint.id })}
                >
                  <i className="bi bi-plus-lg"></i> Task
                </button>
              </div>
              <div className="app-card-body">
                {sprint.goal && (
                  <p className="text-muted-2" style={{ fontSize: 12, margin: "0 0 14px", fontStyle: "italic" }}>
                    Goal: {sprint.goal}
                  </p>
                )}
                <div className="mb-3">
                  <ProgressBar value={sprintDoneRatio(sprint.id)} showLabel label={`${done} of ${tasks.length} done`} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      className="task-row"
                      onClick={() => setModal({ open: true, task: t, sprintId: sprint.id })}
                    >
                      <span className={`status-badge ${t.status === "DONE" ? "tone-done" : t.status === "IN_PROGRESS" ? "tone-in-progress" : t.status === "REVIEW" ? "tone-review" : "tone-backlog"}`}></span>
                      <span className={t.status === "DONE" ? "task-row-title done" : "task-row-title"}>
                        {t.title}
                      </span>
                      <span className={`priority-pill p-${t.priority} ms-auto`}>{t.priority}</span>
                    </div>
                  ))}
                  {tasks.length === 0 && <div className="empty-hint">No tasks in this sprint.</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="app-card mt-3">
        <div className="app-card-head">
          <h3>Backlog</h3>
          <button
            className="btn-app sm ghost"
            onClick={() => setModal({ open: true, task: null, sprintId: null })}
          >
            <i className="bi bi-plus-lg"></i> Task
          </button>
        </div>
        <div className="app-card-body">
          {backlog.length === 0 ? (
            <div className="empty-hint">Backlog is clear.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {backlog.map((t) => (
                <div
                  key={t.id}
                  className="task-row"
                  onClick={() => setModal({ open: true, task: t, sprintId: null })}
                >
                  <span className="task-row-project">
                    <i className="bi bi-collection me-1"></i>
                    {projectById(data, t.projectId)?.name}
                  </span>
                  <span className="task-row-title">{t.title}</span>
                  <span className={`priority-pill p-${t.priority} ms-auto`}>{t.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal
        open={modal.open}
        projectId={activeProject.id}
        task={modal.task}
        defaultSprintId={modal.sprintId}
        onClose={() => setModal({ open: false, task: null, sprintId: null })}
      />
    </>
  );
}
