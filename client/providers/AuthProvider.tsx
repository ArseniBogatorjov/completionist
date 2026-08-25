'use client';

import { createContext, ReactNode, useContext } from 'react';
import type { User } from '@/types/auth/auth.types';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['profile', 'auth'],
    queryFn: () => apiClient<User>('/auth/me'),
    retry: false,
  });

  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        isLoading,
        isAuthenticated: !!data,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
