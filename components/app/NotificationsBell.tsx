"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useData } from "@/lib/store/store-context";
import { notificationsForUser, unreadCount } from "@/lib/store/selectors";
import { formatDateTime } from "@/lib/utils/format";
import type { NotificationType } from "@/lib/types";

const TYPE_ICON: Record<NotificationType, string> = {
  approval: "bi-patch-check",
  update: "bi-megaphone",
  comment: "bi-chat-dots",
  task: "bi-gear",
  milestone: "bi-flag",
};

export function NotificationsBell() {
  const { data, currentUser, markNotificationRead, markAllNotificationsRead } = useData();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!data || !currentUser) return <div className="bell" />;

  const items = notificationsForUser(data, currentUser.id);
  const unread = unreadCount(data, currentUser.id);

  return (
    <>
      <div className="bell">
        <button
          className="bell-btn"
          aria-label="Notifications"
          onClick={() => setOpen((v) => !v)}
        >
          <i className="bi bi-bell"></i>
          {unread > 0 && <span className="bell-badge">{unread > 9 ? "9+" : unread}</span>}
        </button>

        {open && (
          <div className="bell-panel">
            <div className="bell-head">
              <b>Notifications</b>
              {unread > 0 && (
                <button className="btn-link" onClick={markAllNotificationsRead}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="bell-list">
              {items.length === 0 && (
                <div className="empty-hint" style={{ border: "none" }}>
                  You're all caught up.
                </div>
              )}
              {items.map((n) => (
                <Link
                  key={n.id}
                  href={n.href ?? "/dashboard"}
                  className={`bell-item ${n.read ? "" : "unread"}`}
                  onClick={() => {
                    if (!n.read) markNotificationRead(n.id);
                    setOpen(false);
                  }}
                >
                  <span className="bell-icon">
                    <i className={`bi ${TYPE_ICON[n.type] ?? "bi-info-circle"}`}></i>
                  </span>
                  <span className="bell-text">
                    <p>{n.message}</p>
                    <small>{formatDateTime(n.createdAt)}</small>
                  </span>
                  {!n.read && <span className="bell-dot"></span>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {open && <div className="bell-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}
