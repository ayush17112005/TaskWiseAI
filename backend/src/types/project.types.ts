import { ObjectId, Timestamps } from './common.types';

// Project status
export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

// Project priority
export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Project document structure
export interface IProject extends Timestamps {
  _id: ObjectId;
  name: string;
  description?: string;
  team: ObjectId; // Which team owns this project
  createdBy: ObjectId; // User who created it
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?:  Date;
  endDate?: Date;
  tags?:  string[]; // For categorization
}

// Create project data
export interface CreateProjectDto {
  name:  string;
  description?: string;
  teamId: string;
  status?:  ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string; // ISO date string from frontend
  endDate?: string;
  tags?: string[];
}

// Update project data
export interface UpdateProjectDto {
  name?:  string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

// Project response with statistics
export interface ProjectResponse {
  _id: ObjectId;
  name: string;
  description?:  string;
  team: ObjectId;
  createdBy: ObjectId;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?:  Date;
  endDate?: Date;
  tags?: string[];
  stats?:  {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
  createdAt: Date;
  updatedAt: Date;
}