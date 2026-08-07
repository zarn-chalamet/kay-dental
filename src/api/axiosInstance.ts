import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Base URL for the Spring Boot backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to requests
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

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('kay-dental-token');
        localStorage.removeItem('kay-dental-auth');
        window.location.href = '/#/admin/login';
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Access denied');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
