import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/inventory';
import { isRateLimited, clearRateLimit, createSessionTimeout } from '@/lib/security';
import { loginSchema, LoginFormData } from '@/lib/validation';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const RATE_LIMIT_KEY = 'login_attempts';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTimeout, setSessionTimeout] = useState<{ reset: () => void; clear: () => void } | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedSession = sessionStorage.getItem('printflow_session');
        const storedToken = sessionStorage.getItem('printflow_token');
        if (storedSession && storedToken) {
          const session = JSON.parse(storedSession);
          const expiresAt = new Date(session.expiresAt);

          if (expiresAt > new Date()) {
            setUser(session.user);
            setToken(storedToken);
            initSessionTimeout();
          } else {
            sessionStorage.removeItem('printflow_session');
            sessionStorage.removeItem('printflow_token');
          }
        }
      } catch {
        sessionStorage.removeItem('printflow_session');
        sessionStorage.removeItem('printflow_token');
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

    // Call backend API
    const result = await authApi.login(credentials.email, credentials.password);

    if (result.error || !result.data) {
      const errorMsg = result.error || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Clear rate limit on successful login
    clearRateLimit(RATE_LIMIT_KEY);

    const apiUser: User = {
      id: result.data.user.id,
      email: result.data.user.email,
      name: result.data.user.name,
      role: result.data.user.role,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    // Store session and token
    const session = {
      user: apiUser,
      expiresAt: new Date(Date.now() + SESSION_TIMEOUT).toISOString(),
    };

    sessionStorage.setItem('printflow_session', JSON.stringify(session));
    sessionStorage.setItem('printflow_token', result.data.token);
    setUser(apiUser);
    setToken(result.data.token);
    initSessionTimeout();

    return { success: true };
  }, [initSessionTimeout]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    sessionStorage.removeItem('printflow_session');
    sessionStorage.removeItem('printflow_token');

    if (sessionTimeout) {
      sessionTimeout.clear();
      setSessionTimeout(null);
    }
  }, [sessionTimeout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
