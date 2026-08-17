"use client";

import { useData } from "@/lib/store/store-context";
import {
  milestonesByProject,
  projectHealth,
  projectProgress,
  userById,
} from "@/lib/store/selectors";
import { ProgressBar } from "@/components/app/ProgressBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { MilestoneTimeline } from "@/components/app/MilestoneTimeline";
import { DeliverableCard } from "@/components/app/DeliverableCard";
import { ActivityLog } from "@/components/app/ActivityLog";
import type { BadgeTone } from "@/components/app/StatusBadge";

const HEALTH_TONE: Record<string, BadgeTone> = {
  ON_TRACK: "on-track",
  AT_RISK: "at-risk",
  COMPLETED: "completed",
};

const HEALTH_LABEL: Record<string, string> = {
  ON_TRACK: "On Track",
  AT_RISK: "Needs Attention",
  COMPLETED: "Completed",
};

export function ProjectPortal({ projectId }: { projectId: string }) {
  const { data } = useData();
  if (!data) return <div className="empty-hint">Loading your project…</div>;

  const project = data.projects.find((p) => p.id === projectId);
  if (!project) return <div className="empty-hint">Project not found.</div>;

  const client = userById(data, project.clientId);
  const progress = projectProgress(data, project.id);
  const health = projectHealth(data, project.id);

  const milestones = milestonesByProject(data, project.id);
  const milestoneIds = new Set(milestones.map((m) => m.id));
  const deliverables = data.deliverables.filter((d) => milestoneIds.has(d.milestoneId));
  const approvedDeliverables = deliverables.filter((d) => d.clientApproved).length;

  return (
    <>
      <div className="portal-hero">
        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div>
            <div className="text-muted-2" style={{ fontSize: 12, letterSpacing: "0.08em" }}>
              PROJECT UPDATE · {client?.name ?? "Aureus Technologies"}
            </div>
            <h1>{project.name}</h1>
          </div>
          <StatusBadge tone={HEALTH_TONE[health]} label={HEALTH_LABEL[health]} />
        </div>
        <div className="overall">
          <ProgressBar value={progress} showLabel label="Overall project progress" />
        </div>
        <div className="portal-stats">
          <div className="portal-stat">
            <span className="portal-stat-icon">
              <i className="bi bi-flag"></i>
            </span>
            <div>
              <b>{milestones.length}</b>
              <span>Project phases</span>
            </div>
          </div>
          <div className="portal-stat">
            <span className="portal-stat-icon tone-green">
              <i className="bi bi-patch-check"></i>
            </span>
            <div>
              <b>
                {approvedDeliverables}
                <em>/</em>
                {deliverables.length}
              </b>
              <span>Phases approved</span>
            </div>
          </div>
          <div className="portal-stat">
            <span className="portal-stat-icon tone-blue">
              <i className="bi bi-calendar3"></i>
            </span>
            <div>
              <b>{project.deadline ?? "TBC"}</b>
              <span>Target launch</span>
            </div>
          </div>
        </div>
      </div>

      <div className="portal-section">
        <h2>Project phases</h2>
        <MilestoneTimeline projectId={project.id} />
      </div>

      {deliverables.length > 0 && (
        <div className="portal-section">
          <h2>Deliverables for your review</h2>
          <div className="app-grid cols-2">
            {deliverables.map((d) => (
              <DeliverableCard key={d.id} deliverableId={d.id} />
            ))}
          </div>
        </div>
      )}

      <div className="portal-section">
        <h2>What’s been happening</h2>
        <div className="app-card">
          <div className="app-card-body">
            <ActivityLog projectId={project.id} clientVisibleOnly limit={10} />
          </div>
        </div>
      </div>
    </>
  );
}
