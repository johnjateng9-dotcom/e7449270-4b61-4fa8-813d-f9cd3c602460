import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { Team, Project, Task, Channel, Message, Document } from '@shared/schema';

// Teams
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => apiClient.getTeams(),
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiClient.createTeam.bind(apiClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: "Team created",
        description: "Your new team has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    },
  });
}

// Projects
export function useTeamProjects(teamId: string) {
  return useQuery({
    queryKey: ['teams', teamId, 'projects'],
    queryFn: () => apiClient.getTeamProjects(teamId),
    enabled: !!teamId,
  });
}

export function useCreateProject(teamId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (project: Parameters<typeof apiClient.createProject>[1]) =>
      apiClient.createProject(teamId, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'projects'] });
      toast({
        title: "Project created",
        description: "Your new project has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });
}

// Tasks
export function useProjectTasks(projectId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['projects', projectId, 'tasks'],
    queryFn: () => apiClient.getProjectTasks(projectId),
    enabled: !!projectId && (options?.enabled !== false),
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (task: Parameters<typeof apiClient.createTask>[1]) =>
      apiClient.createTask(projectId, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
      toast({
        title: "Task created",
        description: "Your new task has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
      apiClient.updateTask(taskId, updates),
    onSuccess: (_, variables) => {
      // Invalidate both task-specific and project tasks queries
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Task updated",
        description: "Task has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiClient.deleteTask.bind(apiClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });
}

// Channels
export function useTeamChannels(teamId: string) {
  return useQuery({
    queryKey: ['teams', teamId, 'channels'],
    queryFn: () => apiClient.getTeamChannels(teamId),
    enabled: !!teamId,
  });
}

export function useCreateChannel(teamId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (channel: Parameters<typeof apiClient.createChannel>[1]) =>
      apiClient.createChannel(teamId, channel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'channels'] });
      toast({
        title: "Channel created",
        description: "Your new channel has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create channel",
        variant: "destructive",
      });
    },
  });
}

// Messages
export function useChannelMessages(channelId: string, limit?: number) {
  return useQuery({
    queryKey: ['channels', channelId, 'messages', limit],
    queryFn: () => apiClient.getChannelMessages(channelId, limit),
    enabled: !!channelId,
  });
}

export function useCreateMessage(channelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: Parameters<typeof apiClient.createMessage>[1]) =>
      apiClient.createMessage(channelId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels', channelId, 'messages'] });
    },
  });
}

// Documents
export function useTeamDocuments(teamId: string) {
  return useQuery({
    queryKey: ['teams', teamId, 'documents'],
    queryFn: () => apiClient.getTeamDocuments(teamId),
    enabled: !!teamId,
  });
}

export function useCreateDocument(teamId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (document: Parameters<typeof apiClient.createDocument>[1]) =>
      apiClient.createDocument(teamId, document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'documents'] });
      toast({
        title: "Document created",
        description: "Your new document has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      });
    },
  });
}