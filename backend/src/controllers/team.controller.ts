//LEARNING:  Team management controller

import { Request, Response, NextFunction } from 'express';
import { Team, User } from '@/models';
import { AppError } from '@/middlewares/error.middleware';
import { CreateTeamDto, UpdateTeamDto, AddTeamMemberDto, TeamMemberRole } from '@/types';

/**
 * Create new team
 * 
 * POST /api/teams
 * Body: { name, description?  }
 */
export const createTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description }: CreateTeamDto = req. body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // 1. Create team with creator as owner
    const team = await Team. create({
      name,
      description,
      createdBy: userId,
      members: [
        {
          userId:  userId,
          role: TeamMemberRole.OWNER,
          joinedAt: new Date(),
        },
      ],
      isActive: true,
    });

    // 2. Add team to user's teams array
    await User.findByIdAndUpdate(userId, {
      $push: { teams: team._id },
    });

    // 3. Populate creator info
    await team.populate('createdBy', 'name email avatar');
    await team.populate('members.userId', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all teams for current user
 * 
 * GET /api/teams
 * Query: ? page=1&limit=10&search=keyword
 */
export const getMyTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query. page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    // Build query
    const query:  any = {
      'members.userId': userId,
      isActive: true,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options:  'i' } },
      ];
    }

    // Execute query with pagination
    const teams = await Team.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('members.userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Team.countDocuments(query);

    res.status(200).json({
      success: true,
      data: { teams },
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single team by ID
 * 
 * GET /api/teams/:id
 */
export const getTeamById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?. userId;

    const team = await Team.findById(id)
      .populate('createdBy', 'name email avatar')
      .populate('members.userId', 'name email avatar');

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // 📚 Check if user is member of this team
    const isMember = team.members.some(
      (member) => member.userId._id. toString() === userId
    );

    if (!isMember) {
      throw new AppError('You are not a member of this team', 403);
    }

    res.status(200).json({
      success: true,
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update team
 * 
 * PUT /api/teams/:id
 * Body:  { name?, description? }
 */
export const updateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description }: UpdateTeamDto = req.body;
    const userId = req.user?.userId;

    const team = await Team.findById(id);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Check if user is owner or admin
    const member = team.members.find(
      (m) => m.userId.toString() === userId
    );

    if (!member || (member.role !== TeamMemberRole.OWNER && member.role !== TeamMemberRole.ADMIN)) {
      throw new AppError('Only team owner or admin can update team', 403);
    }

    // Update fields
    if (name) team.name = name;
    if (description !== undefined) team.description = description;

    await team.save();

    await team.populate('createdBy', 'name email avatar');
    await team.populate('members.userId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete team (soft delete)
 * 
 * DELETE /api/teams/:id
 */
export const deleteTeam = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const team = await Team. findById(id);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Only owner can delete team
    const member = team.members.find(
      (m) => m.userId.toString() === userId
    );

    if (!member || member.role !== TeamMemberRole. OWNER) {
      throw new AppError('Only team owner can delete team', 403);
    }

    // Soft delete
    team.isActive = false;
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 *  Add member to team
 * 
 * POST /api/teams/:id/members
 * Body: { userId, role }
 */
export const addTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId: newMemberId, role }: AddTeamMemberDto = req.body;
    const currentUserId = req.user?.userId;

    const team = await Team.findById(id);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Check if current user can add members
    const currentMember = team.members.find(
      (m) => m.userId.toString() === currentUserId
    );

    if (!currentMember || (currentMember.role !== TeamMemberRole.OWNER && currentMember.role !== TeamMemberRole.ADMIN)) {
      throw new AppError('Only team owner or admin can add members', 403);
    }

    // Check if user exists
    const newUser = await User.findById(newMemberId);
    if (!newUser) {
      throw new AppError('User not found', 404);
    }

    // Check if already a member
    const alreadyMember = team.members.some(
      (m) => m.userId.toString() === newMemberId
    );

    if (alreadyMember) {
      throw new AppError('User is already a member of this team', 400);
    }

    // Add member
    team.members. push({
      userId: newMemberId as any,
      role:  role as TeamMemberRole,
      joinedAt: new Date(),
    });

    await team.save();

    // Add team to user's teams
    await User.findByIdAndUpdate(newMemberId, {
      $push: { teams:  team._id },
    });

    await team.populate('members.userId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from team
 * 
 * DELETE /api/teams/:id/members/:memberId
 */
export const removeTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, memberId } = req.params;
    const currentUserId = req.user?.userId;

    const team = await Team.findById(id);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Check permissions
    const currentMember = team.members.find(
      (m) => m.userId.toString() === currentUserId
    );

    if (!currentMember || (currentMember.role !== TeamMemberRole.OWNER && currentMember.role !== TeamMemberRole.ADMIN)) {
      throw new AppError('Only team owner or admin can remove members', 403);
    }

    // Can't remove owner
    const memberToRemove = team.members. find(
      (m) => m.userId.toString() === memberId
    );

    if (!memberToRemove) {
      throw new AppError('Member not found in this team', 404);
    }

    if (memberToRemove.role === TeamMemberRole.OWNER) {
      throw new AppError('Cannot remove team owner', 400);
    }

    // Remove member
    team.members = team.members.filter(
      (m) => m.userId.toString() !== memberId
    );

    await team.save();

    // Remove team from user's teams
    await User.findByIdAndUpdate(memberId, {
      $pull: { teams: team._id },
    });

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update member role
 * 
 * PUT /api/teams/:id/members/:memberId
 * Body: { role }
 */
export const updateMemberRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body;
    const currentUserId = req.user?.userId;

    const team = await Team.findById(id);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Only owner can change roles
    const currentMember = team.members.find(
      (m) => m.userId.toString() === currentUserId
    );

    if (!currentMember || currentMember.role !== TeamMemberRole.OWNER) {
      throw new AppError('Only team owner can change member roles', 403);
    }

    // Find member to update
    const memberToUpdate = team.members.find(
      (m) => m.userId.toString() === memberId
    );

    if (!memberToUpdate) {
      throw new AppError('Member not found in this team', 404);
    }

    // Can't change owner role
    if (memberToUpdate.role === TeamMemberRole.OWNER) {
      throw new AppError('Cannot change owner role', 400);
    }

    // Update role
    memberToUpdate.role = role;
    await team.save();

    await team.populate('members.userId', 'name email avatar');

    res.status(200).json({
      success: true,
      message:  'Member role updated successfully',
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};