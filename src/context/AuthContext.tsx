import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, getStoredToken, setStoredToken, isLocalDemoActive, setLocalDemoActive } from '../services/api';
import { DEMO_USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, role: UserRole, password?: string) => Promise<void>;
  register: (data: Partial<User> & { password?: string }) => Promise<void>;
  loginDemoUser: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(isLocalDemoActive());

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = localStorage.getItem('swasthya_user');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setIsDemoMode(isLocalDemoActive());
        } else {
          // Default to demo patient on initial cold load for instant evaluation
          const defaultDemo = DEMO_USERS[0];
          const demoToken = `demo_token_${defaultDemo.id}_init`;
          setUser(defaultDemo);
          setToken(demoToken);
          setStoredToken(demoToken);
          localStorage.setItem('swasthya_user', JSON.stringify(defaultDemo));
          setLocalDemoActive(true);
          setIsDemoMode(true);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        setStoredToken(null);
        localStorage.removeItem('swasthya_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, userRole: UserRole, password?: string) => {
    setIsLoading(true);
    try {
      const response = await api.login(email, userRole, password);
      setUser(response.user);
      setToken(response.token);
      setIsDemoMode(response.isDemo);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<User> & { password?: string }) => {
    setIsLoading(true);
    try {
      const response = await api.register(data);
      setUser(response.user);
      setToken(response.token);
      setIsDemoMode(response.isDemo);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoUser = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const demoAccount = DEMO_USERS.find(u => u.role === targetRole) || DEMO_USERS[0];
      const demoToken = `demo_token_${demoAccount.id}_${Date.now()}`;
      setUser(demoAccount);
      setToken(demoToken);
      setStoredToken(demoToken);
      localStorage.setItem('swasthya_user', JSON.stringify(demoAccount));
      setLocalDemoActive(true);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setStoredToken(null);
    localStorage.removeItem('swasthya_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        isDemoMode,
        login,
        register,
        loginDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
