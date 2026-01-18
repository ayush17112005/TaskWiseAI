import api from './api';
import type { ApiResponse, Task } from '../types';

export const taskService = {
  // Get all tasks for current user
  getMyTasks: async (): Promise<ApiResponse<{ tasks: Task[] }>> => {
    const response = await api.get('/tasks/my/assigned');
    return response.data;
  },

  // Get all tasks
  getTasks: async (projectId?: string): Promise<ApiResponse<{ tasks: Task[] }>> => {
    const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
    const response = await api.get(url);
    return response.data;
  },

  // Get single task
  getTaskById: async (taskId: string): Promise<ApiResponse<{ task: Task }>> => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Create task
  createTask: async (data: {
    title:  string;
    projectId: string;
    description?: string;
    priority?: string;
    estimatedHours?: number;
    tags?: string[];
    dueDate?: string;
  }): Promise<ApiResponse<{ task: Task }>> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // Update task
  updateTask:  async (taskId: string, data: Partial<Task>): Promise<ApiResponse<{ task: Task }>> => {
    const response = await api. put(`/tasks/${taskId}`, data);
    return response.data;
  },

  // Assign task
  assignTask: async (taskId: string, userId: string): Promise<ApiResponse<{ task: Task }>> => {
    const response = await api. put(`/tasks/${taskId}/assign`, { userId });
    return response.data;
  },

  // Update task status
  updateTaskStatus:  async (taskId: string, status: string): Promise<ApiResponse<{ task: Task }>> => {
    const response = await api. put(`/tasks/${taskId}/status`, { status });
    return response.data;
  },
};