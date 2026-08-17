"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useData } from "@/lib/store/store-context";
import { RoleSwitcher } from "@/components/app/RoleSwitcher";import { NotificationsBell } from "@/components/app/NotificationsBell";
import { openQuickSearch } from "@/components/app/QuickSearch";

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { currentUser, logout } = useData();
  const isClient = currentUser?.role === "CLIENT";

  return (
    <div className="app">
      <header className="portal-header">
        <Link href="/" className="app-brand">
          <img src="/images/aureus-technologies-logo.png" alt="" />
          <span>
            <b>AUREUS</b>
            <small>CLIENT PORTAL</small>
          </span>
        </Link>
        <div className="portal-header-actions">
          <button className="sidebar-tool" onClick={openQuickSearch} aria-label="Search">
            <i className="bi bi-search"></i>
          </button>
          <NotificationsBell />
          <RoleSwitcher compact />
          {!isClient && (
            <Link href="/dashboard" className="btn-app sm ghost">
              <i className="bi bi-kanban me-1"></i> Dashboard
            </Link>
          )}
          {currentUser && (
            <>
              <span className="portal-signed-in text-muted-2">
                <i className="bi bi-person-circle me-1"></i>
                {currentUser.name}
              </span>
              <button
                type="button"
                className="sidebar-tool plain"
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                aria-label="Sign out"
                title="Sign out"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </>
          )}
        </div>
      </header>
      <div className="container" style={{ maxWidth: 1080, padding: "30px 20px 90px" }}>
        {children}
      </div>
    </div>
  );
}
