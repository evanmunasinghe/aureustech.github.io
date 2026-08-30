"use client";

import { useState } from "react";
import { useData } from "@/lib/store/store-context";
import { milestoneById } from "@/lib/store/selectors";
import { CommentThread } from "@/components/app/CommentThread";

export function DeliverableCard({ deliverableId }: { deliverableId: string }) {
  const { data, approveDeliverable } = useData();
  const [showComments, setShowComments] = useState(false);
  if (!data) return null;

  const deliverable = data.deliverables.find((d) => d.id === deliverableId);
  if (!deliverable) return null;

  const milestone = milestoneById(data, deliverable.milestoneId);

  return (
    <div className="app-card deliverable-card">
      <div className="d-flex align-items-start justify-content-between gap-3">
        <h4>{deliverable.title}</h4>
        {deliverable.clientApproved ? (
          <span className="status-badge tone-done">
            <i className="bi bi-patch-check"></i> Approved
          </span>
        ) : (
          <span className="status-badge tone-info">Ready for review</span>
        )}
      </div>
      <div className="deliverable-meta">
        {milestone && (
          <span className="chip chip-gold">
            <i className="bi bi-flag me-1"></i>
            {milestone.title}
          </span>
        )}
        {deliverable.demoUrl && (
          <span className="chip">
            <i className="bi bi-box-arrow-up-right me-1"></i>
            Staging build ready
          </span>
        )}
      </div>
      {deliverable.description && <p>{deliverable.description}</p>}
      <div className="deliverable-actions">
        {deliverable.demoUrl && (
          <a className="btn-app gold" href={deliverable.demoUrl} target="_blank" rel="noopener">
            <i className="bi bi-box-arrow-up-right"></i> View staging build
          </a>
        )}
        {!deliverable.clientApproved ? (
          <button className="btn-app" onClick={() => approveDeliverable(deliverable.id, true)}>
            <i className="bi bi-check-lg"></i> Approve this phase
          </button>
        ) : (
          <button className="btn-app" onClick={() => approveDeliverable(deliverable.id, false)}>
            <i className="bi bi-arrow-counterclockwise"></i> Request changes
          </button>
        )}
        <button
          className={`btn-app ${showComments ? "" : "ghost"}`}
          onClick={() => setShowComments((v) => !v)}
        >
          <i className="bi bi-chat-dots me-1"></i> Comment
        </button>
      </div>
      {showComments && (
        <div style={{ borderTop: "1px solid var(--border)", marginTop: 14, paddingTop: 14 }}>
          <CommentThread targetType="deliverable" targetId={deliverable.id} />
        </div>
      )}
    </div>
  );
}
