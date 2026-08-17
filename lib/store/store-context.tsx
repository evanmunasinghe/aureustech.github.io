"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { AppData } from "@/lib/data/mock";
import type {
  CommentTargetType,
  Milestone,
  NotificationType,
  Priority,
  Project,
  Task,
  TaskStatus,
  TimeEntry,
  User,
} from "@/lib/types";
import { getRepository } from "@/lib/services/repository";
import { mentionedUserIds, userById } from "@/lib/store/selectors";
import { authenticate } from "@/lib/auth/mock-auth";

const STORAGE_KEY = "aureus-pms-data-v1";
const USER_KEY = "aureus-pms-user-v1";
const AUTH_KEY = "aureus-pms-auth-v1";

export interface LoginResult {
  ok: boolean;
  error: string | null;
  user: User | null;
}

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export interface CreateTaskInput {
  projectId: string;
  sprintId?: string | null;
  title: string;
  description?: string | null;
  assignedTo?: string | null;
  priority?: Priority;
  estimateHours?: number | null;
  status?: TaskStatus;
}

interface DataContextValue {
  data: AppData | null;
  currentUser: User | null;
  setCurrentUser: (userId: string | null) => void;
  authReady: boolean;
  isAuthenticated: boolean;
  authUser: User | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  createTask: (input: CreateTaskInput) => Task | null;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  logTime: (taskId: string, hours: number, date: string, note?: string | null) => TimeEntry | null;
  approveDeliverable: (deliverableId: string, approved: boolean) => void;
  updateMilestoneProgress: (id: string, progress: number) => void;
  updateMilestoneStatus: (id: string, status: Milestone["status"]) => void;
  publishClientUpdate: (projectId: string, message: string) => void;
  addActivity: (projectId: string, type: string, message: string, clientVisible: boolean) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  addComment: (
    targetType: CommentTargetType,
    targetId: string,
    body: string,
    clientVisible: boolean
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

function pushNotification(
  draft: AppData,
  userId: string,
  type: NotificationType,
  message: string,
  href: string | null
): AppData {
  return {
    ...draft,
    notifications: [
      {
        id: uid("n"),
        userId,
        type,
        message,
        href,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...draft.notifications,
    ],
  };
}

function notifyTeam(
  draft: AppData,
  message: string,
  href: string | null,
  authorId: string | null
): AppData {
  let next = draft;
  for (const u of draft.users) {
    if (u.role !== "CLIENT" && u.id !== authorId) {
      next = pushNotification(next, u.id, "approval", message, href);
    }
  }
  return next;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authId, setAuthId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Initial load: prefer persisted local state (keeps testing flows across reloads),
  // otherwise load from the data service (currently the mock repository).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved) as AppData);
        return;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    getRepository()
      .then((repo) => repo.loadAll())
      .then(setData);
  }, []);

  useEffect(() => {
    if (data) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const userRestored = useRef(false);
  useEffect(() => {
    if (!data || userRestored.current) return;
    userRestored.current = true;
    const savedAuth = window.localStorage.getItem(AUTH_KEY);
    if (savedAuth && data.users.some((u) => u.id === savedAuth)) {
      setAuthId(savedAuth);
      const savedUser = window.localStorage.getItem(USER_KEY);
      setCurrentUserId(
        savedUser && data.users.some((u) => u.id === savedUser) ? savedUser : savedAuth
      );
    } else {
      setAuthId(null);
      setCurrentUserId(null);
    }
    setAuthReady(true);
  }, [data]);

  useEffect(() => {
    if (authId) window.localStorage.setItem(AUTH_KEY, authId);
  }, [authId]);

  useEffect(() => {
    if (currentUserId) window.localStorage.setItem(USER_KEY, currentUserId);
  }, [currentUserId]);

  const currentUser = data ? userById(data, currentUserId) : null;
  const authUser = data ? userById(data, authId) : null;
  const isAuthenticated = authReady && authId !== null && authUser !== null;

  const login = useCallback(
    (email: string, password: string): LoginResult => {
      const result = authenticate(email, password, data?.users ?? []);
      if (!result.user) {
        return { ok: false, error: result.error, user: null };
      }
      setAuthId(result.user.id);
      setCurrentUserId(result.user.id);
      return { ok: true, error: null, user: result.user };
    },
    [data]
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(USER_KEY);
    setAuthId(null);
    setCurrentUserId(null);
  }, []);

  const appendActivity = useCallback(
    (
      draft: AppData,
      projectId: string,
      type: string,
      message: string,
      clientVisible: boolean,
      authorId: string | null
    ): AppData => ({
      ...draft,
      activityLog: [
        {
          id: uid("a"),
          projectId,
          authorId,
          type,
          message,
          clientVisible,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...draft.activityLog,
      ],
    }),
    []
  );

  const setCurrentUser = useCallback((userId: string | null) => {
    setCurrentUserId(userId);
  }, []);

  const createTask = useCallback(
    (input: CreateTaskInput): Task | null => {
      let created: Task | null = null;
      setData((prev) => {
        if (!prev) return prev;
        const task: Task = {
          id: uid("t"),
          projectId: input.projectId,
          sprintId: input.sprintId ?? null,
          title: input.title,
          description: input.description ?? null,
          assignedTo: input.assignedTo ?? null,
          status: input.status ?? "BACKLOG",
          priority: input.priority ?? "MEDIUM",
          estimateHours: input.estimateHours ?? null,
          order: prev.tasks.filter((t) => t.projectId === input.projectId).length + 1,
        };
        created = task;
        return { ...prev, tasks: [...prev.tasks, task] };
      });
      return created;
    },
    []
  );

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setData((prev) =>
      prev
        ? { ...prev, tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }
        : prev
    );
  }, []);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
          }
        : prev
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.filter((t) => t.id !== id),
            timeEntries: prev.timeEntries.filter((e) => e.taskId !== id),
          }
        : prev
    );
  }, []);

  const logTime = useCallback(
    (taskId: string, hours: number, date: string, note?: string | null): TimeEntry | null => {
      if (!currentUser) return null;
      let entry: TimeEntry | null = null;
      setData((prev) => {
        if (!prev) return prev;
        entry = {
          id: uid("e"),
          taskId,
          userId: currentUser.id,
          date,
          hours,
          note: note ?? null,
        };
        return { ...prev, timeEntries: [...prev.timeEntries, entry] };
      });
      return entry;
    },
    [currentUser]
  );

  const approveDeliverable = useCallback(
    (deliverableId: string, approved: boolean) => {
      setData((prev) => {
        if (!prev) return prev;
        const deliverable = prev.deliverables.find((d) => d.id === deliverableId);
        if (!deliverable) return prev;
        const milestone = prev.milestones.find((m) => m.id === deliverable.milestoneId);
        if (!milestone) return prev;

        const deliverables = prev.deliverables.map((d) =>
          d.id === deliverableId ? { ...d, clientApproved: approved } : d
        );
        const siblings = deliverables.filter((d) => d.milestoneId === deliverable.milestoneId);
        const allApproved = siblings.length > 0 && siblings.every((d) => d.clientApproved);

        let next: AppData = {
          ...prev,
          deliverables,
          milestones: prev.milestones.map((m) =>
            m.id === deliverable.milestoneId
              ? { ...m, clientApproved: allApproved || m.clientApproved }
              : m
          ),
        };

        next = appendActivity(
          next,
          milestone.projectId,
          "deliverable",
          approved
            ? `Deliverable "${deliverable.title}" approved by the client.`
            : `Feedback requested on "${deliverable.title}".`,
          true,
          currentUser?.id ?? null
        );

        const project = next.projects.find((p) => p.id === milestone.projectId);
        const client = project
          ? next.users.find((u) => u.id === project.clientId) ?? null
          : null;
        const clientName = client?.name ?? "The client";
        const authorId = currentUser?.id ?? null;
        const isClientAuthor = authorId ? userById(next, authorId)?.role === "CLIENT" : false;
        if (isClientAuthor) {
          next = notifyTeam(
            next,
            `${clientName} ${approved ? "approved" : "requested changes on"} "${deliverable.title}".`,
            "/dashboard/clients",
            authorId
          );
        }
        return next;
      });
    },
    [appendActivity, currentUser]
  );

  const updateMilestoneProgress = useCallback((id: string, progress: number) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            milestones: prev.milestones.map((m) =>
              m.id === id
                ? {
                    ...m,
                    progressPercentage: Math.max(0, Math.min(100, progress)),
                    status:
                      progress >= 100
                        ? "COMPLETED"
                        : progress > 0
                          ? "IN_PROGRESS"
                          : "UPCOMING",
                  }
                : m
            ),
          }
        : prev
    );
  }, []);

  const updateMilestoneStatus = useCallback((id: string, status: Milestone["status"]) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            milestones: prev.milestones.map((m) =>
              m.id === id
                ? {
                    ...m,
                    status,
                    progressPercentage:
                      status === "COMPLETED"
                        ? 100
                        : status === "UPCOMING"
                          ? 0
                          : m.progressPercentage || 25,
                  }
                : m
            ),
          }
        : prev
    );
  }, []);

  const addActivity = useCallback(
    (projectId: string, type: string, message: string, clientVisible: boolean) => {
      setData((prev) =>
        prev ? appendActivity(prev, projectId, type, message, clientVisible, currentUser?.id ?? null) : prev
      );
    },
    [appendActivity, currentUser]
  );

  const publishClientUpdate = useCallback(
    (projectId: string, message: string) => {
      setData((prev) => {
        if (!prev) return prev;
        let next = appendActivity(prev, projectId, "update", message, true, currentUser?.id ?? null);
        const project = next.projects.find((p) => p.id === projectId);
        if (project && project.clientId) {
          next = pushNotification(next, project.clientId, "update", message, "/portal");
        }
        return next;
      });
    },
    [appendActivity, currentUser]
  );

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setData((prev) =>
      prev
        ? { ...prev, projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }
        : prev
    );
  }, []);

  const addComment = useCallback(
    (targetType: CommentTargetType, targetId: string, body: string, clientVisible: boolean) => {
      const trimmed = body.trim();
      if (!trimmed || !currentUser) return;
      setData((prev) => {
        if (!prev) return prev;
        const authorName = userById(prev, currentUser.id)?.name ?? "Team member";
        const comment = {
          id: uid("c"),
          targetType,
          targetId,
          parentId: null as string | null,
          authorId: currentUser.id,
          body: trimmed,
          clientVisible,
          createdAt: new Date().toISOString(),
        };

        const deliverable =
          targetType === "deliverable" ? prev.deliverables.find((d) => d.id === targetId) : null;
        const targetProject =
          targetType === "task"
            ? prev.tasks.find((t) => t.id === targetId)?.projectId ?? null
            : (deliverable &&
                prev.milestones.find((m) => m.id === deliverable.milestoneId)?.projectId) ||
              null;
        const targetLabel =
          targetType === "task"
            ? prev.tasks.find((t) => t.id === targetId)?.title ?? "a task"
            : deliverable?.title ?? "a deliverable";
        const href = targetType === "task" ? "/dashboard/kanban" : "/portal";

        let next: AppData = {
          ...prev,
          comments: [...prev.comments, comment],
        };

        if (targetProject) {
          next = appendActivity(
            next,
            targetProject,
            "comment",
            clientVisible
              ? `${authorName} commented on "${targetLabel}".`
              : `Internal note on "${targetLabel}".`,
            clientVisible,
            currentUser.id
          );
        }

        if (currentUser.role === "CLIENT") {
          next = notifyTeam(
            next,
            `${authorName} commented on "${targetLabel}".`,
            href,
            currentUser.id
          );
        } else if (clientVisible && targetProject) {
          const project = next.projects.find((p) => p.id === targetProject);
          if (project?.clientId) {
            next = pushNotification(
              next,
              project.clientId,
              "comment",
              `${authorName} commented on "${targetLabel}".`,
              href
            );
          }
        }

        for (const userId of mentionedUserIds(next, trimmed, currentUser.id)) {
          next = pushNotification(
            next,
            userId,
            "comment",
            `${authorName} mentioned you in "${targetLabel}".`,
            href
          );
        }

        return next;
      });
    },
    [appendActivity, currentUser]
  );

  const markNotificationRead = useCallback((id: string) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            notifications: prev.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          }
        : prev
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            notifications: prev.notifications.map((n) =>
              n.userId === currentUser?.id ? { ...n, read: true } : n
            ),
          }
        : prev
    );
  }, [currentUser]);

  const value = useMemo<DataContextValue>(
    () => ({
      data,
      currentUser,
      setCurrentUser,
      authReady,
      isAuthenticated,
      authUser,
      login,
      logout,
      createTask,
      updateTask,
      moveTask,
      deleteTask,
      logTime,
      approveDeliverable,
      updateMilestoneProgress,
      updateMilestoneStatus,
      publishClientUpdate,
      addActivity,
      updateProject,
      addComment,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      data,
      currentUser,
      setCurrentUser,
      authReady,
      isAuthenticated,
      authUser,
      login,
      logout,
      createTask,
      updateTask,
      moveTask,
      deleteTask,
      logTime,
      approveDeliverable,
      updateMilestoneProgress,
      updateMilestoneStatus,
      publishClientUpdate,
      addActivity,
      updateProject,
      addComment,
      markNotificationRead,
      markAllNotificationsRead,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
