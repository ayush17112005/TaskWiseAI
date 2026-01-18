import api from './api';
import type { ApiResponse } from '../types';

export const aiService = {
  // Suggest assignee for task
  suggestAssignee: async (taskId: string): Promise<ApiResponse> => {
    const response = await api.post(`/ai/suggest-assignee`, { taskId });
    return response.data;
  },

  // Suggest deadline for task
  suggestDeadline: async (taskId: string): Promise<ApiResponse> => {
    const response = await api.post(`/ai/suggest-deadline`, { taskId });
    return response.data;
  },

  // Suggest priority for task
  suggestPriority: async (taskId: string): Promise<ApiResponse> => {
    const response = await api.post(`/ai/suggest-priority`, { taskId });
    return response.data;
  },

  // Breakdown task into subtasks
  breakdownTask: async (taskId: string, maxSubtasks: number = 5): Promise<ApiResponse> => {
    const response = await api.post(`/ai/breakdown-task`, { taskId, maxSubtasks });
    return response.data;
  },
};