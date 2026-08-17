import type {
  ActivityLogEntry,
  AppNotification,
  Comment,
  Deliverable,
  Milestone,
  Project,
  Sprint,
  Task,
  TimeEntry,
  User,
} from "@/lib/types";

export interface AppData {
  users: User[];
  projects: Project[];
  milestones: Milestone[];
  sprints: Sprint[];
  tasks: Task[];
  deliverables: Deliverable[];
  timeEntries: TimeEntry[];
  activityLog: ActivityLogEntry[];
  comments: Comment[];
  notifications: AppNotification[];
}

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const mockData: AppData = {
  users: [
    { id: "u-admin", name: "Dev Perera", email: "dev@aureustechnologies.com", role: "ADMIN" },
    { id: "u-dev", name: "Dilan Fernando", email: "dilan@aureustechnologies.com", role: "DEVELOPER" },
    { id: "u-dev2", name: "Ishara Wickrama", email: "ishara@aureustechnologies.com", role: "DEVELOPER" },
    { id: "u-client1", name: "Ravindu Silva", email: "ravindu@fleeve.lk", role: "CLIENT" },
    { id: "u-client2", name: "Nimali Jayasuriya", email: "nimali@jayasuriyacorp.com", role: "CLIENT" },
  ],

  projects: [
    {
      id: "p1",
      name: "FLEEVE Garage Platform",
      clientId: "u-client1",
      status: "ACTIVE",
      budget: 450000,
      stagingUrl: "https://fleeve.staging.aureustech.dev",
      startDate: day(-140),
      deadline: day(45),
    },
    {
      id: "p2",
      name: "Corporate Digital Presence",
      clientId: "u-client2",
      status: "ACTIVE",
      budget: 240000,
      stagingUrl: "https://corporate-demo.aureustech.dev",
      startDate: day(-76),
      deadline: day(15),
    },
  ],

  milestones: [
    {
      id: "m1",
      projectId: "p1",
      title: "Discovery & Scope",
      description: "Goals, users, priorities and the core business flows.",
      status: "COMPLETED",
      progressPercentage: 100,
      dueDate: day(-108),
      clientApproved: true,
      order: 1,
      deliverables: [],
    },
    {
      id: "m2",
      projectId: "p1",
      title: "Design & Prototype",
      description: "Structure, screens and interactive prototype for sign-off.",
      status: "COMPLETED",
      progressPercentage: 100,
      dueDate: day(-77),
      clientApproved: true,
      order: 2,
      deliverables: [],
    },
    {
      id: "m3",
      projectId: "p1",
      title: "Core System Development",
      description: "Workshop management: customers, vehicles, job cards, bookings, inspections.",
      status: "IN_PROGRESS",
      progressPercentage: 60,
      dueDate: day(15),
      clientApproved: false,
      order: 3,
      deliverables: [],
    },
    {
      id: "m4",
      projectId: "p1",
      title: "Testing, Launch & Handover",
      description: "QA, deployment to production and team training.",
      status: "UPCOMING",
      progressPercentage: 0,
      dueDate: day(45),
      clientApproved: false,
      order: 4,
      deliverables: [],
    },
    {
      id: "m5",
      projectId: "p2",
      title: "Design",
      description: "Visual direction, layout and content structure.",
      status: "COMPLETED",
      progressPercentage: 100,
      dueDate: day(-46),
      clientApproved: true,
      order: 1,
      deliverables: [],
    },
    {
      id: "m6",
      projectId: "p2",
      title: "Build",
      description: "Templates, sections and responsive pages on the staging environment.",
      status: "IN_PROGRESS",
      progressPercentage: 45,
      dueDate: day(0),
      clientApproved: false,
      order: 2,
      deliverables: [],
    },
    {
      id: "m7",
      projectId: "p2",
      title: "Launch",
      description: "Content polish, SEO and go-live.",
      status: "UPCOMING",
      progressPercentage: 0,
      dueDate: day(15),
      clientApproved: false,
      order: 3,
      deliverables: [],
    },
  ],

  sprints: [
    {
      id: "s1",
      projectId: "p1",
      name: "Sprint 1 — Core architecture",
      goal: "Foundation, authentication and vehicle module.",
      startDate: day(-76),
      endDate: day(-49),
    },
    {
      id: "s2",
      projectId: "p1",
      name: "Sprint 2 — Garage workflows",
      goal: "Job cards, bookings and inspections.",
      startDate: day(-48),
      endDate: day(-16),
    },
    {
      id: "s3",
      projectId: "p1",
      name: "Sprint 3 — Polish & QA",
      goal: "Refinements, testing and deploy preparation.",
      startDate: day(-15),
      endDate: day(12),
    },
    {
      id: "s4",
      projectId: "p2",
      name: "Sprint 1 — Templates & sections",
      goal: "Design system and page templates.",
      startDate: day(-62),
      endDate: day(-41),
    },
    {
      id: "s5",
      projectId: "p2",
      name: "Sprint 2 — Content & launch prep",
      goal: "Content population, SEO and launch.",
      startDate: day(-40),
      endDate: day(-10),
    },
  ],

  tasks: [
    { id: "t1", projectId: "p1", sprintId: "s1", title: "Set up project & database schema", description: "Repository, environment and initial data model.", assignedTo: "u-dev", status: "DONE", priority: "HIGH", estimateHours: 8, order: 1 },
    { id: "t2", projectId: "p1", sprintId: "s1", title: "Authentication & roles", description: "Login flow and permission levels for staff.", assignedTo: "u-dev", status: "DONE", priority: "HIGH", estimateHours: 12, order: 2 },
    { id: "t3", projectId: "p1", sprintId: "s1", title: "Vehicle management module", description: "Vehicle CRUD, documents and VIN parsing.", assignedTo: "u-dev", status: "IN_PROGRESS", priority: "HIGH", estimateHours: 16, order: 3 },
    { id: "t4", projectId: "p1", sprintId: "s1", title: "Customer directory & contacts", description: "Searchable customer records with history.", assignedTo: "u-dev2", status: "REVIEW", priority: "MEDIUM", estimateHours: 10, order: 4 },
    { id: "t5", projectId: "p1", sprintId: "s2", title: "Job card builder", description: "Flexible job cards with parts, labour and statuses.", assignedTo: "u-dev", status: "IN_PROGRESS", priority: "HIGH", estimateHours: 20, order: 5 },
    { id: "t6", projectId: "p1", sprintId: "s2", title: "Booking calendar & slots", description: "Appointment scheduling with slot availability.", assignedTo: "u-dev2", status: "IN_PROGRESS", priority: "MEDIUM", estimateHours: 14, order: 6 },
    { id: "t7", projectId: "p1", sprintId: "s2", title: "Inspections & checklist forms", description: "Digital inspection checklists with photo capture.", assignedTo: "u-dev", status: "BACKLOG", priority: "MEDIUM", estimateHours: 10, order: 7 },
    { id: "t8", projectId: "p1", sprintId: "s2", title: "Technician assignment logic", description: "Assign and reassign technicians to job cards.", assignedTo: null, status: "BACKLOG", priority: "MEDIUM", estimateHours: 6, order: 8 },
    { id: "t9", projectId: "p1", sprintId: "s3", title: "Staging deployment & environment config", description: "Automated staging builds for client previews.", assignedTo: "u-dev", status: "REVIEW", priority: "HIGH", estimateHours: 6, order: 9 },
    { id: "t10", projectId: "p1", sprintId: "s3", title: "Performance & responsive pass", description: "Speed and mobile layout refinements.", assignedTo: "u-dev2", status: "BACKLOG", priority: "LOW", estimateHours: 8, order: 10 },
    { id: "t11", projectId: "p2", sprintId: "s4", title: "Design system & templates", description: "Reusable components and page templates.", assignedTo: "u-dev2", status: "DONE", priority: "HIGH", estimateHours: 12, order: 1 },
    { id: "t12", projectId: "p2", sprintId: "s4", title: "Home & services sections", description: "Hero, services and portfolio sections.", assignedTo: "u-dev2", status: "IN_PROGRESS", priority: "MEDIUM", estimateHours: 14, order: 2 },
    { id: "t13", projectId: "p2", sprintId: "s5", title: "Contact & inquiry form", description: "Contact form wired to business email.", assignedTo: "u-dev", status: "BACKLOG", priority: "LOW", estimateHours: 5, order: 3 },
    { id: "t14", projectId: "p2", sprintId: "s5", title: "Content population & SEO", description: "Final copy, meta tags and search optimisation.", assignedTo: null, status: "BACKLOG", priority: "LOW", estimateHours: 8, order: 4 },
  ],

  deliverables: [
    {
      id: "d1",
      milestoneId: "m2",
      title: "Design prototype — key screens",
      description: "Clickable prototype of the core workshop screens.",
      demoUrl: "https://fleeve.staging.aureustech.dev",
      clientApproved: true,
    },
    {
      id: "d2",
      milestoneId: "m3",
      title: "Staging demo — workshop management",
      description: "Live preview of customers, vehicles and job cards.",
      demoUrl: "https://fleeve.staging.aureustech.dev",
      clientApproved: false,
    },
    {
      id: "d3",
      milestoneId: "m3",
      title: "Staging demo — bookings & inspections",
      description: "Booking calendar and digital inspection checklists.",
      demoUrl: "https://fleeve.staging.aureustech.dev",
      clientApproved: false,
    },
    {
      id: "d4",
      milestoneId: "m6",
      title: "Staging site preview",
      description: "Live preview of the corporate website.",
      demoUrl: "https://corporate-demo.aureustech.dev",
      clientApproved: false,
    },
  ],

  timeEntries: [
    { id: "e1", taskId: "t3", userId: "u-dev", date: day(-4), hours: 3.5, note: "Vehicle CRUD + validation" },
    { id: "e2", taskId: "t3", userId: "u-dev", date: day(-3), hours: 2, note: "VIN parser" },
    { id: "e3", taskId: "t5", userId: "u-dev", date: day(-2), hours: 4, note: "Job card fields" },
    { id: "e4", taskId: "t6", userId: "u-dev2", date: day(-2), hours: 2.5, note: "Calendar UI" },
  ],

  activityLog: [
    { id: "a1", projectId: "p1", authorId: "u-admin", type: "milestone", message: "Discovery & Scope phase completed and approved.", clientVisible: true, createdAt: day(-105) },
    { id: "a2", projectId: "p1", authorId: "u-admin", type: "milestone", message: "Design prototype signed off — moving into development.", clientVisible: true, createdAt: day(-76) },
    { id: "a3", projectId: "p1", authorId: "u-admin", type: "milestone", message: "Core system development is underway — 60% complete.", clientVisible: true, createdAt: day(-5) },
    { id: "a4", projectId: "p1", authorId: "u-dev", type: "deliverable", message: "Staging demo updated: workshop management and job cards are now viewable.", clientVisible: true, createdAt: day(-3) },
    { id: "a5", projectId: "p1", authorId: "u-dev2", type: "task", message: "Internal review: inspection checklists drafted.", clientVisible: false, createdAt: day(-2) },
    { id: "a6", projectId: "p1", authorId: "u-dev", type: "task", message: "Vehicle module handed to code review.", clientVisible: false, createdAt: day(-1) },
    { id: "b1", projectId: "p2", authorId: "u-admin", type: "milestone", message: "Design phase complete and approved.", clientVisible: true, createdAt: day(-45) },
    { id: "b2", projectId: "p2", authorId: "u-admin", type: "milestone", message: "Build is underway — templates and sections are taking shape.", clientVisible: true, createdAt: day(-20) },
    { id: "b3", projectId: "p2", authorId: "u-admin", type: "deliverable", message: "Staging preview published for early feedback.", clientVisible: true, createdAt: day(-10) },
  ],

  comments: [
    {
      id: "c1",
      targetType: "deliverable",
      targetId: "d2",
      parentId: null,
      authorId: "u-admin",
      body: "Staging demo for workshop management is live — try creating a job card end to end.",
      clientVisible: true,
      createdAt: `${day(-3)}T09:12:00.000Z`,
    },
    {
      id: "c2",
      targetType: "deliverable",
      targetId: "d2",
      parentId: "c1",
      authorId: "u-client1",
      body: "Looks good! One thing: the booking slot picker overlaps on mobile.",
      clientVisible: true,
      createdAt: `${day(-2)}T14:40:00.000Z`,
    },
    {
      id: "c3",
      targetType: "deliverable",
      targetId: "d2",
      parentId: "c2",
      authorId: "u-dev",
      body: "@Dev noted — fixing the mobile overlap today.",
      clientVisible: true,
      createdAt: `${day(-1)}T08:05:00.000Z`,
    },
    {
      id: "c4",
      targetType: "task",
      targetId: "t5",
      parentId: null,
      authorId: "u-dev2",
      body: "Job card builder still needs the parts & labour totals wired up.",
      clientVisible: false,
      createdAt: `${day(-1)}T16:22:00.000Z`,
    },
  ],

  notifications: [
    {
      id: "n1",
      userId: "u-client1",
      type: "update",
      message: "Staging demo updated: workshop management and job cards are now viewable.",
      href: "/portal",
      read: false,
      createdAt: `${day(-3)}T09:12:00.000Z`,
    },
    {
      id: "n2",
      userId: "u-client2",
      type: "update",
      message: "Staging preview published for early feedback.",
      href: "/portal",
      read: false,
      createdAt: `${day(-10)}T11:00:00.000Z`,
    },
    {
      id: "n3",
      userId: "u-admin",
      type: "comment",
      message: "Dilan Fernando replied on Staging demo — workshop management.",
      href: "/portal",
      read: true,
      createdAt: `${day(-1)}T08:05:00.000Z`,
    },
    {
      id: "n4",
      userId: "u-admin",
      type: "milestone",
      message: "Corporate Digital Presence: build is underway — templates and sections taking shape.",
      href: "/dashboard/clients",
      read: false,
      createdAt: `${day(-20)}T10:30:00.000Z`,
    },
  ],
};
