import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/inventory';
import { isRateLimited, clearRateLimit, createSessionTimeout } from '@/lib/security';
import { loginSchema, LoginFormData } from '@/lib/validation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for frontend-only mode
// In production, this would be handled by the backend
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@printflow.ph': {
    password: 'Admin@123!',
    user: {
      id: '1',
      email: 'admin@printflow.ph',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
    },
  },
  'manager@printflow.ph': {
    password: 'Manager@123!',
    user: {
      id: '2',
      email: 'manager@printflow.ph',
      name: 'Maria Santos',
      role: 'manager',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date(),
    },
  },
  'staff@printflow.ph': {
    password: 'Staff@123!',
    user: {
      id: '3',
      email: 'staff@printflow.ph',
      name: 'Juan Dela Cruz',
      role: 'staff',
      createdAt: new Date('2024-02-01'),
      lastLogin: new Date(),
    },
  },
};

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const RATE_LIMIT_KEY = 'login_attempts';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTimeout, setSessionTimeout] = useState<{ reset: () => void; clear: () => void } | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedSession = sessionStorage.getItem('printflow_session');
        if (storedSession) {
          const session = JSON.parse(storedSession);
          const expiresAt = new Date(session.expiresAt);
          
          if (expiresAt > new Date()) {
            setUser(session.user);
            initSessionTimeout();
          } else {
            sessionStorage.removeItem('printflow_session');
          }
        }
      } catch {
        sessionStorage.removeItem('printflow_session');
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const initSessionTimeout = useCallback(() => {
    if (sessionTimeout) {
      sessionTimeout.clear();
    }

    const timeout = createSessionTimeout(SESSION_TIMEOUT, () => {
      logout();
      setError('Session expired. Please log in again.');
    });

    setSessionTimeout(timeout);

    // Reset timeout on user activity
    const resetOnActivity = () => timeout.reset();
    window.addEventListener('mousemove', resetOnActivity);
    window.addEventListener('keypress', resetOnActivity);

    return () => {
      window.removeEventListener('mousemove', resetOnActivity);
      window.removeEventListener('keypress', resetOnActivity);
      timeout.clear();
    };
  }, []);

  const login = useCallback(async (credentials: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    setError(null);

    // Check rate limiting
    if (isRateLimited(RATE_LIMIT_KEY, 5, 60000)) {
      const errorMsg = 'Too many login attempts. Please wait 1 minute.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Validate input
    const validation = loginSchema.safeParse(credentials);
    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || 'Invalid input';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials (demo mode)
    const demoUser = DEMO_USERS[credentials.email.toLowerCase()];
    
    if (!demoUser || demoUser.password !== credentials.password) {
      const errorMsg = 'Invalid email or password';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Clear rate limit on successful login
    clearRateLimit(RATE_LIMIT_KEY);

    // Create session
    const session = {
      user: { ...demoUser.user, lastLogin: new Date() },
      expiresAt: new Date(Date.now() + SESSION_TIMEOUT).toISOString(),
    };

    sessionStorage.setItem('printflow_session', JSON.stringify(session));
    setUser(session.user);
    initSessionTimeout();

    return { success: true };
  }, [initSessionTimeout]);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    sessionStorage.removeItem('printflow_session');
    
    if (sessionTimeout) {
      sessionTimeout.clear();
      setSessionTimeout(null);
    }
  }, [sessionTimeout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
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
