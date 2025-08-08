import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Users, Zap, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 animate-slide-up">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Real-Time Collaboration Platform</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Unified Workspace
            </span>
            <br />
            <span className="text-foreground">
              for Modern Teams
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Combine project management, real-time collaboration, and team communication in one powerful platform. 
            Built for teams who demand excellence.
          </p>

          {/* Hero CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="glass" size="xl" className="w-full sm:w-auto">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>50,000+ teams worldwide</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>99.9% uptime guarantee</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-16 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="relative max-w-5xl mx-auto">
            <div className="glass-card p-8 rounded-2xl shadow-soft">
              <div className="bg-gradient-glass rounded-lg p-6 border border-border/50">
                {/* Mock Dashboard */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-3">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">CollabFlow Dashboard</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="glass p-4 rounded-lg">
                    <div className="h-2 bg-primary/30 rounded mb-2"></div>
                    <div className="h-1 bg-muted rounded mb-1"></div>
                    <div className="h-1 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <div className="h-2 bg-accent/30 rounded mb-2"></div>
                    <div className="h-1 bg-muted rounded mb-1"></div>
                    <div className="h-1 bg-muted rounded w-2/3"></div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <div className="h-2 bg-success/30 rounded mb-2"></div>
                    <div className="h-1 bg-muted rounded mb-1"></div>
                    <div className="h-1 bg-muted rounded w-4/5"></div>
                  </div>
                </div>
                
                <div className="h-32 bg-gradient-glass rounded-lg border border-border/30"></div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/20 rounded-lg backdrop-blur-sm border border-primary/30 animate-float"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-accent/20 rounded-lg backdrop-blur-sm border border-accent/30 animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;