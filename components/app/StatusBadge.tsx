"use client";

export type BadgeTone =
  | "on-track"
  | "at-risk"
  | "completed"
  | "active"
  | "planning"
  | "on-hold"
  | "done"
  | "in-progress"
  | "review"
  | "backlog"
  | "urgent"
  | "muted"
  | "gold"
  | "info";

export function StatusBadge({ tone, label }: { tone: BadgeTone; label: string }) {
  return <span className={`status-badge tone-${tone}`}>{label}</span>;
}
