/**
 * Types of AI suggestions we support
 */
export enum AISuggestionType {
  ASSIGNEE = 'assignee',
  DEADLINE = 'deadline',
  PRIORITY = 'priority',
  BREAKDOWN = 'breakdown',
}

/**
 * AI Suggestion stored in task
 */
export interface IAISuggestion {
  type: AISuggestionType;
  suggestion: any; // Can be userId, date, priority enum, or array of subtasks
  reasoning: string;
  confidence: number; // 0 to 1
  createdAt: Date;
}

/**
 * Request to suggest task assignee
 */
export interface SuggestAssigneeRequest {
  taskId: string;
}

/**
 * Response from assignee suggestion
 */
export interface SuggestAssigneeResponse {
  suggestedUserId: string;
  suggestedUserName: string;
  confidence: number;
  reasoning: string;
  isNewTeam?:  boolean; // True if using fallback logic
  disclaimer?: string; // Warning for new teams
}

/**
 * Request to suggest deadline
 */
export interface SuggestDeadlineRequest {
  taskId: string;
}

/**
 * Response from deadline suggestion
 */
export interface SuggestDeadlineResponse {
  suggestedDeadline:  Date;
  suggestedDays: number; // Days from now
  confidence: number;
  reasoning: string;
  isNewTeam?: boolean;
  disclaimer?: string;
}

/**
 * Request to suggest priority
 */
export interface SuggestPriorityRequest {
  taskId: string;
}

/**
 * Response from priority suggestion
 */
export interface SuggestPriorityResponse {
  suggestedPriority:  string; // 'low' | 'medium' | 'high' | 'urgent'
  confidence: number;
  reasoning: string;
}

/**
 * Request to breakdown task
 */
export interface BreakdownTaskRequest {
  taskId: string;
  maxSubtasks?: number; // Optional limit (default:  5)
}

/**
 * Subtask suggestion
 */
export interface SubtaskSuggestion {
  title: string;
  description?:  string;
  estimatedHours?: number;
  order: number;
}

/**
 * Response from task breakdown
 */
export interface BreakdownTaskResponse {
  subtasks: SubtaskSuggestion[];
  reasoning: string;
  confidence: number;
}

/**
 * Team member data for AI context
 */
export interface TeamMemberContext {
  userId: string;
  name: string;
  email: string;
  tasksCompleted: number;
  avgCompletionTime: number; // in days
  accuracy: number; // 0-100
  commonTags: string[];
  currentWorkload: number; // active tasks
  preferredPriority?:  string;
}

/**
 * Task context for AI
 */
export interface TaskContext {
  taskId: string;
  title: string;
  description?: string;
  tags?:  string[];
  estimatedHours?: number;
  priority?:  string;
  projectName:  string;
  teamName: string;
}

/**
 * AI Rate limiting
 */
export interface AIRateLimit {
  userId: string;
  count: number;
  resetAt: Date;
}