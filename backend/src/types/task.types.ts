import { ObjectId, Timestamps } from './common.types';

// Task status workflow
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
}

// Task priority (AI will help set this!)
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Task comment (for collaboration)
export interface TaskComment {
  _id: ObjectId;
  userId: ObjectId;
  content: string;
  createdAt: Date;
}

// AI suggestion for a task
export interface AISuggestion {
  type: 'assignee' | 'deadline' | 'priority' | 'breakdown';
  suggestion: string | string[]; // Can be string or array of strings
  reasoning: string; // Why AI suggested this
  confidence: number; // 0-1, how confident is the AI
  createdAt: Date;
}

// Task document structure
export interface ITask extends Timestamps {
  _id: ObjectId;
  title: string;
  description?: string;
  project: ObjectId; // Which project does this belong to
  createdBy: ObjectId; // Who created the task
  assignedTo?: ObjectId; // Who's working on it (optional, can be unassigned)
  status: TaskStatus;
  priority:  TaskPriority;
  deadline?: Date;
  estimatedHours?: number; // Time estimate
  actualHours?: number; // Actual time spent
  tags?: string[];
  comments:  TaskComment[]; // Embedded comments
  aiSuggestions?:  AISuggestion[]; // AI recommendations for this task
  parentTask?: ObjectId; // For subtasks
  dependencies?: ObjectId[]; // Tasks that must be completed first
}

// Create task data
export interface CreateTaskDto {
  title: string;
  description?:  string;
  projectId: string;
  assignedTo?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  deadline?: string;
  estimatedHours?: number;
  tags?: string[];
  parentTask?: string;
}

// Update task data
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: TaskStatus;
  priority?:  TaskPriority;
  deadline?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

// Add comment to task
export interface AddCommentDto {
  content: string;
}

// Task filter options (for queries)
export interface TaskFilters {
  projectId?: string;
  assignedTo?: string;
  status?: TaskStatus;
  priority?:  TaskPriority;
  overdue?: boolean;
  tags?: string[];
  search?: string;
}

// Task response
export interface TaskResponse {
  _id: ObjectId;
  title: string;
  description?: string;
  project: ObjectId;
  createdBy: ObjectId;
  assignedTo?: ObjectId;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?:  Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?:  string[];
  comments: TaskComment[];
  aiSuggestions?:  AISuggestion[];
  parentTask?: ObjectId;
  dependencies?: ObjectId[];
  isOverdue:  boolean; 
  createdAt: Date;
  updatedAt: Date;
}