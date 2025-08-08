import { db } from "./db";
import { 
  users, teams, projects, tasks, channels, messages, documents, files,
  type User, type Team, type Project, type Task, type Channel, type Message, type Document, type File,
  type InsertUser, type InsertTeam, type InsertProject, type InsertTask, type InsertChannel, type InsertMessage, type InsertDocument, type InsertFile
} from "@shared/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Team operations
  getTeam(id: string): Promise<Team | undefined>;
  getUserTeams(userId: string): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined>;

  // Project operations
  getProject(id: string): Promise<Project | undefined>;
  getTeamProjects(teamId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;

  // Task operations
  getTask(id: string): Promise<Task | undefined>;
  getProjectTasks(projectId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<void>;

  // Channel operations
  getChannel(id: string): Promise<Channel | undefined>;
  getTeamChannels(teamId: string): Promise<Channel[]>;
  createChannel(channel: InsertChannel): Promise<Channel>;

  // Message operations
  getMessage(id: string): Promise<Message | undefined>;
  getChannelMessages(channelId: string, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: string, updates: Partial<Message>): Promise<Message | undefined>;

  // Document operations
  getDocument(id: string): Promise<Document | undefined>;
  getTeamDocuments(teamId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined>;

  // File operations
  getFile(id: string): Promise<File | undefined>;
  getTeamFiles(teamId: string): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) return undefined;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!user) return undefined;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  // Team operations
  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
    return team || undefined;
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    return await db.select({
      id: teams.id,
      name: teams.name,
      slug: teams.slug,
      description: teams.description,
      avatar: teams.avatar,
      ownerId: teams.ownerId,
      subscriptionPlan: teams.subscriptionPlan,
      settings: teams.settings,
      createdAt: teams.createdAt,
      updatedAt: teams.updatedAt,
    })
    .from(teams)
    .innerJoin(users, eq(teams.ownerId, users.id))
    .where(eq(users.id, userId));
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(insertTeam).returning();
    return team;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined> {
    const [team] = await db.update(teams)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return team || undefined;
  }

  // Project operations
  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return project || undefined;
  }

  async getTeamProjects(teamId: string): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.teamId, teamId))
      .orderBy(desc(projects.createdAt));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const [project] = await db.update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  // Task operations
  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return task || undefined;
  }

  async getProjectTasks(projectId: string): Promise<Task[]> {
    return await db.select().from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(asc(tasks.position), desc(tasks.createdAt));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db.update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Channel operations
  async getChannel(id: string): Promise<Channel | undefined> {
    const [channel] = await db.select().from(channels).where(eq(channels.id, id)).limit(1);
    return channel || undefined;
  }

  async getTeamChannels(teamId: string): Promise<Channel[]> {
    return await db.select().from(channels)
      .where(eq(channels.teamId, teamId))
      .orderBy(asc(channels.name));
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel> {
    const [channel] = await db.insert(channels).values(insertChannel).returning();
    return channel;
  }

  // Message operations
  async getMessage(id: string): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return message || undefined;
  }

  async getChannelMessages(channelId: string, limit: number = 50): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.channelId, channelId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<Message | undefined> {
    const [message] = await db.update(messages)
      .set({ ...updates, editedAt: new Date() })
      .where(eq(messages.id, id))
      .returning();
    return message || undefined;
  }

  // Document operations
  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
    return document || undefined;
  }

  async getTeamDocuments(teamId: string): Promise<Document[]> {
    return await db.select().from(documents)
      .where(eq(documents.teamId, teamId))
      .orderBy(desc(documents.updatedAt));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db.insert(documents).values(insertDocument).returning();
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const [document] = await db.update(documents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return document || undefined;
  }

  // File operations
  async getFile(id: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id)).limit(1);
    return file || undefined;
  }

  async getTeamFiles(teamId: string): Promise<File[]> {
    return await db.select().from(files)
      .where(eq(files.teamId, teamId))
      .orderBy(desc(files.createdAt));
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await db.insert(files).values(insertFile).returning();
    return file;
  }
}

export const storage = new DatabaseStorage();
