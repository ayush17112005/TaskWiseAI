// Mongoose gives us ObjectId, but we need to type it for TypeScript
import { Types } from 'mongoose';

// Helper type for MongoDB ObjectId
export type ObjectId = Types.ObjectId;

// Standard API response format
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Pagination metadata
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Paginated response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Query filters for listing endpoints
export interface QueryFilters {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

// Timestamps (auto-added by Mongoose, but we type them)
export interface Timestamps {
  createdAt:  Date;
  updatedAt:  Date;
}