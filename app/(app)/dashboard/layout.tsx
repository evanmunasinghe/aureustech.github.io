"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { RoleSwitcher } from "@/components/app/RoleSwitcher";
import { NotificationsBell } from "@/components/app/NotificationsBell";
import { openQuickSearch } from "@/components/app/QuickSearch";
import { useData } from "@/lib/store/store-context";

const NAV = [
  {
    group: "Manage",
    items: [
      { href: "/dashboard", label: "Overview", icon: "bi-grid-1x2" },
      { href: "/dashboard/kanban", label: "Kanban Board", icon: "bi-kanban" },
      { href: "/dashboard/sprints", label: "Sprints", icon: "bi-list-check" },
    ],
  },
  {
    group: "Track",
    items: [
      { href: "/dashboard/time", label: "Time Tracking", icon: "bi-stopwatch" },
      { href: "/dashboard/clients", label: "Clients", icon: "bi-people" },
      { href: "/dashboard/reports", label: "Reports", icon: "bi-graph-up" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { currentUser, logout } = useData();

  return (
    <div className="app app-shell">
      <aside className="app-sidebar">
        <Link href="/" className="app-brand">
          <img src="/images/aureus-technologies-logo.png" alt="" />
          <span>
            <b>AUREUS</b>
            <small>PM SUITE</small>
          </span>
        </Link>

        {NAV.map((group) => (
          <div key={group.group}>
            <div className="app-nav-group">{group.group}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`app-nav-link ${pathname === item.href ? "active" : ""}`}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="app-sidebar-tools">
          <button className="sidebar-tool" onClick={openQuickSearch} aria-label="Search">
            <i className="bi bi-search"></i>
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <NotificationsBell />
        </div>

        <div className="app-sidebar-foot">
          {currentUser && (
            <div className="app-account">
              <div className="app-account-info">
                <span className="app-account-name">{currentUser.name}</span>
                <span className="app-account-role">{currentUser.email}</span>
              </div>
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
            </div>
          )}
          <Link href="/portal">
            <i className="bi bi-box-arrow-up-right"></i>
            Client portal
          </Link>
          <Link href="/">
            <i className="bi bi-house"></i>
            View site
          </Link>
        </div>
      </aside>

      <div className="app-main">{children}</div>
    </div>
  );
}
