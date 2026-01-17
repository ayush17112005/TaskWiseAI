import { Request, Response, NextFunction } from 'express';
import { Project, Team, Task } from '@/models';
import { AppError } from '@/middlewares/error.middleware';
import { CreateProjectDto, UpdateProjectDto } from '@/types';

/**
 * Create new project
 * 
 * POST /api/projects
 * Body: { name, description?, teamId, status?, priority?, startDate?, endDate?, tags?  }
 */
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {
      name,
      description,
      teamId,
      status,
      priority,
      startDate,
      endDate,
      tags,
    }: CreateProjectDto = req.body;

    // 1. Check if team exists
    const team = await Team.findById(teamId);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // 2. Check if user is member of the team
    const isMember = team.members.some(
      (member) => member.userId. toString() === userId
    );

    if (!isMember) {
      throw new AppError('You must be a team member to create projects', 403);
    }

    // 3. Create project
    const project = await Project.create({
      name,
      description,
      team: teamId,
      createdBy: userId,
      status,
      priority,
      startDate:  startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      tags,
    });

    // 4. Populate fields
    await project.populate('team', 'name');
    await project.populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects
 * 
 * GET /api/projects
 * Query:  ? teamId=xxx&status=active&priority=high&page=1&limit=10&search=keyword
 */
export const getProjects = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req. query.limit as string) || 10;
    const search = req.query.search as string;
    const teamId = req.query.teamId as string;
    const status = req.query.status as string;
    const priority = req.query.priority as string;

    // Build query
    const query:  any = {};

    // Only show projects from teams user is member of
    const userTeams = await Team.find({
      'members.userId': userId,
      isActive: true,
    }).select('_id');

    const teamIds = userTeams.map((team) => team._id);
    query. team = { $in: teamIds };

    // Filter by specific team
    if (teamId) {
      query.team = teamId;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { description: { $regex:  search, $options: 'i' } },
        { tags:  { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Execute query
    const projects = await Project.find(query)
      .populate('team', 'name')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Project. countDocuments(query);

    res.status(200).json({
      success: true,
      data: { projects },
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
 * Get single project by ID
 * 
 * GET /api/projects/:id
 */
export const getProjectById = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const project = await Project.findById(id)
      .populate('team', 'name members')
      .populate('createdBy', 'name email avatar');

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check if user is member of the project's team
    const team = await Team.findById(project.team);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members. some(
      (member) => member.userId.toString() === userId
    );

    if (!isMember) {
      throw new AppError('You do not have access to this project', 403);
    }

    // Get project statistics (task counts)
    const taskStats = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate stats
    const stats = {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
    };

    taskStats.forEach((stat) => {
      stats. totalTasks += stat.count;
      if (stat._id === 'completed') stats.completedTasks = stat.count;
      if (stat._id === 'todo') stats.pendingTasks = stat.count;
      if (stat._id === 'in_progress') stats.inProgressTasks = stat.count;
    });

    // Count overdue tasks
    const overdueCount = await Task.countDocuments({
      project: project._id,
      deadline: { $lt: new Date() },
      status: { $ne: 'completed' },
    });

    stats.overdueTasks = overdueCount;

    res.status(200).json({
      success: true,
      data: {
        project,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project
 * 
 * PUT /api/projects/:id
 * Body: { name?, description?, status?, priority?, startDate?, endDate?, tags? }
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const {
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      tags,
    }: UpdateProjectDto = req.body;

    const project = await Project.findById(id);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check permissions - must be team member
    const team = await Team. findById(project.team);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const member = team.members.find(
      (m) => m.userId.toString() === userId
    );

    if (!member) {
      throw new AppError('You do not have access to this project', 403);
    }

    // Update fields
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (priority !== undefined) project.priority = priority;
    if (startDate !== undefined)
      project.startDate = startDate ? new Date(startDate) : undefined;
    if (endDate !== undefined)
      project.endDate = endDate ? new Date(endDate) : undefined;
    if (tags !== undefined) project.tags = tags;

    await project.save();

    await project.populate('team', 'name');
    await project.populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project
 * 
 * DELETE /api/projects/:id
 */
export const deleteProject = async (
  req: Request,
  res:  Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?. userId;

    const project = await Project.findById(id);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check permissions - must be project creator or team owner/admin
    const team = await Team.findById(project.team);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const member = team.members.find(
      (m) => m.userId.toString() === userId
    );

    if (!member) {
      throw new AppError('You do not have access to this project', 403);
    }

    const isCreator = project.createdBy.toString() === userId;
    const isOwnerOrAdmin =
      member.role === 'owner' || member.role === 'admin';

    if (!isCreator && !isOwnerOrAdmin) {
      throw new AppError(
        'Only project creator or team owner/admin can delete project',
        403
      );
    }

    // Delete project and all associated tasks
    await Task.deleteMany({ project: id });
    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Project and associated tasks deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get projects by team
 * 
 * GET /api/projects/team/: teamId
 */
export const getProjectsByTeam = async (
  req: Request,
  res: Response,
  next:  NextFunction
): Promise<void> => {
  try {
    const { teamId } = req. params;
    const userId = req.user?.userId;

    // Check if user is member of team
    const team = await Team. findById(teamId);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members. some(
      (member) => member.userId.toString() === userId
    );

    if (!isMember) {
      throw new AppError('You are not a member of this team', 403);
    }

    // Get all projects for this team
    const projects = await Project.find({ team: teamId })
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { projects, total: projects.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project status
 * 
 * PATCH /api/projects/:id/status
 * Body: { status }
 */
export const updateProjectStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?. userId;

    const project = await Project.findById(id);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check if user is team member
    const team = await Team.findById(project.team);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members.some(
      (m) => m.userId.toString() === userId
    );

    if (!isMember) {
      throw new AppError('You do not have access to this project', 403);
    }

    project.status = status;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project status updated successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};