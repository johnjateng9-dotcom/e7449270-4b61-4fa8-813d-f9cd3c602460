import { useState, useRef, useEffect } from 'react';
import { Send, Users, Hash, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChannelHeader } from './ChannelHeader';

interface ChatInterfaceProps {
  channelId: string;
  channelName: string;
  channelType?: 'public' | 'private' | 'direct';
}

export function ChatInterface({ channelId, channelName, channelType = 'public' }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { messages, typingUsers, isLoading, isConnected, sendMessage, startTyping, stopTyping } = useChat(channelId);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;

    sendMessage(message);
    setMessage('');
    handleStopTyping();
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      startTyping();
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      stopTyping();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-400">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Channel Header */}
      <ChannelHeader 
        channelName={channelName}
        channelType={channelType}
        isConnected={isConnected}
        onlineCount={typingUsers.length + 1} // Rough estimate
      />

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Hash className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.slice().reverse().map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.userId === user?.id}
              />
            ))
          )}
          
          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <TypingIndicator users={typingUsers} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? `Message #${channelName}...` : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400"
            data-testid="input-message"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {!isConnected && (
          <p className="text-xs text-red-400 mt-2">
            Not connected to chat. Messages may not be delivered.
          </p>
        )}
      </div>
    </div>
  );
}