import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('kay-dental-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401/403 (token expired or invalid)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const isAdminRoute = error.config?.url?.includes('/admin/');
      
      // Handle 401 Unauthorized or 403 Forbidden on admin routes
      if ((status === 401 || status === 403) && isAdminRoute) {
        console.warn('🔒 Token invalid or expired. Logging out...');
        
        // Clear all auth data
        localStorage.removeItem('kay-dental-token');
        localStorage.removeItem('kay-dental-auth');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/admin/login')) {
          // Force full page reload to clear all state
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;