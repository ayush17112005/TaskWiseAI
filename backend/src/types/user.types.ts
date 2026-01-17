import { ObjectId, Timestamps } from './common.types';

// User roles in the system
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

// User document structure
export interface IUser extends Timestamps {
  _id: ObjectId;
  name: string;
  email: string;
  password: string; 
  role: UserRole;
  avatar?: string; // Optional profile picture URL
  teams: ObjectId[]; // Array of team IDs user belongs to
  isActive: boolean; // Can disable users without deleting
  lastLogin?: Date;
}

// User creation data (what we receive from registration)
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?:  UserRole; // Optional, defaults to MEMBER
}

// User login data
export interface LoginUserDto {
  email: string;
  password: string;
}

// User response (NEVER send password to frontend!)
export interface UserResponse {
  _id: ObjectId;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  teams: ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// JWT payload (what we store in the token)
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Update user data
export interface UpdateUserDto {
  name?: string;
  avatar?: string;
  // Email and password updates handled separately for security
}