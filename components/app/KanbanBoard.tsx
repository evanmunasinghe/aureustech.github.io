"use client";

import { useState } from "react";
import type { DragEvent } from "react";
import { useData } from "@/lib/store/store-context";
import { tasksByProject, totalHoursForTask, userById } from "@/lib/store/selectors";
import type { Task, TaskStatus } from "@/lib/types";
import { PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/lib/types";

const COLUMNS: TaskStatus[] = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"];

const COLUMN_DOT: Record<TaskStatus, string> = {
  BACKLOG: "tone-backlog",
  IN_PROGRESS: "tone-in-progress",
  REVIEW: "tone-review",
  DONE: "tone-done",
};

function TaskCard({
  task,
  onOpen,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  task: Task;
  onOpen: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const { data } = useData();
  const assignee = userById(data!, task.assignedTo);
  const hours = totalHoursForTask(data!, task.id);

  return (
    <div
      className={`kanban-card ${isDragging ? "dragging" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
    >
      <div className="kanban-card-head">
        <span className="kanban-card-title">{task.title}</span>
        <span className={`priority-pill p-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
      </div>
      <div className="kanban-card-meta">
        {assignee ? (
          <>
            <span className="avatar">{assignee.name.slice(0, 2).toUpperCase()}</span>
            <span>{assignee.name.split(" ")[0]}</span>
          </>
        ) : (
          <>
            <span className="avatar dim">
              <i className="bi bi-question"></i>
            </span>
            <span>Unassigned</span>
          </>
        )}
        {task.estimateHours != null && (
          <span className="ms-auto">
            <i className="bi bi-clock me-1"></i>
            {hours > 0 ? `${hours}h / ` : ""}
            {task.estimateHours}h
          </span>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  projectId,
  onNewTask,
  onOpenTask,
}: {
  projectId: string;
  onNewTask: () => void;
  onOpenTask: (task: Task) => void;
}) {
  const { data, moveTask } = useData();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);

  if (!data) return <div className="empty-hint">Loading board…</div>;

  const tasks = tasksByProject(data, projectId);

  const handleDrop = (status: TaskStatus) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragId) moveTask(dragId, status);
    setDragId(null);
    setOverCol(null);
  };

  return (
    <div className="kanban">
      {COLUMNS.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        return (
          <div
            key={status}
            className={`kanban-col ${overCol === status ? "drag-over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(status);
            }}
            onDrop={handleDrop(status)}
          >
            <div className="kanban-col-head">
              <b>
                <span className={`status-badge ${COLUMN_DOT[status]}`}></span>
                {TASK_STATUS_LABELS[status]}
              </b>
              <span className="count">{columnTasks.length}</span>
            </div>
            <div className="kanban-cards">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onOpen={() => onOpenTask(task)}
                  isDragging={dragId === task.id}
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", task.id);
                    setDragId(task.id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverCol(null);
                  }}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="empty-hint" style={{ border: "none", padding: 14 }}>
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
