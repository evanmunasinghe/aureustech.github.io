"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/store/store-context";
import type { Priority, Task, TaskStatus } from "@/lib/types";
import { PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/lib/types";
import { CommentThread } from "@/components/app/CommentThread";

interface TaskModalProps {
  open: boolean;
  projectId: string;
  task: Task | null;
  defaultSprintId?: string | null;
  onClose: () => void;
}

export function TaskModal({ open, projectId, task, defaultSprintId, onClose }: TaskModalProps) {
  const { data, updateTask, createTask, deleteTask } = useData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("BACKLOG");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [sprintId, setSprintId] = useState<string>("");
  const [estimateHours, setEstimateHours] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "BACKLOG");
    setPriority(task?.priority ?? "MEDIUM");
    setAssignedTo(task?.assignedTo ?? "");
    setSprintId(task?.sprintId ?? defaultSprintId ?? "");
    setEstimateHours(task?.estimateHours != null ? String(task.estimateHours) : "");
  }, [open, task, defaultSprintId]);

  if (!open || !data) return null;

  const project = data.projects.find((p) => p.id === projectId);
  const sprints = data.sprints.filter((s) => s.projectId === projectId);
  const team = data.users.filter((u) => u.role !== "CLIENT");

  const handleSave = () => {
    if (!title.trim()) return;
    const patch = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      assignedTo: assignedTo || null,
      sprintId: sprintId || null,
      estimateHours: estimateHours.trim() ? Number(estimateHours) : null,
    };
    if (task) {
      updateTask(task.id, patch);
    } else {
      createTask({ projectId, ...patch });
    }
    onClose();
  };

  return (
    <div className="app-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="app-modal">
        <div className="app-modal-head">
          <h3>{task ? "Edit task" : "New task"}</h3>
          <button className="btn-app ghost" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="app-modal-body">
          <form
            className="app-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="mb-3">
              <label htmlFor="taskTitle">Title *</label>
              <input
                id="taskTitle"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short, clear task title"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="taskDesc">Description</label>
              <textarea
                id="taskDesc"
                className="form-control"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What needs to be done?"
              />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label htmlFor="taskStatus">Status</label>
                <select id="taskStatus" className="form-select" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                  {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="taskPriority">Priority</label>
                <select id="taskPriority" className="form-select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="taskAssignee">Assignee</label>
                <select id="taskAssignee" className="form-select" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                  <option value="">Unassigned</option>
                  {team.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="taskSprint">Sprint</label>
                <select id="taskSprint" className="form-select" value={sprintId} onChange={(e) => setSprintId(e.target.value)}>
                  <option value="">No sprint</option>
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="taskEstimate">Estimate (hours)</label>
                <input
                  id="taskEstimate"
                  className="form-control"
                  type="number"
                  min="0"
                  step="0.5"
                  value={estimateHours}
                  onChange={(e) => setEstimateHours(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="app-modal-foot">
          {task && (
            <button
              className="btn-app danger"
              onClick={() => {
                deleteTask(task.id);
                onClose();
              }}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          )}
          <button className="btn-app ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-app gold" onClick={handleSave}>
            {task ? "Save changes" : "Create task"}
          </button>
        </div>
        {task && (
          <div className="app-modal-body" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="comment-heading">
              <i className="bi bi-chat-dots me-1"></i> Discussion
            </div>
            <CommentThread targetType="task" targetId={task.id} />
          </div>
        )}
        {project && (
          <div className="app-modal-foot" style={{ borderTop: "1px solid var(--border)", justifyContent: "flex-start" }}>
            <span className="text-muted-2" style={{ fontSize: 12 }}>
              <i className="bi bi-briefcase me-1"></i>
              {project.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
