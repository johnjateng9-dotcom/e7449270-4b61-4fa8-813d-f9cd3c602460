import { apiClient } from './api';

export interface WebSocketMessage {
  type: 'join_channel' | 'leave_channel' | 'send_message' | 'typing' | 'stop_typing';
  data: any;
}

export interface WebSocketEvent {
  type: 'connection_established' | 'new_message' | 'user_typing' | 'user_stopped_typing' | 
        'user_joined' | 'user_left' | 'channel_joined' | 'channel_left' | 'error';
  data: any;
}

export interface ChatMessage {
  id: string;
  content: string;
  channelId: string;
  userId: string;
  type: 'text' | 'file' | 'system' | 'call';
  replyToId?: string;
  reactions?: any;
  metadata?: any;
  editedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

type EventHandler = (event: WebSocketEvent) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private isConnecting = false;
  private isConnected = false;
  private currentChannels = new Set<string>();

  constructor() {
    this.connect();
  }

  private async connect() {
    if (this.isConnecting || this.isConnected) return;
    
    this.isConnecting = true;
    
    try {
      const token = apiClient.getToken();
      if (!token) {
        console.log('No auth token available for WebSocket connection');
        this.isConnecting = false;
        return;
      }

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws?token=${encodeURIComponent(token)}`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connection_established', {});
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketEvent = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.isConnecting = false;
        this.ws = null;

        // Clear current channels on disconnect
        this.currentChannels.clear();

        // Attempt to reconnect unless it was a deliberate close
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling WebSocket reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleMessage(message: WebSocketEvent) {
    // Emit to specific event handlers
    const handlers = this.eventHandlers.get(message.type) || [];
    handlers.forEach(handler => handler(message));

    // Special handling for certain message types
    switch (message.type) {
      case 'channel_joined':
        if (message.data.channelId) {
          this.currentChannels.add(message.data.channelId);
        }
        break;
      case 'channel_left':
        if (message.data.channelId) {
          this.currentChannels.delete(message.data.channelId);
        }
        break;
      case 'error':
        console.error('WebSocket error message:', message.data);
        break;
    }
  }

  private emit(type: string, data: any) {
    const handlers = this.eventHandlers.get(type) || [];
    handlers.forEach(handler => handler({ type: type as any, data }));
  }

  // Event subscription methods
  on(eventType: string, handler: EventHandler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  off(eventType: string, handler?: EventHandler) {
    if (!handler) {
      this.eventHandlers.delete(eventType);
    } else {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    }
  }

  // Channel management methods
  joinChannel(channelId: string) {
    if (this.currentChannels.has(channelId)) {
      console.log(`Already joined channel ${channelId}`);
      return;
    }

    this.send({
      type: 'join_channel',
      data: { channelId }
    });
  }

  leaveChannel(channelId: string) {
    if (!this.currentChannels.has(channelId)) {
      console.log(`Not in channel ${channelId}`);
      return;
    }

    this.send({
      type: 'leave_channel',
      data: { channelId }
    });
  }

  // Message methods
  sendMessage(channelId: string, content: string, replyToId?: string) {
    this.send({
      type: 'send_message',
      data: {
        channelId,
        content,
        type: 'text',
        replyToId
      }
    });
  }

  // Typing indicators
  sendTyping(channelId: string) {
    this.send({
      type: 'typing',
      data: { channelId }
    });
  }

  sendStopTyping(channelId: string) {
    this.send({
      type: 'stop_typing',
      data: { channelId }
    });
  }

  // Low-level send method
  private send(message: WebSocketMessage) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message:', message);
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  }

  // Connection state methods
  isConnectedToWebSocket(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  getCurrentChannels(): Set<string> {
    return new Set(this.currentChannels);
  }

  // Cleanup method
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.currentChannels.clear();
    this.eventHandlers.clear();
  }

  // Reconnect method for manual reconnection
  reconnect() {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

// Create a singleton instance
export const wsClient = new WebSocketClient();

// Hook for React components
export function useWebSocket() {
  return {
    wsClient,
    isConnected: wsClient.isConnectedToWebSocket(),
    joinChannel: (channelId: string) => wsClient.joinChannel(channelId),
    leaveChannel: (channelId: string) => wsClient.leaveChannel(channelId),
    sendMessage: (channelId: string, content: string, replyToId?: string) => 
      wsClient.sendMessage(channelId, content, replyToId),
    sendTyping: (channelId: string) => wsClient.sendTyping(channelId),
    sendStopTyping: (channelId: string) => wsClient.sendStopTyping(channelId),
    on: (eventType: string, handler: EventHandler) => wsClient.on(eventType, handler),
    off: (eventType: string, handler?: EventHandler) => wsClient.off(eventType, handler),
    getCurrentChannels: () => wsClient.getCurrentChannels(),
    reconnect: () => wsClient.reconnect()
  };
}