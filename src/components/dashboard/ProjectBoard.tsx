import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  User, 
  Flag,
  Clock,
  MessageCircle,
  Paperclip
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  comments: number;
  attachments: number;
  labels: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

const ProjectBoard = () => {
  const [columns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      color: "border-blue-500/30 bg-blue-500/10",
      tasks: [
        {
          id: "1",
          title: "Design new landing page",
          description: "Create wireframes and mockups for the new product landing page",
          assignee: "Sarah Chen",
          priority: "high",
          dueDate: "2024-01-15",
          comments: 3,
          attachments: 2,
          labels: ["Design", "Frontend"]
        },
        {
          id: "2",
          title: "User research interviews",
          description: "Conduct 5 user interviews to validate new feature concepts",
          assignee: "Mike Johnson",
          priority: "medium",
          dueDate: "2024-01-18",
          comments: 1,
          attachments: 0,
          labels: ["Research", "UX"]
        }
      ]
    },
    {
      id: "progress",
      title: "In Progress",
      color: "border-yellow-500/30 bg-yellow-500/10",
      tasks: [
        {
          id: "3",
          title: "API integration for payments",
          description: "Integrate Stripe payment system with the backend API",
          assignee: "Alex Kim",
          priority: "high",
          dueDate: "2024-01-20",
          comments: 5,
          attachments: 1,
          labels: ["Backend", "Integration"]
        }
      ]
    },
    {
      id: "review",
      title: "In Review",
      color: "border-purple-500/30 bg-purple-500/10",
      tasks: [
        {
          id: "4",
          title: "Mobile app testing",
          description: "Complete QA testing for iOS and Android versions",
          assignee: "Emma Wilson",
          priority: "medium",
          dueDate: "2024-01-12",
          comments: 2,
          attachments: 3,
          labels: ["Testing", "Mobile"]
        }
      ]
    },
    {
      id: "done",
      title: "Done",
      color: "border-green-500/30 bg-green-500/10",
      tasks: [
        {
          id: "5",
          title: "Database optimization",
          description: "Improved query performance by 40%",
          assignee: "David Lee",
          priority: "low",
          dueDate: "2024-01-10",
          comments: 4,
          attachments: 1,
          labels: ["Backend", "Performance"]
        }
      ]
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="glass-card p-4 rounded-lg cursor-pointer hover:shadow-soft transition-all duration-200 group">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-sm leading-tight pr-2">{task.title}</h3>
        <Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>

      {/* Task Description */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

      {/* Labels */}
      <div className="flex flex-wrap gap-1 mb-3">
        {task.labels.map((label, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Task Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          {/* Priority */}
          <div className="flex items-center space-x-1">
            <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
            <span className="text-muted-foreground capitalize">{task.priority}</span>
          </div>

          {/* Due Date */}
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Comments */}
          {task.comments > 0 && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MessageCircle className="w-3 h-3" />
              <span>{task.comments}</span>
            </div>
          )}

          {/* Attachments */}
          {task.attachments > 0 && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Paperclip className="w-3 h-3" />
              <span>{task.attachments}</span>
            </div>
          )}

          {/* Assignee */}
          <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-medium">
              {task.assignee.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Development</h1>
          <p className="text-muted-foreground">Manage tasks and track progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4 mr-2" />
            Team
          </Button>
          <Button variant="gradient" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            {/* Column Header */}
            <div className={`p-4 rounded-lg border ${column.color}`}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm">{column.title}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    {column.tasks.length}
                  </span>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3 min-h-[400px]">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectBoard;