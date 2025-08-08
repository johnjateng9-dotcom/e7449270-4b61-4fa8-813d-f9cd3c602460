import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table for authentication and profiles
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatar: text("avatar"),
  role: text("role", { enum: ["admin", "user", "guest"] }).default("user"),
  subscriptionPlan: text("subscription_plan", { enum: ["free", "pro", "enterprise"] }).default("free"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teams/Organizations
export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  avatar: text("avatar"),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  subscriptionPlan: text("subscription_plan", { enum: ["free", "pro", "enterprise"] }).default("free"),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team memberships
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").notNull().references(() => teams.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  role: text("role", { enum: ["owner", "admin", "member", "guest"] }).default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Projects
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status", { enum: ["planning", "active", "on_hold", "completed", "archived"] }).default("planning"),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium"),
  teamId: uuid("team_id").notNull().references(() => teams.id),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks
export const tasks: any = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["todo", "in_progress", "review", "done"] }).default("todo"),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium"),
  projectId: uuid("project_id").notNull().references(() => projects.id),
  assigneeId: uuid("assignee_id").references(() => users.id),
  creatorId: uuid("creator_id").notNull().references(() => users.id),
  parentTaskId: uuid("parent_task_id").references((): any => tasks.id),
  dueDate: timestamp("due_date"),
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  position: integer("position").default(0),
  labels: jsonb("labels"),
  attachmentCount: integer("attachment_count").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat channels
export const channels = pgTable("channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type", { enum: ["public", "private", "direct"] }).default("public"),
  teamId: uuid("team_id").references(() => teams.id),
  projectId: uuid("project_id").references(() => projects.id),
  creatorId: uuid("creator_id").notNull().references(() => users.id),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages
export const messages: any = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  type: text("type", { enum: ["text", "file", "system", "call"] }).default("text"),
  channelId: uuid("channel_id").notNull().references(() => channels.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  replyToId: uuid("reply_to_id").references((): any => messages.id),
  reactions: jsonb("reactions"),
  metadata: jsonb("metadata"),
  editedAt: timestamp("edited_at"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Documents
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: jsonb("content"),
  type: text("type", { enum: ["document", "spreadsheet", "presentation"] }).default("document"),
  projectId: uuid("project_id").references(() => projects.id),
  teamId: uuid("team_id").notNull().references(() => teams.id),
  creatorId: uuid("creator_id").notNull().references(() => users.id),
  isPublic: boolean("is_public").default(false),
  version: integer("version").default(1),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Files
export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  teamId: uuid("team_id").notNull().references(() => teams.id),
  uploaderId: uuid("uploader_id").notNull().references(() => users.id),
  projectId: uuid("project_id").references(() => projects.id),
  taskId: uuid("task_id").references(() => tasks.id),
  messageId: uuid("message_id").references(() => messages.id),
  documentId: uuid("document_id").references(() => documents.id),
  isPublic: boolean("is_public").default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sessions table for authentication
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedTeams: many(teams),
  teamMemberships: many(teamMembers),
  ownedProjects: many(projects),
  assignedTasks: many(tasks, { relationName: "assignee" }),
  createdTasks: many(tasks, { relationName: "creator" }),
  messages: many(messages),
  createdChannels: many(channels),
  uploadedFiles: many(files),
  sessions: many(sessions),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, { fields: [teams.ownerId], references: [users.id] }),
  members: many(teamMembers),
  projects: many(projects),
  channels: many(channels),
  documents: many(documents),
  files: many(files),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  team: one(teams, { fields: [projects.teamId], references: [teams.id] }),
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  tasks: many(tasks),
  channels: many(channels),
  documents: many(documents),
  files: many(files),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  assignee: one(users, { fields: [tasks.assigneeId], references: [users.id], relationName: "assignee" }),
  creator: one(users, { fields: [tasks.creatorId], references: [users.id], relationName: "creator" }),
  parentTask: one(tasks, { fields: [tasks.parentTaskId], references: [tasks.id], relationName: "parent" }),
  subTasks: many(tasks, { relationName: "parent" }),
  files: many(files),
}));

export const channelsRelations = relations(channels, ({ one, many }) => ({
  team: one(teams, { fields: [channels.teamId], references: [teams.id] }),
  project: one(projects, { fields: [channels.projectId], references: [projects.id] }),
  creator: one(users, { fields: [channels.creatorId], references: [users.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  channel: one(channels, { fields: [messages.channelId], references: [channels.id] }),
  user: one(users, { fields: [messages.userId], references: [users.id] }),
  replyTo: one(messages, { fields: [messages.replyToId], references: [messages.id], relationName: "reply" }),
  replies: many(messages, { relationName: "reply" }),
  files: many(files),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  team: one(teams, { fields: [documents.teamId], references: [teams.id] }),
  project: one(projects, { fields: [documents.projectId], references: [projects.id] }),
  creator: one(users, { fields: [documents.creatorId], references: [users.id] }),
  files: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
  team: one(teams, { fields: [files.teamId], references: [teams.id] }),
  uploader: one(users, { fields: [files.uploaderId], references: [users.id] }),
  project: one(projects, { fields: [files.projectId], references: [projects.id] }),
  task: one(tasks, { fields: [files.taskId], references: [tasks.id] }),
  message: one(messages, { fields: [files.messageId], references: [messages.id] }),
  document: one(documents, { fields: [files.documentId], references: [documents.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const selectUserSchema = createSelectSchema(users);
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTeamSchema = createSelectSchema(teams);

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const selectProjectSchema = createSelectSchema(projects);

export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTaskSchema = createSelectSchema(tasks);

export const insertChannelSchema = createInsertSchema(channels).omit({ id: true, createdAt: true, updatedAt: true });
export const selectChannelSchema = createSelectSchema(channels);

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const selectMessageSchema = createSelectSchema(messages);

export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true, updatedAt: true });
export const selectDocumentSchema = createSelectSchema(documents);

export const insertFileSchema = createInsertSchema(files).omit({ id: true, createdAt: true });
export const selectFileSchema = createSelectSchema(files);

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

export type Session = typeof sessions.$inferSelect;
