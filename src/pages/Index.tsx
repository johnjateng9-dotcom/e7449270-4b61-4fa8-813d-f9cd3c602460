import { useState } from "react";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import PricingSection from "@/components/sections/PricingSection";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProjectBoard from "@/components/dashboard/ProjectBoard";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import ChatInterface from "@/components/dashboard/ChatInterface";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  MessageCircle, 
  FolderKanban, 
  FileText, 
  Users, 
  Zap,
  ArrowLeft
} from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'projects' | 'analytics' | 'chat' | 'documents'>('landing');

  // Landing Page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        
        {/* Features Preview Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Everything Your Team Needs
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the power of unified collaboration with live demos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  icon: FolderKanban, 
                  title: "Project Management", 
                  description: "Kanban boards, Gantt charts, task automation",
                  action: () => setCurrentView('projects')
                },
                { 
                  icon: MessageCircle, 
                  title: "Team Chat", 
                  description: "Real-time messaging, video calls, file sharing",
                  action: () => setCurrentView('chat')
                },
                { 
                  icon: BarChart3, 
                  title: "Analytics", 
                  description: "Performance tracking, revenue insights, reports",
                  action: () => setCurrentView('analytics')
                },
                { 
                  icon: FileText, 
                  title: "Documents", 
                  description: "Collaborative editing, version control, templates",
                  action: () => setCurrentView('documents')
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="glass-card p-6 rounded-xl text-center hover:shadow-glow transition-all duration-300 cursor-pointer group"
                  onClick={feature.action}
                >
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => setCurrentView('dashboard')}
                className="animate-glow"
              >
                <Zap className="w-5 h-5 mr-2" />
                Try Interactive Demo
              </Button>
            </div>
          </div>
        </section>

        <PricingSection />
        
        {/* Footer */}
        <footer className="glass-card border-t border-border/50 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">CollabFlow</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The unified workspace for modern teams. Built for collaboration, designed for success.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Enterprise</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2024 CollabFlow. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Dashboard Views
  const renderDashboardContent = () => {
    switch (currentView) {
      case 'projects':
        return <ProjectBoard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'chat':
        return <ChatInterface />;
      case 'documents':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Documents</h1>
                <p className="text-muted-foreground">Collaborative document editing</p>
              </div>
              <Button variant="gradient">
                <FileText className="w-4 h-4 mr-2" />
                New Document
              </Button>
            </div>
            
            <div className="glass-card p-8 rounded-xl text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Document Editor</h3>
              <p className="text-muted-foreground mb-6">
                Real-time collaborative document editing with version history, comments, and rich formatting.
              </p>
              <div className="bg-gradient-glass p-6 rounded-lg border border-border/50">
                <div className="text-left space-y-3">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-4/5"></div>
                  <div className="h-3 bg-primary/30 rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Overview</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening with your team.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: FolderKanban, title: "Active Projects", value: "24", change: "+12%" },
                { icon: Users, title: "Team Members", value: "156", change: "+8%" },
                { icon: MessageCircle, title: "Messages Today", value: "1,247", change: "+23%" },
                { icon: BarChart3, title: "Productivity", value: "94%", change: "+5%" }
              ].map((stat, index) => (
                <div key={index} className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-success">{stat.change}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: FolderKanban, label: "New Project", action: () => setCurrentView('projects') },
                    { icon: MessageCircle, label: "Start Chat", action: () => setCurrentView('chat') },
                    { icon: FileText, label: "Create Doc", action: () => setCurrentView('documents') },
                    { icon: BarChart3, label: "View Analytics", action: () => setCurrentView('analytics') }
                  ].map((action, index) => (
                    <Button 
                      key={index} 
                      variant="glass" 
                      className="p-4 h-auto flex-col space-y-2"
                      onClick={action.action}
                    >
                      <action.icon className="w-6 h-6" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    "Sarah completed 'Landing Page Design'",
                    "New message in #development channel",
                    "Mike started 'User Research Phase 2'",
                    "3 new files uploaded to project"
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center space-x-4">
        <Button 
          variant="glass" 
          size="sm"
          onClick={() => setCurrentView('landing')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Landing
        </Button>
        <div className="text-sm text-muted-foreground">
          Interactive Demo Mode
        </div>
      </div>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default Index;
