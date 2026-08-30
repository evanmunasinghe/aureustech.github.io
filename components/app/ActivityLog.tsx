"use client";

import { useData } from "@/lib/store/store-context";
import { userById } from "@/lib/store/selectors";

const TYPE_ICON: Record<string, string> = {
  milestone: "bi-flag",
  deliverable: "bi-box",
  update: "bi-megaphone",
  task: "bi-gear",
  comment: "bi-chat-dots",
};

export function ActivityLog({
  projectId,
  clientVisibleOnly = true,
  limit,
}: {
  projectId: string;
  clientVisibleOnly?: boolean;
  limit?: number;
}) {
  const { data } = useData();
  if (!data) return null;

  const entries = data.activityLog
    .filter((e) => e.projectId === projectId && (!clientVisibleOnly || e.clientVisible))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const shown = limit ? entries.slice(0, limit) : entries;

  if (shown.length === 0) {
    return <div className="empty-hint">No updates yet. Updates will appear here.</div>;
  }

  return (
    <div className="activity-list">
      {shown.map((entry) => (
        <div key={entry.id} className="activity-item">
          <div className="activity-icon">
            <i className={`bi ${TYPE_ICON[entry.type] ?? "bi-info-circle"}`}></i>
          </div>
          <div>
            <p>{entry.message}</p>
            <small>
              {entry.createdAt} · {userById(data, entry.authorId)?.name ?? "Aureus team"}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
