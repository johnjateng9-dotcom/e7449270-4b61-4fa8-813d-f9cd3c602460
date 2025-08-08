import { useState } from 'react';
import { useTeams, useTeamProjects, useProjectTasks } from '@/hooks/useApiQuery';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  FolderOpen, 
  CheckSquare, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Clock,
  Plus
} from 'lucide-react';

export function DashboardContent() {
  const { user } = useAuth();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  
  // Get first team's ID for initial data
  const firstTeamId = teams?.[0]?.id || '';
  const teamId = selectedTeamId || firstTeamId;
  
  const { data: projects, isLoading: projectsLoading } = useTeamProjects(teamId);
  const firstProjectId = projects?.[0]?.id;
  const { data: tasks, isLoading: tasksLoading } = useProjectTasks(firstProjectId || '');

  const stats = [
    {
      title: 'Active Teams',
      value: teams?.length || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Projects',
      value: projects?.length || 0,
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Tasks',
      value: tasks?.length || 0,
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Messages',
      value: '24', // This would come from messages API
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening with your teams today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardContent className="flex items-center p-6">
              <div className={`${stat.bgColor} p-3 rounded-lg mr-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Recent Projects</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {projects?.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                ))}
                {(!projects || projects.length === 0) && (
                  <p className="text-muted-foreground text-center py-6">
                    No projects yet. Create your first project to get started!
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Recent Tasks</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {tasks?.slice(0, 6).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getPriorityColor(task.priority)} variant="outline">
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
                {(!tasks || tasks.length === 0) && (
                  <p className="text-muted-foreground text-center py-6">
                    No tasks yet. Create your first task to get started!
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Teams Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your Teams</CardTitle>
          <CardDescription>
            Teams you're part of and their current activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams?.map((team) => (
                <Card key={team.id} className="border-2 hover:border-primary/50 cursor-pointer transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{team.name}</h4>
                      <Badge variant="outline">{team.subscriptionPlan}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {team.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        Team • {team.slug}
                      </div>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!teams || teams.length === 0) && (
                <div className="col-span-full text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No teams yet. Create or join a team to start collaborating!
                  </p>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Team
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}