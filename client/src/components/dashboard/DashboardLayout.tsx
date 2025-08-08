import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FolderKanban, 
  MessageCircle, 
  FileText, 
  BarChart3, 
  Settings, 
  Search,
  Bell,
  User,
  Plus,
  Menu,
  X
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: "Dashboard", href: "#", icon: Home, current: true },
    { name: "Projects", href: "#", icon: FolderKanban, current: false, count: 12 },
    { name: "Messages", href: "#", icon: MessageCircle, current: false, count: 5 },
    { name: "Documents", href: "#", icon: FileText, current: false },
    { name: "Analytics", href: "#", icon: BarChart3, current: false },
    { name: "Settings", href: "#", icon: Settings, current: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-border/50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FolderKanban className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">CollabFlow</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-border/50">
            <Button variant="gradient" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.current
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-4 h-4 ${item.current ? 'text-primary' : ''}`} />
                  <span>{item.name}</span>
                </div>
                {item.count && (
                  <span className="bg-primary/20 text-primary text-xs rounded-full px-2 py-1">
                    {item.count}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center space-x-3 p-3 rounded-lg glass hover:bg-primary/5 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@company.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Bar */}
        <header className="glass-card border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects, tasks, or documents..."
                  className="pl-10 pr-4 py-2 w-80 bg-muted/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></span>
                </span>
              </Button>

              {/* Profile */}
              <Button variant="ghost" size="icon">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;