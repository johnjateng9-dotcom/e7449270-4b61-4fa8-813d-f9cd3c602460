import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { User, LoginCredentials, RegisterCredentials } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider(props: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshUser = async () => {
    try {
      if (!apiClient.getToken()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { user } = await apiClient.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (error instanceof ApiError && error.status === 401) {
        apiClient.setToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const { user } = await apiClient.login(credentials);
      setUser(user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.firstName} ${user.lastName}`,
      });
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof ApiError) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { user } = await apiClient.register(credentials);
      setUser(user);
      toast({
        title: "Welcome to CollabFlow!",
        description: `Account created successfully for ${user.email}`,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      if (error instanceof ApiError) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout failed:', error);
      apiClient.setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const contextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}