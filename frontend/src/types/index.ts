export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description?:  string;
  members: TeamMember[];
  createdBy: string;
  createdAt: string;
}

export interface TeamMember {
  userId: User | string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  team: Team | string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?:  string;
  endDate?: string;
  tags?:  string[];
  createdBy:  User | string;
  createdAt: string;
}

export interface Task {
  _id:  string;
  title: string;
  description?: string;
  project: Project | string;
  assignedTo?:  User | string;
  createdBy: User | string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  dueDate?: string;
  dependencies?: string[];
  subtasks?:  Subtask[];
  comments?: Comment[];
  aiSuggestions?: AISuggestion[];
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  _id: string;
  user: User | string;
  text: string;
  createdAt: string;
}

export interface AISuggestion {
  type: 'assignee' | 'deadline' | 'priority' | 'breakdown';
  suggestion: unknown;
  reasoning: string;
  confidence: number;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// AI Response types
export interface AIAssigneeResponse {
  suggestedUserId: string;
  suggestedUserName: string;
  confidence: number;
  reasoning: string;
  isNewTeam?:  boolean;
  disclaimer?: string;
}

export interface AIDeadlineResponse {
  suggestedDeadline: string;
  suggestedDays: number;
  confidence: number;
  reasoning: string;
  isNewTeam?: boolean;
  disclaimer?: string;
}

export interface AIPriorityResponse {
  suggestedPriority: string;
  confidence: number;
  reasoning: string;
}

export interface AIBreakdownResponse {
  subtasks: {
    title: string;
    description?:  string;
    estimatedHours?: number;
    order: number;
  }[];
  reasoning: string;
  confidence: number;
}

// Dashboard stats
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  teams: number;
  projects: number;
}