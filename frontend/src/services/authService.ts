// 📚 Authentication API calls

import api from './api';
import type { ApiResponse, User } from '../types';

export const authService = {
  // Register new user
  register: async (name:  string, email: string, password:  string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // Login user
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api. post('/auth/login', { email, password });
    return response. data;
  },

  // Get current user
  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};