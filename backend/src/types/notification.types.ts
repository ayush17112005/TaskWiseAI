import { ObjectId, Timestamps } from './common.types';

// Notification types
export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_UPDATED = 'task_updated',
  TASK_COMPLETED = 'task_completed',
  DEADLINE_APPROACHING = 'deadline_approaching',
  COMMENT_ADDED = 'comment_added',
  TEAM_INVITE = 'team_invite',
  AI_SUGGESTION = 'ai_suggestion',
}

// Notification document structure
export interface INotification extends Timestamps {
  _id:  ObjectId;
  userId: ObjectId; // Who receives this notification
  type: NotificationType;
  title: string;
  message: string;
  relatedTask?: ObjectId; // Optional: link to task
  relatedProject?: ObjectId; // Optional: link to project
  relatedTeam?: ObjectId; // Optional: link to team
  isRead:  boolean;
  readAt?: Date;
}

// Create notification data
export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedTask?: string;
  relatedProject?: string;
  relatedTeam?: string;
}

// Notification response
export interface NotificationResponse {
  _id: ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedTask?: ObjectId;
  relatedProject?:  ObjectId;
  relatedTeam?: ObjectId;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}