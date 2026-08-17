"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/store/store-context";
import { tasksByProject, timeForTask, totalHoursForTask, userById } from "@/lib/store/selectors";
import { RoleSwitcher } from "@/components/app/RoleSwitcher";
import { ProjectFilter } from "@/components/app/ProjectFilter";
import { downloadCsv } from "@/lib/utils/csv";

interface RunningTimer {
  start: number;
  accumulated: number;
}

export default function TimePage() {
  const { data, currentUser, logTime } = useData();
  const [projectId, setProjectId] = useState<string>("");
  const [timers, setTimers] = useState<Record<string, RunningTimer>>({});
  const [now, setNow] = useState(Date.now());

  const [form, setForm] = useState({
    taskId: "",
    hours: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  useEffect(() => {
    if (!projectId && data && data.projects.length > 0) {
      setProjectId(data.projects[0].id);
    }
  }, [data, projectId]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="empty-hint">Loading time tracking…</div>;
  if (data.projects.length === 0) return <div className="empty-hint">No projects yet.</div>;

  const activeProject = data.projects.find((p) => p.id === projectId) ?? data.projects[0];
  const tasks = tasksByProject(data, activeProject.id);

  const startTimer = (taskId: string) => {
    setTimers((prev) => ({ ...prev, [taskId]: { start: Date.now(), accumulated: 0 } }));
  };

  const stopTimer = (taskId: string) => {
    const timer = timers[taskId];
    if (!timer) return;
    const hours = Number(((timer.accumulated + (Date.now() - timer.start) / 3600000) / 60).toFixed(2));
    const nowDate = new Date().toISOString().slice(0, 10);
    logTime(taskId, hours || 0.1, nowDate, "Timer session");
    setTimers((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
  };

  const elapsedHours = (timer: RunningTimer) =>
    (timer.accumulated + (Date.now() - timer.start) / 3600000) / 60;

  const submitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.taskId || Number(form.hours) <= 0) return;
    logTime(form.taskId, Number(form.hours), form.date, form.note || null);
    setForm((f) => ({ ...f, hours: "", note: "" }));
  };

  const recentEntries = [...data.timeEntries]
    .filter((e) => e.userId === currentUser?.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const exportCsv = () => {
    downloadCsv(`time-entries-${new Date().toISOString().slice(0, 10)}.csv`, [
      ...data.timeEntries
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((e) => ({
          date: e.date,
          task: data.tasks.find((t) => t.id === e.taskId)?.title ?? "Deleted task",
          user: userById(data, e.userId)?.name ?? "Unknown",
          hours: e.hours,
          note: e.note ?? "",
        })),
    ]);
  };

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1>Time Tracking</h1>
          <p>Log hours per task, or run a live timer while you work.</p>
        </div>
        <div className="app-topbar-actions">
          <button className="btn-app ghost" onClick={exportCsv}>
            <i className="bi bi-download me-1"></i> Export CSV
          </button>
          <RoleSwitcher />
        </div>
      </div>

      <ProjectFilter projects={data.projects} value={activeProject.id} onChange={setProjectId} />

      <div className="app-grid cols-3 mb-3">
        <div className="app-card stat-card">
          <div className="stat-icon tone-blue">
            <i className="bi bi-hourglass-split"></i>
          </div>
          <b>{tasks.length}</b>
          <span>Tasks in project</span>
        </div>
        <div className="app-card stat-card">
          <div className="stat-icon tone-green">
            <i className="bi bi-stopwatch"></i>
          </div>
          <b>
            {data.timeEntries
              .filter((e) => e.userId === currentUser?.id)
              .reduce((s, e) => s + e.hours, 0)
              .toFixed(1)}
            h
          </b>
          <span>Your total logged</span>
        </div>
        <div className="app-card stat-card">
          <div className="stat-icon tone-gold">
            <i className="bi bi-lightning-charge"></i>
          </div>
          <b>{Object.keys(timers).length}</b>
          <span>Timers running</span>
        </div>
      </div>

      <div className="app-grid cols-2">
        <div className="app-card">
          <div className="app-card-head">
            <h3>Tasks & timers</h3>
          </div>
          <div className="app-card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tasks.map((task) => {
                const timer = timers[task.id];
                const logged = totalHoursForTask(data, task.id);
                const assignee = userById(data, task.assignedTo);
                return (
                  <div key={task.id} className="task-row">
                    <div className="task-row-main">
                      <div className="task-row-title">{task.title}</div>
                      <div className="text-muted-2 task-row-sub">
                        {assignee?.name ?? "Unassigned"} · {logged}h logged
                        {task.estimateHours != null ? ` / ${task.estimateHours}h est` : ""}
                      </div>
                    </div>
                    {timer ? (
                      <span className="timer-elapsed">{elapsedHours(timer).toFixed(2)}h</span>
                    ) : null}
                    <button
                      className={`btn-app sm ${timer ? "danger" : "gold"}`}
                      onClick={() => (timer ? stopTimer(task.id) : startTimer(task.id))}
                    >
                      <i className={`bi ${timer ? "bi-stop-fill" : "bi-play-fill"}`}></i>
                      {timer ? "Stop" : "Start"}
                    </button>
                  </div>
                );
              })}
              {tasks.length === 0 && <div className="empty-hint">No tasks to track.</div>}
            </div>
          </div>
        </div>

        <div className="app-grid" style={{ display: "grid", gap: 18 }}>
          <div className="app-card">
            <div className="app-card-head">
              <h3>Log time manually</h3>
            </div>
            <div className="app-card-body">
              <form className="app-form" onSubmit={submitLog}>
                <div className="mb-3">
                  <label htmlFor="timeTask">Task</label>
                  <select
                    id="timeTask"
                    className="form-select"
                    value={form.taskId}
                    onChange={(e) => setForm((f) => ({ ...f, taskId: e.target.value }))}
                    required
                  >
                    <option value="">Select a task</option>
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label htmlFor="timeHours">Hours</label>
                    <input
                      id="timeHours"
                      className="form-control"
                      type="number"
                      min="0"
                      step="0.25"
                      value={form.hours}
                      onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="timeDate">Date</label>
                    <input
                      id="timeDate"
                      className="form-control"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="mt-3 mb-3">
                  <label htmlFor="timeNote">Note</label>
                  <input
                    id="timeNote"
                    className="form-control"
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="What did you work on?"
                  />
                </div>
                <button className="btn-app gold w-100" type="submit">
                  <i className="bi bi-plus-circle"></i> Log hours
                </button>
              </form>
            </div>
          </div>

          <div className="app-card">
            <div className="app-card-head">
              <h3>Your recent entries</h3>
            </div>
            <div className="app-card-body">
              {recentEntries.length === 0 ? (
                <div className="empty-hint">No time entries logged yet.</div>
              ) : (
                <div className="activity-list">
                  {recentEntries.map((entry) => {
                    const task = data.tasks.find((t) => t.id === entry.taskId);
                    return (
                      <div key={entry.id} className="activity-item">
                        <div className="activity-icon">
                          <i className="bi bi-clock"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p>
                            <b className="text-gold" style={{ fontSize: 13 }}>
                              {entry.hours}h
                            </b>{" "}
                            {task?.title ?? "Deleted task"}
                          </p>
                          <small>
                            {entry.date}
                            {entry.note ? ` · ${entry.note}` : ""}
                          </small>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
