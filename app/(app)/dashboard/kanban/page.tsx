"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/store/store-context";
import { userById, totalHoursForTask } from "@/lib/store/selectors";
import { KanbanBoard } from "@/components/app/KanbanBoard";
import { TaskModal } from "@/components/app/TaskModal";
import { ProjectFilter } from "@/components/app/ProjectFilter";
import { RoleSwitcher } from "@/components/app/RoleSwitcher";
import { downloadCsv } from "@/lib/utils/csv";
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from "@/lib/types";
import type { Task } from "@/lib/types";

export default function KanbanPage() {
  const { data } = useData();
  const [projectId, setProjectId] = useState<string>("");
  const [modal, setModal] = useState<{ open: boolean; task: Task | null }>({
    open: false,
    task: null,
  });

  useEffect(() => {
    if (!projectId && data && data.projects.length > 0) {
      setProjectId(data.projects[0].id);
    }
  }, [data, projectId]);

  if (!data) return <div className="empty-hint">Loading board…</div>;
  if (data.projects.length === 0) return <div className="empty-hint">No projects yet.</div>;

  const activeProject = data.projects.find((p) => p.id === projectId) ?? data.projects[0];

  const exportCsv = () => {
    downloadCsv(
      `tasks-${activeProject.name.replace(/\s+/g, "-").toLowerCase()}.csv`,
      data.tasks
        .filter((t) => t.projectId === activeProject.id)
        .sort((a, b) => a.order - b.order)
        .map((t) => ({
          title: t.title,
          status: TASK_STATUS_LABELS[t.status],
          priority: PRIORITY_LABELS[t.priority],
          assignee: userById(data, t.assignedTo)?.name ?? "Unassigned",
          estimate_hours: t.estimateHours ?? "",
          logged_hours: totalHoursForTask(data, t.id),
          sprint: data.sprints.find((s) => s.id === t.sprintId)?.name ?? "",
        }))
    );
  };

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1>Kanban Board</h1>
          <p>Drag cards between columns to update their status.</p>
        </div>
        <div className="app-topbar-actions">
          <button className="btn-app ghost" onClick={exportCsv}>
            <i className="bi bi-download me-1"></i> Export CSV
          </button>
          <button
            className="btn-app gold"
            onClick={() => setModal({ open: true, task: null })}
          >
            <i className="bi bi-plus-lg"></i> New task
          </button>
          <RoleSwitcher />
        </div>
      </div>

      <ProjectFilter
        projects={data.projects}
        value={activeProject.id}
        onChange={setProjectId}
        meta={`${data.tasks.filter((t) => t.projectId === activeProject.id).length} tasks`}
      />

      <KanbanBoard
        projectId={activeProject.id}
        onNewTask={() => setModal({ open: true, task: null })}
        onOpenTask={(task) => setModal({ open: true, task })}
      />

      <TaskModal
        open={modal.open}
        projectId={activeProject.id}
        task={modal.task}
        onClose={() => setModal({ open: false, task: null })}
      />
    </>
  );
}
