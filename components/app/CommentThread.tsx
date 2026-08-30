"use client";

import { useState } from "react";
import { useData } from "@/lib/store/store-context";
import { commentsForTarget, userById } from "@/lib/store/selectors";
import type { CommentTargetType } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/format";

export function CommentThread({
  targetType,
  targetId,
}: {
  targetType: CommentTargetType;
  targetId: string;
}) {
  const { data, currentUser, addComment } = useData();
  const [body, setBody] = useState("");
  const [clientVisible, setClientVisible] = useState(true);

  if (!data || !currentUser) return null;

  const comments = commentsForTarget(data, targetType, targetId);
  const topLevel = comments.filter((c) => !c.parentId);
  const replies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  const renderThread = (comment: (typeof comments)[number], depth: number) => (
    <div key={comment.id} className={depth === 0 ? "" : "comment-reply"}>
      <CommentItem comment={comment} />
      {replies(comment.id).map((r) => renderThread(r, depth + 1))}
    </div>
  );

  const submit = () => {
    if (!body.trim()) return;
    addComment(targetType, targetId, body, clientVisible);
    setBody("");
  };

  return (
    <div className="comment-thread">
      {comments.length > 0 && (
        <div className="comment-list">
          {topLevel.map((c) => renderThread(c, 0))}
        </div>
      )}

      <form
        className="comment-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <textarea
          className="form-control"
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment…"
        />
        <div className="d-flex align-items-center justify-content-between gap-3 mt-2">
          <label className="comment-visibility">
            <input
              type="checkbox"
              checked={clientVisible}
              onChange={(e) => setClientVisible(e.target.checked)}
            />
            <i className="bi bi-eye me-1"></i> Visible to client
          </label>
          <button className="btn-app sm gold" type="submit" disabled={!body.trim()}>
            <i className="bi bi-send"></i> Post
          </button>
        </div>
      </form>
    </div>
  );
}

function CommentItem({
  comment,
}: {
  comment: { authorId: string; body: string; clientVisible: boolean; createdAt: string };
}) {
  const { data } = useData();
  const author = userById(data!, comment.authorId);
  return (
    <div className="comment-item">
      <span className="avatar">{author?.name.slice(0, 2).toUpperCase() ?? "?"}</span>
      <div className="comment-body">
        <div className="comment-meta">
          <b>{author?.name ?? "Unknown"}</b>
          {!comment.clientVisible && (
            <span className="status-badge tone-muted">
              <i className="bi bi-eye-slash me-1"></i> Internal
            </span>
          )}
        </div>
        <p>{comment.body}</p>
        <small>{formatDateTime(comment.createdAt)}</small>
      </div>
    </div>
  );
}
