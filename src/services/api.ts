// frontend/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // or however you store your token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  department?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const apiService = {
  // Get employees (requires auth token)
  getEmployees: async (): Promise<AppUser[]> => {
    const response = await api.get('/api/auth/employees');
    return response.data.employees;
  },

  // Get current user profile (requires auth token)
  getCurrentUser: async (): Promise<AppUser> => {
    const response = await api.get('/api/auth/profile');
    return response.data.user;
  },

  // Create user (admin only, requires auth token)
  createUser: async (userData: {
    email: string;
    password: string;
    displayName: string;
    role: string;
    department?: string;
    phoneNumber?: string;
  }): Promise<AppUser> => {
    const response = await api.post('/api/auth/users', userData);
    return response.data.user;
  },

  // Update current user profile (requires auth token)
  updateProfile: async (updates: {
    displayName?: string;
    phoneNumber?: string;
    department?: string;
  }): Promise<AppUser> => {
    const response = await api.put('/api/auth/profile', updates);
    return response.data.user;
  },

  // Update user by admin (requires auth token and admin role)
  updateUser: async (uid: string, updates: Partial<AppUser>): Promise<AppUser> => {
    const response = await api.put(`/api/auth/users/${uid}`, updates);
    return response.data.user;
  },

  // Deactivate user (admin only, requires auth token)
  deactivateUser: async (uid: string): Promise<void> => {
    await api.delete(`/api/auth/users/${uid}`);
  },
};