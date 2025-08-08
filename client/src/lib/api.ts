import { z } from 'zod';
import type { 
  User, Team, Project, Task, Channel, Message, Document, File,
  LoginCredentials, RegisterCredentials, InsertTeam, InsertProject, 
  InsertTask, InsertChannel, InsertMessage, InsertDocument 
} from '@shared/schema';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

class ApiError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new ApiError(response.status, errorData.message || 'Request failed', errorData);
    }

    return response.json();
  }

  // Authentication endpoints
  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    const result = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(result.token);
    return result;
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const result = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(result.token);
    return result;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.setToken(null);
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  // Team endpoints
  async getTeams(): Promise<Team[]> {
    return this.request<Team[]>('/teams');
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    return this.request<Team>('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  async getTeam(teamId: string): Promise<Team> {
    return this.request<Team>(`/teams/${teamId}`);
  }

  // Project endpoints
  async getTeamProjects(teamId: string): Promise<Project[]> {
    return this.request<Project[]>(`/teams/${teamId}/projects`);
  }

  async createProject(teamId: string, project: Omit<InsertProject, 'teamId' | 'ownerId'>): Promise<Project> {
    return this.request<Project>(`/teams/${teamId}/projects`, {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async getProject(projectId: string): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}`);
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Task endpoints
  async getProjectTasks(projectId: string): Promise<Task[]> {
    return this.request<Task[]>(`/projects/${projectId}/tasks`);
  }

  async createTask(projectId: string, task: Omit<InsertTask, 'projectId' | 'creatorId'>): Promise<Task> {
    return this.request<Task>(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async getTask(taskId: string): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}`);
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.request(`/tasks/${taskId}`, { method: 'DELETE' });
  }

  // Channel endpoints
  async getTeamChannels(teamId: string): Promise<Channel[]> {
    return this.request<Channel[]>(`/teams/${teamId}/channels`);
  }

  async createChannel(teamId: string, channel: Omit<InsertChannel, 'teamId' | 'creatorId'>): Promise<Channel> {
    return this.request<Channel>(`/teams/${teamId}/channels`, {
      method: 'POST',
      body: JSON.stringify(channel),
    });
  }

  // Message endpoints
  async getChannelMessages(channelId: string, limit?: number): Promise<Message[]> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<Message[]>(`/channels/${channelId}/messages${query}`);
  }

  async createMessage(channelId: string, message: Omit<InsertMessage, 'channelId' | 'userId'>): Promise<Message> {
    return this.request<Message>(`/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  // Document endpoints
  async getTeamDocuments(teamId: string): Promise<Document[]> {
    return this.request<Document[]>(`/teams/${teamId}/documents`);
  }

  async createDocument(teamId: string, document: Omit<InsertDocument, 'teamId' | 'creatorId'>): Promise<Document> {
    return this.request<Document>(`/teams/${teamId}/documents`, {
      method: 'POST',
      body: JSON.stringify(document),
    });
  }

  async getDocument(documentId: string): Promise<Document> {
    return this.request<Document>(`/documents/${documentId}`);
  }

  async updateDocument(documentId: string, updates: Partial<Document>): Promise<Document> {
    return this.request<Document>(`/documents/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // File endpoints
  async getTeamFiles(teamId: string): Promise<File[]> {
    return this.request<File[]>(`/teams/${teamId}/files`);
  }
}

export const apiClient = new ApiClient();
export { ApiError };