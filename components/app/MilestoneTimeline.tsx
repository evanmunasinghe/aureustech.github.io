"use client";

import { useData } from "@/lib/store/store-context";
import { userById, deliverableById } from "@/lib/store/selectors";
import { ProgressBar } from "@/components/app/ProgressBar";
import { StatusBadge } from "@/components/app/StatusBadge";

const STATUS_TONE = {
  COMPLETED: "completed",
  IN_PROGRESS: "in-progress",
  UPCOMING: "muted",
} as const;

export function MilestoneTimeline({ projectId }: { projectId: string }) {
  const { data } = useData();
  if (!data) return null;

  const milestones = data.milestones
    .filter((m) => m.projectId === projectId)
    .sort((a, b) => a.order - b.order);

  if (milestones.length === 0) {
    return <div className="empty-hint">No milestones defined yet.</div>;
  }

  return (
    <div className="timeline">
      {milestones.map((m) => {
        const approved = m.clientApproved;
        const tone = m.status === "COMPLETED" ? "done" : m.status === "IN_PROGRESS" ? "now" : "";
        return (
          <div key={m.id} className={`timeline-item ${tone}`}>
            <span className="timeline-dot"></span>
            <div className="timeline-card">
              <div className="timeline-card-head">
                <h3>{m.title}</h3>
                <StatusBadge tone={STATUS_TONE[m.status]} label={m.status === "IN_PROGRESS" ? "In progress" : m.status === "COMPLETED" ? "Completed" : "Upcoming"} />
              </div>
              {m.description && <p className="desc">{m.description}</p>}
              <div className="mt-3">
                <ProgressBar value={m.progressPercentage} showLabel label="Phase progress" />
              </div>
              <div className="due d-flex align-items-center justify-content-between">
                <span>
                  <i className="bi bi-calendar3 me-1"></i>
                  Target: {m.dueDate ?? "To be confirmed"}
                </span>
                {approved && (
                  <span className="text-success">
                    <i className="bi bi-patch-check me-1"></i>
                    Approved by you
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
