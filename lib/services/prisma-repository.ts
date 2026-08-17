import { prisma } from "@/lib/db";
import type { AppData } from "@/lib/data/mock";
import type { Repository } from "./repository";

/**
 * Prisma-backed repository.
 *
 * DORMANT: This module is only loaded when `getRepository()` runs on a server with
 * DATABASE_URL set (see lib/services/repository.ts). It is never bundled into the
 * static export and never imported by client components, so importing Prisma here
 * is safe.
 *
 * Date fields come back from PostgreSQL as Date objects; they are mapped to ISO
 * strings to match the UI types in lib/types.ts.
 */
const iso = (value: Date | null): string | null => (value ? value.toISOString() : null);

export const prismaRepository: Repository = {
  loadAll: async (): Promise<AppData> => {
    const [
      users,
      projects,
      milestones,
      sprints,
      tasks,
      deliverables,
      timeEntries,
      activityLog,
      comments,
      notifications,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.project.findMany(),
      prisma.milestone.findMany(),
      prisma.sprint.findMany(),
      prisma.task.findMany(),
      prisma.deliverable.findMany(),
      prisma.timeEntry.findMany(),
      prisma.activityLogEntry.findMany(),
      prisma.comment.findMany(),
      prisma.notification.findMany(),
    ]);

    return {
      users: users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })),
      projects: projects.map((p) => ({
        ...p,
        budget: p.budget ?? null,
        stagingUrl: p.stagingUrl,
        startDate: iso(p.startDate),
        deadline: iso(p.deadline),
        createdAt: p.createdAt?.toISOString(),
      })),
      milestones: milestones.map((m) => ({
        ...m,
        description: m.description,
        dueDate: iso(m.dueDate),
      })),
      sprints: sprints.map((s) => ({
        ...s,
        goal: s.goal,
        startDate: iso(s.startDate),
        endDate: iso(s.endDate),
      })),
      tasks: tasks.map((t) => ({
        ...t,
        description: t.description,
        estimateHours: t.estimateHours ?? null,
        createdAt: t.createdAt?.toISOString(),
      })),
      deliverables: deliverables.map((d) => ({
        ...d,
        description: d.description,
        demoUrl: d.demoUrl,
        createdAt: d.createdAt?.toISOString(),
      })),
      timeEntries: timeEntries.map((e) => ({
        ...e,
        date: e.date.toISOString(),
        note: e.note,
      })),
      activityLog: activityLog.map((a) => ({
        ...a,
        message: a.message,
        createdAt: a.createdAt.toISOString(),
      })),
      comments: comments.map((c) => ({
        ...c,
        targetType: c.targetType as AppData["comments"][number]["targetType"],
        parentId: c.parentId,
        body: c.body,
        createdAt: c.createdAt.toISOString(),
      })),
      notifications: notifications.map((n) => ({
        ...n,
        type: n.type as AppData["notifications"][number]["type"],
        message: n.message,
        href: n.href,
        createdAt: n.createdAt.toISOString(),
      })),
    };
  },
};
