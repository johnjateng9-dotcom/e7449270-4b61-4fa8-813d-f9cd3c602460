import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket, type ChatMessage, type WebSocketEvent } from '@/lib/websocket';
import { useToast } from '@/hooks/use-toast';

interface TypingUser {
  id: string;
  firstName?: string;
  lastName?: string;
}

export function useChat(channelId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { wsClient, joinChannel, leaveChannel, sendMessage, sendTyping, sendStopTyping, on, off } = useWebSocket();
  const { toast } = useToast();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Join/leave channel when channelId changes
  useEffect(() => {
    if (!channelId) return;

    setIsLoading(true);
    joinChannel(channelId);

    return () => {
      leaveChannel(channelId);
    };
  }, [channelId, joinChannel, leaveChannel]);

  // Set up event handlers
  useEffect(() => {
    const handleConnectionEstablished = (event: WebSocketEvent) => {
      setIsConnected(true);
    };

    const handleChannelJoined = (event: WebSocketEvent) => {
      if (event.data.channelId === channelId) {
        setMessages(event.data.messages || []);
        setIsLoading(false);
        setIsConnected(true);
        toast({
          title: "Connected to chat",
          description: "You've joined the channel successfully",
        });
      }
    };

    const handleNewMessage = (event: WebSocketEvent) => {
      const { message } = event.data;
      if (message.channelId === channelId) {
        setMessages(prev => [message, ...prev]);
      }
    };

    const handleUserTyping = (event: WebSocketEvent) => {
      const { user } = event.data;
      if (event.data.channelId === channelId && user) {
        setTypingUsers(prev => {
          const exists = prev.find(u => u.id === user.id);
          if (!exists) {
            return [...prev, user];
          }
          return prev;
        });
      }
    };

    const handleUserStoppedTyping = (event: WebSocketEvent) => {
      const { user } = event.data;
      if (event.data.channelId === channelId && user) {
        setTypingUsers(prev => prev.filter(u => u.id !== user.id));
      }
    };

    const handleUserJoined = (event: WebSocketEvent) => {
      if (event.data.channelId === channelId) {
        const userName = event.data.user?.firstName || event.data.user?.email || 'Someone';
        toast({
          title: "User joined",
          description: `${userName} joined the channel`,
        });
      }
    };

    const handleUserLeft = (event: WebSocketEvent) => {
      if (event.data.channelId === channelId) {
        const userName = event.data.user?.firstName || event.data.user?.email || 'Someone';
        toast({
          title: "User left",
          description: `${userName} left the channel`,
        });
      }
    };

    const handleError = (event: WebSocketEvent) => {
      console.error('Chat error:', event.data);
      setIsConnected(false);
      toast({
        title: "Chat error",
        description: event.data.message || "An error occurred in the chat",
        variant: "destructive",
      });
    };

    // Subscribe to events
    const unsubscribers = [
      on('connection_established', handleConnectionEstablished),
      on('channel_joined', handleChannelJoined),
      on('new_message', handleNewMessage),
      on('user_typing', handleUserTyping),
      on('user_stopped_typing', handleUserStoppedTyping),
      on('user_joined', handleUserJoined),
      on('user_left', handleUserLeft),
      on('error', handleError),
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [channelId, on, off, toast]);

  // Send message function
  const handleSendMessage = useCallback((content: string, replyToId?: string) => {
    if (!content.trim() || !isConnected) return;

    sendMessage(channelId, content.trim(), replyToId);
  }, [channelId, isConnected, sendMessage]);

  // Typing indicator functions
  const handleStartTyping = useCallback(() => {
    if (!isConnected) return;

    sendTyping(channelId);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
  }, [channelId, isConnected, sendTyping]);

  const handleStopTyping = useCallback(() => {
    if (!isConnected) return;

    sendStopTyping(channelId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [channelId, isConnected, sendStopTyping]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages,
    typingUsers,
    isLoading,
    isConnected,
    sendMessage: handleSendMessage,
    startTyping: handleStartTyping,
    stopTyping: handleStopTyping,
  };
}