export type Role = "ADMIN" | "DEVELOPER" | "CLIENT";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED";

export type MilestoneStatus = "UPCOMING" | "IN_PROGRESS" | "COMPLETED";

export type TaskStatus = "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  budget: number | null;
  stagingUrl: string | null;
  startDate: string | null;
  deadline: string | null;
  createdAt?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  progressPercentage: number;
  dueDate: string | null;
  clientApproved: boolean;
  order: number;
  deliverables?: Deliverable[];
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface Task {
  id: string;
  projectId: string;
  sprintId: string | null;
  title: string;
  description: string | null;
  assignedTo: string | null;
  status: TaskStatus;
  priority: Priority;
  estimateHours: number | null;
  order: number;
  createdAt?: string;
}

export interface Deliverable {
  id: string;
  milestoneId: string;
  title: string;
  description: string | null;
  demoUrl: string | null;
  clientApproved: boolean;
  createdAt?: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  date: string;
  hours: number;
  note: string | null;
}

export interface ActivityLogEntry {
  id: string;
  projectId: string;
  authorId: string | null;
  type: string;
  message: string;
  clientVisible: boolean;
  createdAt: string;
}

export type CommentTargetType = "task" | "deliverable";

export interface Comment {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  parentId: string | null;
  authorId: string;
  body: string;
  clientVisible: boolean;
  createdAt: string;
}

export type NotificationType = "approval" | "update" | "comment" | "task" | "milestone";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
  approval: "Approval",
  update: "Update",
  comment: "Comment",
  task: "Task",
  milestone: "Milestone",
};

export interface TaskCard extends Task {
  assignee?: User | null;
}

export interface ProjectOverview extends Project {
  client?: User | null;
  milestones: Milestone[];
  tasks: Task[];
  activityLog: ActivityLogEntry[];
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In Progress",
  REVIEW: "Code Review",
  DONE: "Done",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
};

export const MILESTONE_STATUS_LABELS: Record<MilestoneStatus, string> = {
  UPCOMING: "Upcoming",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};
