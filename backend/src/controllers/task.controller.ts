import { Request, Response, NextFunction } from 'express';
import { Task, Project, Team, Notification } from '@/models';
import { AppError } from '@/middlewares/error.middleware';
import {
  CreateTaskDto,
  UpdateTaskDto,
  AddCommentDto,
  TaskStatus,
  NotificationType,
} from '@/types';

/**
 * Create new task
 * 
 * POST /api/tasks
 * Body: { title, description?, projectId, assignedTo?, status?, priority?, deadline?, estimatedHours?, tags?, parentTask?   }
 */
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {
      title,
      description,
      projectId,
      assignedTo,
      status,
      priority,
      deadline,
      estimatedHours,
      tags,
      parentTask,
    }: CreateTaskDto = req.body;

    // 1. Check if project exists
    const project = await Project.findById(projectId);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // 2. Check if user is member of project's team
    const team = await Team.findById(project.team);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members.some(
      (member) => member.userId. toString() === userId
    );

    if (!isMember) {
      throw new AppError('You must be a team member to create tasks', 403);
    }

    // 3. If assignedTo is provided, check if they're team member
    if (assignedTo) {
      const assigneeIsMember = team.members.some(
        (member) => member.userId.toString() === assignedTo
      );

      if (!assigneeIsMember) {
        throw new AppError('Assigned user must be a team member', 400);
      }
    }

    // 4. If parentTask provided, check it exists
    if (parentTask) {
      const parent = await Task.findById(parentTask);
      if (!parent) {
        throw new AppError('Parent task not found', 404);
      }
      if (parent.project.toString() !== projectId) {
        throw new AppError('Parent task must be in the same project', 400);
      }
    }

    // 5. Create task
    const task = await Task.create({
      title,
      description,
      project:  projectId,
      createdBy: userId,
      assignedTo: assignedTo || undefined,
      status,
      priority,
      deadline:  deadline ? new Date(deadline) : undefined,
      estimatedHours,
      tags,
      parentTask:  parentTask || undefined,
      comments: [],
      aiSuggestions: [],
      dependencies: [],
    });

    // 6. Populate fields
    await task.populate('project', 'name');
    await task.populate('createdBy', 'name email avatar');
    if (assignedTo) {
      await task.populate('assignedTo', 'name email avatar');
    }

    // 7. Create notification if task is assigned
    if (assignedTo && assignedTo !== userId) {
      await Notification.create({
        userId:  assignedTo,
        type:  NotificationType.TASK_ASSIGNED,
        title: 'New Task Assigned',
        message: `You have been assigned to task:  ${title}`,
        relatedTask: task._id,
        relatedProject: projectId,
        isRead: false,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tasks with filters
 * 
 * GET /api/tasks
 * Query:   ? projectId=xxx&assignedTo=xxx&status=todo&priority=high&overdue=true&search=keyword&page=1&limit=10
 */
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req. query.limit as string) || 10;
    const search = req.query.search as string;

    // Build filters
    const {
      projectId,
      assignedTo,
      status,
      priority,
      overdue,
      tags,
    } = req.query as any;

    // Get user's teams to filter tasks
    const userTeams = await Team.find({
      'members.userId': userId,
      isActive: true,
    }).select('_id');

    const teamIds = userTeams.map((team) => team._id);

    // Get projects from user's teams
    const userProjects = await Project.find({
      team: { $in:  teamIds },
    }).select('_id');

    const projectIds = userProjects.map((project) => project._id);

    // Build query
    const query:  any = {
      project: { $in: projectIds },
    };

    // Apply filters
    if (projectId) {
      query.project = projectId;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (overdue === 'true') {
      query.deadline = { $lt: new Date() };
      query.status = { $ne: TaskStatus.COMPLETED };
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query. tags = { $in: tagArray };
    }

    if (search) {
      query.$or = [
        { title:  { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options:  'i' } },
      ];
    }

    // Execute query
    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('createdBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar')
      .populate('parentTask', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: { tasks },
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
 * Get single task by ID
 * 
 * GET /api/tasks/:id
 */
export const getTaskById = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const task = await Task.findById(id)
      .populate('project', 'name team')
      .populate('createdBy', 'name email avatar')
      .populate('assignedTo', 'name email avatar')
      .populate('parentTask', 'title status')
      .populate('dependencies', 'title status')
      .populate('comments.userId', 'name email avatar');

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check if user has access to this task
    const project = await Project.findById(task.project);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const team = await Team.findById(project.team);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members.some(
      (member) => member.userId.toString() === userId
    );

    if (!isMember) {
      throw new AppError('You do not have access to this task', 403);
    }

    // Get subtasks
    const subtasks = await Task.find({ parentTask: id })
      .populate('assignedTo', 'name email avatar')
      .select('title status priority deadline assignedTo');

    res.status(200).json({
      success: true,
      data: {
        task,
        subtasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update task
 * 
 * PUT /api/tasks/:id
 */
export const updateTask = async (
  req: Request,
  res: Response,
  next:  NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req. user?.userId;
    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      deadline,
      estimatedHours,
      actualHours,
      tags,
    }: UpdateTaskDto = req.body;

    const task = await Task.findById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check permissions
    const project = await Project.findById(task.project);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const team = await Team.findById(project.team);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members.some(
      (member) => member.userId.toString() === userId
    );

    if (!isMember) {
      throw new AppError('You do not have access to this task', 403);
    }

    // Track if assignee changed for notification
    const oldAssignee = task.assignedTo?. toString();
    const assigneeChanged = assignedTo && assignedTo !== oldAssignee;

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) {
      // Check if new assignee is team member
      if (assignedTo) {
        const assigneeIsMember = team.members.some(
          (member) => member.userId.toString() === assignedTo
        );
        if (!assigneeIsMember) {
          throw new AppError('Assigned user must be a team member', 400);
        }
      }
      task.assignedTo = assignedTo ?  (assignedTo as any) : undefined;
    }
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (deadline !== undefined)
      task.deadline = deadline ?  new Date(deadline) : undefined;
    if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
    if (actualHours !== undefined) task.actualHours = actualHours;
    if (tags !== undefined) task.tags = tags;

    await task.save();

    await task.populate('project', 'name');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('assignedTo', 'name email avatar');

    // Create notifications
    if (assigneeChanged && assignedTo && assignedTo !== userId) {
      await Notification.create({
        userId: assignedTo,
        type: NotificationType.TASK_ASSIGNED,
        title: 'Task Assigned to You',
        message: `You have been assigned to task: ${task.title}`,
        relatedTask: task._id,
        relatedProject: project._id,
        isRead: false,
      });
    }

    if (status === TaskStatus.COMPLETED && task.assignedTo) {
      await Notification.create({
        userId: task.createdBy as any,
        type: NotificationType.TASK_COMPLETED,
        title: 'Task Completed',
        message: `Task "${task.title}" has been completed`,
        relatedTask: task._id,
        relatedProject:  project._id,
        isRead: false,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete task
 * 
 * DELETE /api/tasks/: id
 */
export const deleteTask = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const task = await Task. findById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check permissions - must be creator or team owner/admin
    const project = await Project.findById(task.project);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const team = await Team. findById(project.team);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const member = team.members.find(
      (m) => m.userId.toString() === userId
    );

    if (!member) {
      throw new AppError('You do not have access to this task', 403);
    }

    const isCreator = task.createdBy. toString() === userId;
    const isOwnerOrAdmin = member.role === 'owner' || member. role === 'admin';

    if (!isCreator && !isOwnerOrAdmin) {
      throw new AppError(
        'Only task creator or team owner/admin can delete tasks',
        403
      );
    }

    // Delete all subtasks
    await Task.deleteMany({ parentTask: id });

    // Remove this task from dependencies of other tasks
    await Task.updateMany(
      { dependencies: id },
      { $pull: { dependencies: id } }
    );

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task and subtasks deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add comment to task
 * 
 * POST /api/tasks/:id/comments
 * Body: { content }
 */
export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { content }: AddCommentDto = req. body;

    const task = await Task.findById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check if user has access
    const project = await Project.findById(task.project);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const team = await Team.findById(project.team);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members.some(
      (member) => member.userId.toString() === userId
    );

    if (!isMember) {
      throw new AppError('You do not have access to this task', 403);
    }

    // Add comment
    task.comments.push({
      userId:  userId as any,
      content,
      createdAt: new Date(),
    } as any);

    await task.save();

    await task.populate('comments.userId', 'name email avatar');

    // Notify task creator and assignee (if not the commenter)
    const notifyUsers = [
      task.createdBy. toString(),
      task.assignedTo?.toString(),
    ].filter((uid) => uid && uid !== userId);

    for (const notifyUserId of notifyUsers) {
      if (notifyUserId) {
        await Notification.create({
          userId: notifyUserId,
          type: NotificationType.COMMENT_ADDED,
          title: 'New Comment on Task',
          message: `New comment on task: ${task.title}`,
          relatedTask: task._id,
          relatedProject: project._id,
          isRead: false,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tasks assigned to current user
 * 
 * GET /api/tasks/my/assigned
 */
export const getMyTasks = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const status = req.query.status as string;

    const query: any = { assignedTo: userId };

    if (status) {
      query.status = status;
    }

    const tasks = await Task. find(query)
      .populate('project', 'name')
      .populate('createdBy', 'name email avatar')
      .sort({ deadline: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { tasks, total: tasks.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tasks created by current user
 * 
 * GET /api/tasks/my/created
 */
export const getMyCreatedTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const tasks = await Task.find({ createdBy: userId })
      .populate('project', 'name')
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { tasks, total:  tasks.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add task dependency
 * 
 * POST /api/tasks/:id/dependencies
 * Body: { dependencyId }
 */
export const addDependency = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { dependencyId } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const dependencyTask = await Task.findById(dependencyId);
    if (!dependencyTask) {
      throw new AppError('Dependency task not found', 404);
    }

    // Must be in same project
    if (task.project.toString() !== dependencyTask.project.toString()) {
      throw new AppError('Tasks must be in the same project', 400);
    }

    // Check if already a dependency
    const alreadyDependent = task.dependencies?. some(
      (dep) => dep.toString() === dependencyId
    );

    if (alreadyDependent) {
      throw new AppError('This dependency already exists', 400);
    }

    // Add dependency
    if (!task.dependencies) {
      task.dependencies = [];
    }
    task.dependencies.push(dependencyId as any);
    await task.save();

    await task.populate('dependencies', 'title status');

    res.status(200).json({
      success: true,
      message: 'Dependency added successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove task dependency
 * 
 * DELETE /api/tasks/:id/dependencies/: dependencyId
 */
export const removeDependency = async (
  req: Request,
  res: Response,
  next:  NextFunction
): Promise<void> => {
  try {
    const { id, dependencyId } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    task.dependencies = task.dependencies?. filter(
      (dep) => dep.toString() !== dependencyId
    );

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Dependency removed successfully',
    });
  } catch (error) {
    next(error);
  }
};