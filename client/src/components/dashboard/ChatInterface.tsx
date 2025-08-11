import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreHorizontal,
  Search,
  Hash,
  Lock,
  Users
} from "lucide-react";
import { ChatInterface as LiveChatInterface } from "@/components/chat/ChatInterface";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  unread: number;
  isActive: boolean;
  teamId?: string;
  projectId?: string;
}

const ChatInterface = () => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load user's teams and channels
  useEffect(() => {
    const loadChannels = async () => {
      try {
        setIsLoadingChannels(true);
        
        // First get user's teams
        const teams = await apiClient.get('/api/teams');
        const channelsList: Channel[] = [];

        // Get channels for each team
        for (const team of teams) {
          try {
            const teamChannels = await apiClient.get(`/api/teams/${team.id}/channels`);
            const mappedChannels = teamChannels.map((channel: any) => ({
              id: channel.id,
              name: channel.name,
              type: channel.type,
              unread: 0, // Would come from WebSocket or separate API
              isActive: false,
              teamId: team.id,
              projectId: channel.projectId
            }));
            channelsList.push(...mappedChannels);
          } catch (error) {
            console.error(`Failed to load channels for team ${team.id}:`, error);
          }
        }

        setChannels(channelsList);
        
        // Set first channel as active if available
        if (channelsList.length > 0 && !activeChannel) {
          setActiveChannel(channelsList[0]);
        }
      } catch (error) {
        console.error('Failed to load channels:', error);
        toast({
          title: "Failed to load channels",
          description: "Unable to connect to chat service",
          variant: "destructive",
        });
      } finally {
        setIsLoadingChannels(false);
      }
    };

    if (user) {
      loadChannels();
    }
  }, [user, toast, activeChannel]);

  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
    setChannels(prev => prev.map(c => ({
      ...c,
      isActive: c.id === channel.id
    })));
  };

  return (
    <div className="flex h-[600px] glass-card rounded-xl overflow-hidden">
      {/* Sidebar - Channels */}
      <div className="w-64 border-r border-border/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Team Chat</h2>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search channels..."
              className="w-full pl-10 pr-3 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Channels
            </p>
            {isLoadingChannels ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            ) : channels.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No channels available
              </div>
            ) : (
              channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all ${
                    channel.id === activeChannel?.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  data-testid={`button-channel-${channel.name}`}
                >
                  <div className="flex items-center space-x-2">
                    {channel.type === 'private' ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Hash className="w-3 h-3" />
                    )}
                    <span>{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Direct Messages
            </p>
            {["John Doe", "Lisa Park", "Tom Brown"].map((user, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">
                    {user.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span>{user}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChannel ? (
          <LiveChatInterface
            channelId={activeChannel.id}
            channelName={activeChannel.name}
            channelType={activeChannel.type}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Hash className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No channel selected</h3>
              <p className="text-muted-foreground">
                Select a channel from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;