import { ObjectId, Timestamps } from './common.types';

// Team member with role
export interface TeamMember {
  userId: ObjectId;
  role:  TeamMemberRole;
  joinedAt: Date;
}

// Team roles are different from User roles
// User role = system-wide (admin, manager, member)
// Team role = within a specific team (owner, contributor, viewer)
export enum TeamMemberRole {
  OWNER = 'owner',       // Created the team, full control
  ADMIN = 'admin',       // Can manage team settings
  CONTRIBUTOR = 'contributor', // Can create/edit tasks
  VIEWER = 'viewer',     // Read-only access
}

// Team document structure
export interface ITeam extends Timestamps {
  _id: ObjectId;
  name:  string;
  description?: string;
  members: TeamMember[]; // Array of members with roles
  createdBy: ObjectId; // User who created the team
  isActive: boolean;
}

// Create team data
export interface CreateTeamDto {
  name: string;
  description?: string;
}

// Update team data
export interface UpdateTeamDto {
  name?: string;
  description?: string;
}

// Add member to team
export interface AddTeamMemberDto {
  userId: string;
  role: TeamMemberRole;
}

// Team response with populated members
export interface TeamResponse {
  _id: ObjectId;
  name: string;
  description?: string;
  members: TeamMember[];
  createdBy: ObjectId;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}