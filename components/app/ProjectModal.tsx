"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/store/store-context";
import type { ProjectCategory, ProjectStatus } from "@/lib/types";
import { PROJECT_CATEGORY_LABELS, PROJECT_STATUS_LABELS } from "@/lib/types";

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProjectModal({ open, onClose }: ProjectModalProps) {
  const { data, createProject } = useData();

  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("WEB");
  const [status, setStatus] = useState<ProjectStatus>("PLANNING");
  const [budget, setBudget] = useState("");
  const [stagingUrl, setStagingUrl] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (!open) return;
    setName("");
    setClientId("");
    setCategory("WEB");
    setStatus("PLANNING");
    setBudget("");
    setStagingUrl("");
    setDeadline("");
  }, [open]);

  if (!open || !data) return null;

  const clients = data.users.filter((u) => u.role === "CLIENT");

  const handleSave = () => {
    if (!name.trim() || !clientId) return;
    createProject({
      name: name.trim(),
      clientId,
      category,
      status,
      budget: budget.trim() ? Number(budget) : null,
      stagingUrl: stagingUrl.trim() || null,
      deadline: deadline || null,
      startDate: new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  return (
    <div className="app-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="app-modal">
        <div className="app-modal-head">
          <h3>New project</h3>
          <button className="btn-app ghost" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="app-modal-body">
          <form
            className="app-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="mb-3">
              <label htmlFor="projName">Project name *</label>
              <input
                id="projName"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. FLEEVE Garage Platform"
                required
              />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label htmlFor="projClient">Client *</label>
                <select
                  id="projClient"
                  className="form-select"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                >
                  <option value="">Select client</option>
                  {clients.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="projCategory">Category *</label>
                <select
                  id="projCategory"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                >
                  {Object.entries(PROJECT_CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="projStatus">Status</label>
                <select
                  id="projStatus"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                >
                  {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="projBudget">Budget (LKR)</label>
                <input
                  id="projBudget"
                  className="form-control"
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 450000"
                />
              </div>
              <div className="col-6">
                <label htmlFor="projDeadline">Deadline</label>
                <input
                  id="projDeadline"
                  className="form-control"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label htmlFor="projStaging">Staging URL</label>
                <input
                  id="projStaging"
                  className="form-control"
                  type="url"
                  value={stagingUrl}
                  onChange={(e) => setStagingUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </form>
        </div>
        <div className="app-modal-foot">
          <button className="btn-app ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-app gold" onClick={handleSave} disabled={!name.trim() || !clientId}>
            <i className="bi bi-plus-lg"></i> Create project
          </button>
        </div>
      </div>
    </div>
  );
}
