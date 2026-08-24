"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/lib/store/store-context";

const ROLE_LABEL: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  ADMIN: "Admin",
  DEVELOPER: "Developer",
  CLIENT: "Client",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { data, currentUser, setCurrentUser, logout } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!currentUser) return null;

  const signOut = () => {
    setOpen(false);
    logout();
    window.location.href = "/";
  };

  return (
    <div className={`account-menu${compact ? " compact" : ""}${open ? " open" : ""}`} ref={ref}>
      <button
        type="button"
        className="account-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="avatar">{initials(currentUser.name)}</span>
        {!compact && (
          <span className="account-trigger-text">
            <b>{currentUser.name}</b>
            <small>{ROLE_LABEL[currentUser.role]}</small>
          </span>
        )}
        <i className="bi bi-chevron-down"></i>
      </button>

      {open && (
        <div className="account-pop" role="menu">
          <div className="account-pop-head">
            <span className="avatar lg">{initials(currentUser.name)}</span>
            <div className="account-pop-id">
              <b>{currentUser.name}</b>
              <small>{currentUser.email}</small>
            </div>
            <span className={`role-chip role-${currentUser.role.toLowerCase()}`}>
              {ROLE_LABEL[currentUser.role]}
            </span>
          </div>

          {data && data.users.length > 1 && (
            <>
              <div className="account-pop-label">Switch account</div>
              <div className="account-pop-list">
                {data.users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className={`account-item${u.id === currentUser.id ? " current" : ""}`}
                    onClick={() => {
                      setCurrentUser(u.id);
                      setOpen(false);
                    }}
                  >
                    <span className="avatar dim sm">{initials(u.name)}</span>
                    <span className="account-item-text">
                      <b>{u.name}</b>
                      <small>{ROLE_LABEL[u.role]}</small>
                    </span>
                    {u.id === currentUser.id && <i className="bi bi-check2"></i>}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="account-pop-foot">
            <button type="button" className="account-signout" onClick={signOut}>
              <i className="bi bi-box-arrow-right"></i> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
