import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService, requireAuth, optionalAuth, type AuthenticatedRequest } from "./auth";
import { 
  loginSchema, registerSchema, insertTeamSchema, insertProjectSchema, 
  insertTaskSchema, insertChannelSchema, insertMessageSchema, insertDocumentSchema 
} from "@shared/schema";
import { z } from "zod";
import { initializeWebSocket } from "./websocket";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const credentials = registerSchema.parse(req.body);
      const { user, token } = await authService.register(credentials);
      res.status(201).json({ user, token });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(400).json({ error: error instanceof Error ? error.message : 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const { user, token } = await authService.login(
        credentials, 
        req.ip, 
        req.headers['user-agent']
      );
      res.json({ user, token });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(401).json({ error: error instanceof Error ? error.message : 'Login failed' });
    }
  });

  app.post('/api/auth/logout', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        await authService.logout(token);
      }
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  app.get('/api/auth/me', requireAuth, async (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  // Team routes
  app.get('/api/teams', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const teams = await storage.getUserTeams(req.user!.id);
      res.json(teams);
    } catch (error) {
      console.error('Get teams error:', error);
      res.status(500).json({ error: 'Failed to fetch teams' });
    }
  });

  app.post('/api/teams', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const teamData = insertTeamSchema.parse({ ...req.body, ownerId: req.user!.id });
      const team = await storage.createTeam(teamData);
      res.status(201).json(team);
    } catch (error) {
      console.error('Create team error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create team' });
    }
  });

  app.get('/api/teams/:teamId', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const team = await storage.getTeam(req.params.teamId);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.json(team);
    } catch (error) {
      console.error('Get team error:', error);
      res.status(500).json({ error: 'Failed to fetch team' });
    }
  });

  // Project routes
  app.get('/api/teams/:teamId/projects', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const projects = await storage.getTeamProjects(req.params.teamId);
      res.json(projects);
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.post('/api/teams/:teamId/projects', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        teamId: req.params.teamId,
        ownerId: req.user!.id
      });
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      console.error('Create project error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.get('/api/projects/:projectId', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const project = await storage.getProject(req.params.projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.put('/api/projects/:projectId', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;
      const project = await storage.updateProject(req.params.projectId, updates);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  // Task routes
  app.get('/api/projects/:projectId/tasks', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const tasks = await storage.getProjectTasks(req.params.projectId);
      res.json(tasks);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  app.post('/api/projects/:projectId/tasks', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
        creatorId: req.user!.id
      });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  app.get('/api/tasks/:taskId', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const task = await storage.getTask(req.params.taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  });

  app.put('/api/tasks/:taskId', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;
      const task = await storage.updateTask(req.params.taskId, updates);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  app.delete('/api/tasks/:taskId', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      await storage.deleteTask(req.params.taskId);
      res.status(204).send();
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  // Channel routes
  app.get('/api/teams/:teamId/channels', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const channels = await storage.getTeamChannels(req.params.teamId);
      res.json(channels);
    } catch (error) {
      console.error('Get channels error:', error);
      res.status(500).json({ error: 'Failed to fetch channels' });
    }
  });

  app.post('/api/teams/:teamId/channels', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const channelData = insertChannelSchema.parse({
        ...req.body,
        teamId: req.params.teamId,
        creatorId: req.user!.id
      });
      const channel = await storage.createChannel(channelData);
      res.status(201).json(channel);
    } catch (error) {
      console.error('Create channel error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create channel' });
    }
  });

  // Message routes
  app.get('/api/channels/:channelId/messages', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getChannelMessages(req.params.channelId, limit);
      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.post('/api/channels/:channelId/messages', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        channelId: req.params.channelId,
        userId: req.user!.id
      });
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error('Create message error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create message' });
    }
  });

  // Document routes
  app.get('/api/teams/:teamId/documents', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const documents = await storage.getTeamDocuments(req.params.teamId);
      res.json(documents);
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  });

  app.post('/api/teams/:teamId/documents', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        teamId: req.params.teamId,
        creatorId: req.user!.id
      });
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      console.error('Create document error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create document' });
    }
  });

  app.get('/api/documents/:documentId', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const document = await storage.getDocument(req.params.documentId);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      console.error('Get document error:', error);
      res.status(500).json({ error: 'Failed to fetch document' });
    }
  });

  app.put('/api/documents/:documentId', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;
      const document = await storage.updateDocument(req.params.documentId, updates);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      console.error('Update document error:', error);
      res.status(500).json({ error: 'Failed to update document' });
    }
  });

  // File routes
  app.get('/api/teams/:teamId/files', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const files = await storage.getTeamFiles(req.params.teamId);
      res.json(files);
    } catch (error) {
      console.error('Get files error:', error);
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize WebSocket server
  initializeWebSocket(httpServer);

  return httpServer;
}
