import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/authApi';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: number; username: string; role: string } | null;
  token: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      
      login: async (username: string, password: string) => {
        try {
          const response = await authApi.login({ username, password });
          
          if (response.success && response.data) {
            // Save token for axios interceptor
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
      
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('kay-dental-token');
          set({ 
            isAuthenticated: false, 
            user: null, 
            token: null,
            refreshToken: null 
          });
        }
      },
    }),
    { name: 'kay-dental-auth' }
  )
);