"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/store/store-context";
import { projectsForClient } from "@/lib/store/selectors";
import { ProjectPortal } from "@/components/app/ProjectPortal";

export default function PortalPage() {
  const { data, currentUser } = useData();
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    if (!data || projectId) return;
    const projects =
      currentUser?.role === "CLIENT" ? projectsForClient(data, currentUser.id) : data.projects;
    if (projects.length > 0 && !projects.some((p) => p.id === projectId)) {
      setProjectId(projects[0].id);
    }
  }, [data, currentUser, projectId]);

  if (!data) return <div className="empty-hint">Loading your project…</div>;

  const projects =
    currentUser?.role === "CLIENT" ? projectsForClient(data, currentUser.id) : data.projects;

  if (projects.length === 0) {
    return (
      <div className="app-card">
        <div className="app-card-body">
          <div className="empty-hint" style={{ border: "none" }}>
            No project is assigned to you yet. Your project updates will appear here once a
            project is linked to your account.
          </div>
        </div>
      </div>
    );
  }

  const active = projects.find((p) => p.id === projectId) ?? projects[0];

  return (
    <>
      {projects.length > 1 && (
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <span className="text-muted-2" style={{ fontSize: 13, fontWeight: 600 }}>
            Your projects
          </span>
          <select
            className="form-select"
            style={{ width: 300 }}
            value={active.id}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <ProjectPortal key={active.id} projectId={active.id} />
    </>
  );
}
