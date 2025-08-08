import { useState } from "react";
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

interface Message {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  reactions?: string[];
}

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'dm';
  unread: number;
  isActive: boolean;
}

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");

  const channels: Channel[] = [
    { id: "general", name: "general", type: "public", unread: 0, isActive: true },
    { id: "development", name: "development", type: "public", unread: 3, isActive: false },
    { id: "design", name: "design", type: "public", unread: 1, isActive: false },
    { id: "random", name: "random", type: "public", unread: 0, isActive: false },
    { id: "private-team", name: "leadership-team", type: "private", unread: 2, isActive: false },
  ];

  const messages: Message[] = [
    {
      id: "1",
      user: "Sarah Chen",
      avatar: "SC",
      content: "Hey team! Just pushed the latest design updates to the repository. Can everyone please review?",
      timestamp: "10:30 AM",
      type: "text",
      reactions: ["👍", "🎉"]
    },
    {
      id: "2",
      user: "Mike Johnson",
      avatar: "MJ",
      content: "Looks great! The new color scheme really improves readability.",
      timestamp: "10:32 AM",
      type: "text"
    },
    {
      id: "3",
      user: "Alex Kim",
      avatar: "AK",
      content: "I've tested the payment integration and it's working perfectly. Ready for deployment! 🚀",
      timestamp: "10:35 AM",
      type: "text",
      reactions: ["🚀", "✅"]
    },
    {
      id: "4",
      user: "System",
      avatar: "SYS",
      content: "Emma Wilson uploaded mobile-app-screenshots.zip",
      timestamp: "10:40 AM",
      type: "file"
    },
    {
      id: "5",
      user: "Emma Wilson",
      avatar: "EW",
      content: "Here are the latest screenshots from our mobile testing. Everything looks good on both iOS and Android!",
      timestamp: "10:41 AM",
      type: "text"
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all ${
                  channel.id === activeChannel 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
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
            ))}
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
        {/* Chat Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Hash className="w-5 h-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">general</h3>
              <p className="text-xs text-muted-foreground">12 members</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Users className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex space-x-3 group">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-primary-foreground font-medium">{msg.avatar}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="font-medium text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                
                <div className={`${msg.type === 'file' ? 'bg-muted/30 p-3 rounded-lg border border-border/50' : ''}`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex space-x-1 mt-2">
                      {msg.reactions.map((reaction, index) => (
                        <button
                          key={index}
                          className="bg-muted/50 hover:bg-muted px-2 py-1 rounded-md text-xs transition-colors"
                        >
                          {reaction}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                rows={1}
              />
              <div className="absolute right-3 top-3 flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="gradient" 
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;