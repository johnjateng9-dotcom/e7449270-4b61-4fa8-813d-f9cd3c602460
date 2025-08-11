import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
import type { User, Message, Channel } from '@shared/schema';
import { insertMessageSchema } from '@shared/schema';
import { z } from 'zod';

interface AuthenticatedWebSocket extends WebSocket {
  user?: User;
  userId?: string;
  channels?: Set<string>; // Channel IDs the user has joined
}

interface WebSocketMessage {
  type: 'join_channel' | 'leave_channel' | 'send_message' | 'typing' | 'stop_typing';
  data: any;
}

interface BroadcastMessage {
  type: 'new_message' | 'user_typing' | 'user_stopped_typing' | 'user_joined' | 'user_left' | 'channel_updated' | 'connection_established' | 'channel_joined' | 'channel_left' | 'error';
  data: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients = new Map<string, AuthenticatedWebSocket>(); // userId -> WebSocket
  private channelSubscriptions = new Map<string, Set<string>>(); // channelId -> Set of userIds

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      verifyClient: (info) => {
        console.log('verifyClient called for:', info.req.url);
        return this.verifyClient(info);
      }
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    console.log('WebSocket server initialized');
  }

  private async verifyClient(info: any): Promise<boolean> {
    try {
      const url = new URL(info.req.url, 'http://localhost');
      const token = url.searchParams.get('token');
      
      if (!token) {
        console.log('WebSocket connection rejected: No token provided');
        return false;
      }

      console.log('Verifying WebSocket token:', token.substring(0, 20) + '...');
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log('Decoded token userId:', decoded.userId);
      
      const user = await storage.getUserById(decoded.userId);
      console.log('Found user:', user ? user.email : 'null');
      
      if (!user) {
        console.log('WebSocket connection rejected: Invalid user');
        return false;
      }

      // Store user info in the request for later use
      info.req.user = user;
      console.log('WebSocket client verified successfully for user:', user.email);
      return true;
    } catch (error) {
      console.log('WebSocket connection rejected:', error);
      return false;
    }
  }

  private handleConnection(ws: AuthenticatedWebSocket, req: any) {
    const user = req.user as User;
    if (!user) {
      console.error('No user found in WebSocket connection request');
      ws.close();
      return;
    }
    ws.user = user;
    ws.userId = user.id;
    ws.channels = new Set();

    // Store the connection
    this.clients.set(user.id, ws);

    console.log(`User ${user.email} connected via WebSocket`);

    // Send welcome message
    this.sendToClient(ws, {
      type: 'connection_established',
      data: { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } }
    });

    ws.on('message', (data) => this.handleMessage(ws, Buffer.from(data as ArrayBuffer)));
    ws.on('close', () => this.handleDisconnection(ws));
    ws.on('error', (error) => {
      console.error('WebSocket error for user', user.email, ':', error);
    });
  }

  private async handleMessage(ws: AuthenticatedWebSocket, data: Buffer) {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'join_channel':
          await this.handleJoinChannel(ws, message.data.channelId);
          break;
        case 'leave_channel':
          await this.handleLeaveChannel(ws, message.data.channelId);
          break;
        case 'send_message':
          await this.handleSendMessage(ws, message.data);
          break;
        case 'typing':
          await this.handleTyping(ws, message.data.channelId, true);
          break;
        case 'stop_typing':
          await this.handleTyping(ws, message.data.channelId, false);
          break;
        default:
          console.log('Unknown WebSocket message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      this.sendToClient(ws, {
        type: 'error',
        data: { message: 'Invalid message format' }
      });
    }
  }

  private async handleJoinChannel(ws: AuthenticatedWebSocket, channelId: string) {
    try {
      if (!ws.userId) return;

      // Verify user has access to this channel
      const channel = await storage.getChannelById(channelId);
      if (!channel) {
        this.sendToClient(ws, {
          type: 'error',
          data: { message: 'Channel not found' }
        });
        return;
      }

      // Check if user is a member of the team that owns this channel
      const userTeams = await storage.getUserTeams(ws.userId);
      const hasAccess = userTeams.some(team => team.id === channel.teamId);
      
      if (!hasAccess) {
        this.sendToClient(ws, {
          type: 'error',
          data: { message: 'Access denied to channel' }
        });
        return;
      }

      // Add user to channel subscriptions
      ws.channels?.add(channelId);
      
      if (!this.channelSubscriptions.has(channelId)) {
        this.channelSubscriptions.set(channelId, new Set());
      }
      this.channelSubscriptions.get(channelId)!.add(ws.userId);

      // Get recent messages for this channel
      const messages = await storage.getChannelMessages(channelId, 50);

      this.sendToClient(ws, {
        type: 'channel_joined',
        data: { channelId, messages }
      });

      // Notify other users in the channel
      this.broadcastToChannel(channelId, {
        type: 'user_joined',
        data: { 
          channelId, 
          user: { id: ws.user?.id, firstName: ws.user?.firstName, lastName: ws.user?.lastName } 
        }
      }, ws.userId);

      console.log(`User ${ws.user?.email} joined channel ${channelId}`);
    } catch (error) {
      console.error('Error joining channel:', error);
      this.sendToClient(ws, {
        type: 'error',
        data: { message: 'Failed to join channel' }
      });
    }
  }

  private async handleLeaveChannel(ws: AuthenticatedWebSocket, channelId: string) {
    if (!ws.userId) return;

    ws.channels?.delete(channelId);
    this.channelSubscriptions.get(channelId)?.delete(ws.userId);

    // Notify other users in the channel
    this.broadcastToChannel(channelId, {
      type: 'user_left',
      data: { 
        channelId, 
        user: { id: ws.user?.id, firstName: ws.user?.firstName, lastName: ws.user?.lastName } 
      }
    }, ws.userId);

    this.sendToClient(ws, {
      type: 'channel_left',
      data: { channelId }
    });

    console.log(`User ${ws.user?.email} left channel ${channelId}`);
  }

  private async handleSendMessage(ws: AuthenticatedWebSocket, messageData: any) {
    try {
      if (!ws.userId) return;

      // Validate message data
      const validatedData = insertMessageSchema.parse({
        ...messageData,
        userId: ws.userId
      });

      // Verify user has access to the channel
      const channelId = String(validatedData.channelId);
      if (!channelId) {
        this.sendToClient(ws, {
          type: 'error',
          data: { message: 'Channel ID is required' }
        });
        return;
      }
      
      const channel = await storage.getChannelById(channelId);
      if (!channel) {
        this.sendToClient(ws, {
          type: 'error',
          data: { message: 'Channel not found' }
        });
        return;
      }

      // Check if user is in the channel
      if (!ws.channels?.has(channelId as string)) {
        this.sendToClient(ws, {
          type: 'error',
          data: { message: 'You must join the channel first' }
        });
        return;
      }

      // Save message to database
      const message = await storage.createMessage(validatedData);

      // Get the full message with user info (fallback to created message if needed)
      const fullMessage = await storage.getMessageById(message.id) || message;

      // Broadcast to all users in the channel
      this.broadcastToChannel(channelId as string, {
        type: 'new_message',
        data: { message: fullMessage }
      });

      console.log(`Message sent by ${ws.user?.email} in channel ${channelId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      if (error instanceof z.ZodError) {
        this.sendToClient(ws, {
          type: 'error',
          data: { message: 'Invalid message data', details: error.errors }
        });
      } else {
        this.sendToClient(ws, {
          type: 'error',
          data: { message: 'Failed to send message' }
        });
      }
    }
  }

  private async handleTyping(ws: AuthenticatedWebSocket, channelId: string, isTyping: boolean) {
    if (!ws.userId || !ws.channels?.has(channelId)) return;

    this.broadcastToChannel(channelId, {
      type: isTyping ? 'user_typing' : 'user_stopped_typing',
      data: { 
        channelId, 
        user: { id: ws.user?.id, firstName: ws.user?.firstName, lastName: ws.user?.lastName } 
      }
    }, ws.userId);
  }

  private handleDisconnection(ws: AuthenticatedWebSocket) {
    if (!ws.userId) return;

    // Remove from all channel subscriptions
    ws.channels?.forEach(channelId => {
      this.channelSubscriptions.get(channelId)?.delete(ws.userId!);
      
      // Notify other users in the channel
      this.broadcastToChannel(channelId, {
        type: 'user_left',
        data: { 
          channelId, 
          user: { id: ws.user?.id, firstName: ws.user?.firstName, lastName: ws.user?.lastName } 
        }
      }, ws.userId);
    });

    // Remove the client connection
    this.clients.delete(ws.userId);

    console.log(`User ${ws.user?.email} disconnected from WebSocket`);
  }

  private sendToClient(ws: WebSocket, message: BroadcastMessage | any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcastToChannel(channelId: string, message: BroadcastMessage, excludeUserId?: string) {
    const subscribers = this.channelSubscriptions.get(channelId);
    if (!subscribers) return;

    subscribers.forEach(userId => {
      if (excludeUserId && userId === excludeUserId) return;
      
      const client = this.clients.get(userId);
      if (client && client.readyState === WebSocket.OPEN) {
        this.sendToClient(client, message);
      }
    });
  }

  // Public method to broadcast messages from REST API
  public broadcastMessage(channelId: string, message: any) {
    this.broadcastToChannel(channelId, {
      type: 'new_message',
      data: { message }
    });
  }

  // Public method to notify about channel updates
  public notifyChannelUpdate(channelId: string, update: any) {
    this.broadcastToChannel(channelId, {
      type: 'channel_updated',
      data: { channelId, update }
    });
  }
}

let wsManager: WebSocketManager | null = null;

export function initializeWebSocket(server: Server): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager(server);
  }
  return wsManager;
}

export function getWebSocketManager(): WebSocketManager | null {
  return wsManager;
}