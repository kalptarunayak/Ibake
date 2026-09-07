import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// Get base URL from environment variable as mandated
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const TOKEN_STORAGE_KEY = 'ibake_jwt_token';
export const USER_STORAGE_KEY = 'ibake_auth_user';

// Create Centralized Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token to every outgoing request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.warn('Unauthorized request - session may have expired.');
    }
    return Promise.reject(error);
  }
);

export const hasLiveBackend = Boolean(API_BASE_URL && API_BASE_URL.trim().length > 0);
