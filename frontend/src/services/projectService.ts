// 📚 Project API calls

import api from './api';
import type { ApiResponse, Project } from '../types';

export const projectService = {
  // Get all projects
  getProjects: async (teamId?: string): Promise<ApiResponse<{ projects: Project[] }>> => {
    const url = teamId ? `/projects?teamId=${teamId}` : '/projects';
    const response = await api.get(url);
    return response.data;
  },

  // Get single project
  getProjectById: async (projectId: string): Promise<ApiResponse<{ project: Project }>> => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  // Create project
  createProject: async (data: {
    name: string;
    teamId:  string;
    description?: string;
    priority?:  string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ project: Project }>> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Get project statistics
  getProjectStats: async (projectId: string): Promise<ApiResponse> => {
    const response = await api.get(`/analytics/project/${projectId}`);
    return response.data;
  },
};