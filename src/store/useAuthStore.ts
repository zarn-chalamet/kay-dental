import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/authApi';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: number; username: string; role: string } | null;
  token: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      
      login: async (username: string, password: string) => {
        try {
          const response = await authApi.login({ username, password });
          
          if (response.success && response.data) {
            localStorage.setItem('kay-dental-token', response.data.accessToken);
            
            set({
              isAuthenticated: true,
              user: response.data.user,
              token: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      
      logout: () => {
        // Clear localStorage first
        localStorage.removeItem('kay-dental-token');
        localStorage.removeItem('kay-dental-auth');
        
        // Try to call logout API (don't wait or fail if it errors)
        authApi.logout().catch(() => {
          // Silently fail - we're logging out anyway
        });
        
        // Clear store state
        set({ 
          isAuthenticated: false, 
          user: null, 
          token: null,
          refreshToken: null 
        });
      },

      checkAuth: () => {
        const state = get();
        const storedToken = localStorage.getItem('kay-dental-token');
        
        // If store says authenticated but no token in storage, force logout
        if (state.isAuthenticated && !storedToken) {
          state.logout();
          return false;
        }
        
        return state.isAuthenticated && !!state.token;
      },
    }),
    { 
      name: 'kay-dental-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);