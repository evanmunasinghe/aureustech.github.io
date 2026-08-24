"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/store/store-context";
import { projectById, userById } from "@/lib/store/selectors";
import type { Task } from "@/lib/types";

interface Result {
  id: string;
  type: "Task" | "Project" | "Milestone" | "Deliverable" | "Sprint" | "Person";
  icon: string;
  title: string;
  context: string;
  href: string;
}

export function QuickSearch() {
  const { data } = useData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("aureus:quicksearch", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("aureus:quicksearch", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    const list: Result[] = [];

    for (const p of data.projects) {
      const client = userById(data, p.clientId);
      if (!q || p.name.toLowerCase().includes(q)) {
        list.push({
          id: `p-${p.id}`,
          type: "Project",
          icon: "bi-briefcase",
          title: p.name,
          context: client ? `Client: ${client.name}` : "",
          href: "/dashboard",
        });
      }
    }

    for (const t of data.tasks) {
      const project = projectById(data, t.projectId);
      if (!q || t.title.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q)) {
        list.push({
          id: `t-${t.id}`,
          type: "Task",
          icon: "bi-check2-square",
          title: t.title,
          context: project ? project.name : "",
          href: "/dashboard/kanban",
        });
      }
    }

    for (const m of data.milestones) {
      const project = projectById(data, m.projectId);
      if (!q || m.title.toLowerCase().includes(q)) {
        list.push({
          id: `m-${m.id}`,
          type: "Milestone",
          icon: "bi-flag",
          title: m.title,
          context: project ? project.name : "",
          href: "/dashboard/clients",
        });
      }
    }

    for (const d of data.deliverables) {
      if (!q || d.title.toLowerCase().includes(q)) {
        const milestone = data.milestones.find((m) => m.id === d.milestoneId);
        const project = milestone ? projectById(data, milestone.projectId) : null;
        list.push({
          id: `d-${d.id}`,
          type: "Deliverable",
          icon: "bi-box",
          title: d.title,
          context: project ? project.name : "",
          href: "/portal",
        });
      }
    }

    for (const s of data.sprints) {
      const project = projectById(data, s.projectId);
      if (!q || s.name.toLowerCase().includes(q) || (s.goal ?? "").toLowerCase().includes(q)) {
        list.push({
          id: `s-${s.id}`,
          type: "Sprint",
          icon: "bi-list-check",
          title: s.name,
          context: project ? project.name : "",
          href: "/dashboard/sprints",
        });
      }
    }

    for (const u of data.users) {
      if (!q || u.name.toLowerCase().includes(q)) {
        list.push({
          id: `u-${u.id}`,
          type: "Person",
          icon: "bi-person",
          title: u.name,
          context: u.role,
          href: "/dashboard/time",
        });
      }
    }

    return list.slice(0, 12);
  }, [data, query]);

  const go = (r: Result) => {
    setOpen(false);
    router.push(r.href);
  };

  return (
    <>
      {open && (
        <div className="qs-backdrop" onMouseDown={() => setOpen(false)}>
          <div className="qs" onMouseDown={(e) => e.stopPropagation()}>
            <div className="qs-input">
              <i className="bi bi-search"></i>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter" && results[active]) {
                    go(results[active]);
                  }
                }}
                placeholder="Search projects, tasks, milestones…"
              />
              <kbd>ESC</kbd>
            </div>
            <div className="qs-results">
              {results.length === 0 ? (
                <div className="empty-hint" style={{ border: "none", margin: 0 }}>
                  No results for "{query}"
                </div>
              ) : (
                results.map((r, i) => (
                  <button
                    key={r.id}
                    className={`qs-item ${i === active ? "active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                  >
                    <span className="qs-icon">
                      <i className={`bi ${r.icon}`}></i>
                    </span>
                    <span className="qs-text">
                      <b>{r.title}</b>
                      <small>
                        {r.type}
                        {r.context ? ` · ${r.context}` : ""}
                      </small>
                    </span>
                    <span className="qs-type">{r.type}</span>
                  </button>
                ))
              )}
            </div>
            <div className="qs-foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate · <kbd>↵</kbd> open
              </span>
              <span>
                <kbd>⌘K</kbd> toggle
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function openQuickSearch() {
  window.dispatchEvent(new CustomEvent("aureus:quicksearch"));
}
