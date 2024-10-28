'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading state

  useEffect(() => {
    // Initialize authentication state
    const storedToken = localStorage.getItem('accessToken');
    console.log('Stored Token:', storedToken); // Debugging log
    if (storedToken) {
      setAccessToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false); // Authentication state initialized
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies if using HTTP-only cookies for refresh tokens
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setIsAuthenticated(true);
        localStorage.setItem('accessToken', data.accessToken);
        console.log('Login successful, Access Token set:', data.accessToken); // Debugging log
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message); // Debugging log
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Logout successful'); // Debugging log
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
