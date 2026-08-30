import type { AppData } from "@/lib/data/mock";
import type {
  AppNotification,
  Comment,
  CommentTargetType,
  Deliverable,
  Milestone,
  Sprint,
  Task,
  TimeEntry,
  User,
} from "@/lib/types";

export type ProjectHealth = "ON_TRACK" | "AT_RISK" | "COMPLETED";

export const userById = (data: AppData, id: string | null): User | null =>
  id ? data.users.find((u) => u.id === id) ?? null : null;

export const projectById = (data: AppData, id: string): typeof data.projects[number] | null =>
  data.projects.find((p) => p.id === id) ?? null;

export const milestoneById = (data: AppData, id: string): Milestone | null =>
  data.milestones.find((m) => m.id === id) ?? null;

export const taskById = (data: AppData, id: string): Task | null =>
  data.tasks.find((t) => t.id === id) ?? null;

export const deliverableById = (data: AppData, id: string): Deliverable | null =>
  data.deliverables.find((d) => d.id === id) ?? null;

export const milestonesByProject = (data: AppData, projectId: string): Milestone[] =>
  data.milestones
    .filter((m) => m.projectId === projectId)
    .sort((a, b) => a.order - b.order);

export const tasksByProject = (data: AppData, projectId: string): Task[] =>
  data.tasks.filter((t) => t.projectId === projectId).sort((a, b) => a.order - b.order);

export const tasksInSprint = (data: AppData, sprintId: string): Task[] =>
  data.tasks.filter((t) => t.sprintId === sprintId).sort((a, b) => a.order - b.order);

export const deliverablesByMilestone = (data: AppData, milestoneId: string): Deliverable[] =>
  data.deliverables.filter((d) => d.milestoneId === milestoneId);

export const projectsForClient = (data: AppData, clientId: string) =>
  data.projects.filter((p) => p.clientId === clientId);

export const timeForTask = (data: AppData, taskId: string): TimeEntry[] =>
  data.timeEntries.filter((e) => e.taskId === taskId).sort((a, b) => b.date.localeCompare(a.date));

export const totalHoursForTask = (data: AppData, taskId: string): number =>
  data.timeEntries.filter((e) => e.taskId === taskId).reduce((sum, e) => sum + e.hours, 0);

/** Overall project progress: average of milestone progress, weighted by phase order. */
export const projectProgress = (data: AppData, projectId: string): number => {
  const milestones = milestonesByProject(data, projectId);
  if (milestones.length === 0) return 0;
  const weighted = milestones.reduce((sum, m) => sum + m.progressPercentage * m.order, 0);
  const totalWeight = milestones.reduce((sum, m) => sum + m.order, 0);
  return Math.round(weighted / totalWeight);
};

export const projectHealth = (data: AppData, projectId: string): ProjectHealth => {
  const milestones = milestonesByProject(data, projectId);
  if (milestones.length > 0 && milestones.every((m) => m.status === "COMPLETED")) {
    return "COMPLETED";
  }
  const today = new Date().toISOString().slice(0, 10);
  const atRisk = milestones.some(
    (m) => m.status !== "COMPLETED" && m.dueDate !== null && m.dueDate < today
  );
  return atRisk ? "AT_RISK" : "ON_TRACK";
};

export const totalHoursForUser = (data: AppData, userId: string): number =>
  data.timeEntries.filter((e) => e.userId === userId).reduce((sum, e) => sum + e.hours, 0);

export const tasksAssignedTo = (data: AppData, userId: string): Task[] =>
  data.tasks.filter((t) => t.assignedTo === userId && t.status !== "DONE");

export const assigneeName = (data: AppData, userId: string | null): string =>
  userId ? userById(data, userId)?.name ?? "Unassigned" : "Unassigned";

export const commentsForTarget = (
  data: AppData,
  targetType: CommentTargetType,
  targetId: string
): Comment[] =>
  data.comments
    .filter((c) => c.targetType === targetType && c.targetId === targetId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

export const notificationsForUser = (
  data: AppData,
  userId: string | null
): AppNotification[] => {
  if (!userId) return [];
  return data.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const unreadCount = (data: AppData, userId: string | null): number =>
  userId ? data.notifications.filter((n) => n.userId === userId && !n.read).length : 0;

export interface SprintStats {
  sprint: Sprint;
  totalEstimate: number;
  doneEstimate: number;
  remainingEstimate: number;
  loggedHours: number;
  tasks: number;
  doneTasks: number;
}

export const sprintStats = (data: AppData, sprintId: string): SprintStats => {
  const sprint = data.sprints.find((s) => s.id === sprintId);
  if (!sprint) {
    return {
      sprint: { id: sprintId, projectId: "", name: "Unknown", goal: null, startDate: null, endDate: null },
      totalEstimate: 0,
      doneEstimate: 0,
      remainingEstimate: 0,
      loggedHours: 0,
      tasks: 0,
      doneTasks: 0,
    };
  }
  const tasks = tasksInSprint(data, sprintId);
  const totalEstimate = tasks.reduce((s, t) => s + (t.estimateHours ?? 0), 0);
  const doneEstimate = tasks
    .filter((t) => t.status === "DONE")
    .reduce((s, t) => s + (t.estimateHours ?? 0), 0);
  const loggedHours = tasks.reduce((s, t) => s + totalHoursForTask(data, t.id), 0);
  return {
    sprint,
    totalEstimate,
    doneEstimate,
    remainingEstimate: totalEstimate - doneEstimate,
    loggedHours,
    tasks: tasks.length,
    doneTasks: tasks.filter((t) => t.status === "DONE").length,
  };
};

export interface TeamHourRow {
  user: User;
  hours: number;
  tasks: number;
  projects: { projectId: string; hours: number }[];
}

export const teamHours = (data: AppData): TeamHourRow[] =>
  data.users
    .filter((u) => u.role !== "CLIENT")
    .map((user) => {
      const entries = data.timeEntries.filter((e) => e.userId === user.id);
      const hours = entries.reduce((s, e) => s + e.hours, 0);
      const taskIds = new Set(entries.map((e) => e.taskId));
      const byProject = new Map<string, number>();
      for (const e of entries) {
        const task = taskById(data, e.taskId);
        if (!task) continue;
        byProject.set(task.projectId, (byProject.get(task.projectId) ?? 0) + e.hours);
      }
      return {
        user,
        hours: Math.round(hours * 100) / 100,
        tasks: taskIds.size,
        projects: [...byProject.entries()].map(([projectId, h]) => ({
          projectId,
          hours: Math.round(h * 100) / 100,
        })),
      };
    })
    .sort((a, b) => b.hours - a.hours);

/** First names of users referenced via "@Name" in a comment body. */
export const mentionedUserIds = (data: AppData, body: string, excludeId?: string): string[] => {
  const lower = body.toLowerCase();
  return data.users
    .filter((u) => u.id !== excludeId && u.role !== "CLIENT")
    .filter((u) => {
      const first = u.name.split(" ")[0].toLowerCase();
      return lower.includes(`@${first}`) || lower.includes(`@${u.name.toLowerCase()}`);
    })
    .map((u) => u.id);
};
