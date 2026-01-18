import api from './api';
import type { ApiResponse, Team } from '../types';

export const teamService = {
  // Get all teams for current user
  getMyTeams: async (): Promise<ApiResponse<{ teams: Team[] }>> => {
    const response = await api.get('/teams');
    return response. data;
  },

  // Get single team by ID
  getTeamById:  async (teamId: string): Promise<ApiResponse<{ team: Team }>> => {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },

  // Create new team
  createTeam: async (name: string, description?: string): Promise<ApiResponse<{ team: Team }>> => {
    const response = await api.post('/teams', { name, description });
    return response.data;
  },

  // Invite member to team
  inviteMember: async (teamId: string, email: string, role: 'admin' | 'member'): Promise<ApiResponse> => {
    const response = await api.post(`/teams/${teamId}/invite`, { email, role });
    return response.data;
  },

  // Get team workload
  getTeamWorkload: async (teamId: string): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/workload`);
    return response.data;
  },
};