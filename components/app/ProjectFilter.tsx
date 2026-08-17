"use client";

import type { Project } from "@/lib/types";

export function ProjectFilter({
  projects,
  value,
  onChange,
  meta,
}: {
  projects: Project[];
  value: string;
  onChange: (id: string) => void;
  meta?: string;
}) {
  return (
    <div className="app-card filter-card mb-3">
      <div className="app-card-body filter-body">
        <span className="filter-label">
          <i className="bi bi-collection me-1"></i>
          Project
        </span>
        <div className="filter-control">
          <select
            className="form-select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <span className="filter-meta">{meta}</span>
        </div>
      </div>
    </div>
  );
}
