import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  token: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (username: string, password: string) => {
        if (username === 'admin' && password === 'admin123') {
          set({
            isAuthenticated: true,
            user: { username: 'admin', role: 'ADMIN' },
            token: 'mock-jwt-token-' + Date.now(),
          });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    { name: 'kay-dental-auth' }
  )
);
