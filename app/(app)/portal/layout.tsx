"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useData } from "@/lib/store/store-context";
import { AccountMenu } from "@/components/app/AccountMenu";
import { NotificationsBell } from "@/components/app/NotificationsBell";
import { openQuickSearch } from "@/components/app/QuickSearch";
import ThemeToggle from "@/components/app/ThemeToggle";

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useData();
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
          <ThemeToggle />
          <button className="sidebar-tool" onClick={openQuickSearch} aria-label="Search">
            <i className="bi bi-search"></i>
          </button>
          <NotificationsBell />
          <AccountMenu compact />
          {!isClient && (
            <Link href="/dashboard" className="btn-app sm ghost">
              <i className="bi bi-kanban me-1"></i> Dashboard
            </Link>
          )}
        </div>
      </header>
      <div className="container" style={{ maxWidth: 1080, padding: "30px 20px 90px" }}>
        {children}
      </div>
    </div>
  );
}
