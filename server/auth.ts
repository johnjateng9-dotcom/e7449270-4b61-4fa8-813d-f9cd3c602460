import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { users, sessions, type User, type LoginCredentials, type RegisterCredentials } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 12;
const SESSION_EXPIRES_IN = '7d';

export interface AuthenticatedRequest extends Request {
  user?: User;
  session?: { id: string; userId: string };
}

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_EXPIRES_IN });
  }

  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch {
      return null;
    }
  }

  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    const { email, password, firstName, lastName } = credentials;

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Hash password and create user
    const hashedPassword = await this.hashPassword(password);
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    }).returning();

    // Generate token and create session
    const token = this.generateToken({ userId: newUser.id, email: newUser.email });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await db.insert(sessions).values({
      userId: newUser.id,
      token,
      expiresAt,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword as User, token };
  }

  async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<{ user: User; token: string }> {
    const { email, password } = credentials;

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user || !user.isActive) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token and create session
    const token = this.generateToken({ userId: user.id, email: user.email });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await db.insert(sessions).values({
      userId: user.id,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    });

    // Update last login time
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  async logout(token: string): Promise<void> {
    // Remove session from database
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  async validateSession(token: string): Promise<{ user: User; session: { id: string; userId: string } } | null> {
    try {
      // Verify JWT token
      const payload = this.verifyToken(token);
      if (!payload) return null;

      // Check if session exists and is not expired
      const [session] = await db.select()
        .from(sessions)
        .where(and(
          eq(sessions.token, token),
          eq(sessions.userId, payload.userId)
        ))
        .limit(1);

      if (!session || session.expiresAt < new Date()) {
        // Clean up expired session
        if (session) {
          await db.delete(sessions).where(eq(sessions.id, session.id));
        }
        return null;
      }

      // Get user details
      const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
      if (!user || !user.isActive) return null;

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword as User,
        session: { id: session.id, userId: session.userId }
      };
    } catch {
      return null;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return null;

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const [updatedUser] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) return null;

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async deleteUser(userId: string): Promise<void> {
    // Soft delete by setting isActive to false
    await db.update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, userId));

    // Remove all sessions
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }

  async cleanupExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(
      // Delete sessions that expired more than 1 day ago  
      sql`${sessions.expiresAt} < ${new Date(Date.now() - 24 * 60 * 60 * 1000)}`
    );
  }
}

export const authService = new AuthService();

// Middleware for protecting routes
export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const authData = await authService.validateSession(token);

    if (!authData) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = authData.user;
    req.session = authData.session;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware for optional authentication (doesn't fail if no token)
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const authData = await authService.validateSession(token);
      if (authData) {
        req.user = authData.user;
        req.session = authData.session;
      }
    }
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if auth fails
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role || 'user')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};