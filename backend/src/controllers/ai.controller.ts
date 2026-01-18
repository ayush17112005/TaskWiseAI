import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/middlewares/error.middleware';
import {
  suggestTaskAssignee,
  suggestTaskDeadline,
  suggestTaskPriority,
  breakdownTask,
} from '@/services/ai.service';
import { Task, Project, Team } from '@/models';

/*
 * Suggest assignee for task
 * 
 * POST /api/ai/suggest-assignee
 * Body: { taskId: "..." }
 */
export const suggestAssignee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { taskId } = req.body;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    if (!taskId) {
      throw new AppError('Task ID is required', 400);
    }

    console.log(`AI Assignee Request - Task: ${taskId}, User: ${userId}`);

    const suggestion = await suggestTaskAssignee(taskId, userId);

    res.status(200).json({
      success: true,
      message: 'AI suggestion generated successfully',
      data: { suggestion },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Suggest deadline for task
 * 
 * POST /api/ai/suggest-deadline
 * Body: { taskId: "..." }
 */
export const suggestDeadline = async (
  req: Request,
  res: Response,
  next:  NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { taskId } = req.body;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    if (!taskId) {
      throw new AppError('Task ID is required', 400);
    }

    console.log(`AI Deadline Request - Task:  ${taskId}, User: ${userId}`);

    const suggestion = await suggestTaskDeadline(taskId, userId);

    res.status(200).json({
      success: true,
      message:  'Deadline suggestion generated successfully',
      data: { suggestion },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Suggest priority for task
 * 
 * POST /api/ai/suggest-priority
 * Body: { taskId: "..." }
 */
export const suggestPriority = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { taskId } = req.body;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    if (!taskId) {
      throw new AppError('Task ID is required', 400);
    }

    console.log(`AI Priority Request - Task: ${taskId}, User: ${userId}`);

    const suggestion = await suggestTaskPriority(taskId, userId);

    res.status(200).json({
      success: true,
      message: 'Priority suggestion generated successfully',
      data: { suggestion },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Break down task into subtasks
 * 
 * POST /api/ai/breakdown-task
 * Body: { taskId: ".. .", maxSubtasks?:  5 }
 */
export const suggestBreakdown = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req. user?.userId;
    const { taskId, maxSubtasks } = req.body;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    if (!taskId) {
      throw new AppError('Task ID is required', 400);
    }

    console.log(`AI Breakdown Request - Task:  ${taskId}, User: ${userId}`);

    const breakdown = await breakdownTask(taskId, userId, maxSubtasks || 5);

    res.status(200).json({
      success: true,
      message: 'Task breakdown generated successfully',
      data: { breakdown },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Get all AI suggestions for a task
 * 
 * GET /api/ai/suggestions/: taskId
 */
export const getTaskSuggestions = async (
  req: Request,
  res:  Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { taskId } = req.params;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Get task with AI suggestions
    const task = await Task.findById(taskId)
      .select('aiSuggestions title')
      .populate('project', 'team');

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Verify user has access
    const project = await Project.findById(task.project);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const team = await Team.findById(project.team);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members.some(
      (m) => m.userId. toString() === userId
    );

    if (!isMember) {
      throw new AppError('You do not have access to this task', 403);
    }

    res.status(200).json({
      success: true,
      data: {
        taskId: task._id,
        taskTitle: task.title,
        suggestions: task.aiSuggestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Get AI usage statistics for user
 * 
 * GET /api/ai/usage
 */
export const getAIUsage = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Count AI suggestions created by user's tasks
    const userTasks = await Task.find({ createdBy: userId });

    let totalSuggestions = 0;
    const suggestionTypes:  any = {
      assignee: 0,
      deadline: 0,
      priority: 0,
      breakdown: 0,
    };

    userTasks.forEach((task) => {
      if (task.aiSuggestions && task.aiSuggestions. length > 0) {
        totalSuggestions += task. aiSuggestions.length;

        task.aiSuggestions.forEach((suggestion: any) => {
          if (suggestionTypes[suggestion.type] !== undefined) {
            suggestionTypes[suggestion.type]++;
          }
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalSuggestions,
        suggestionTypes,
        tasksWithAI: userTasks.filter((t) => t.aiSuggestions && t.aiSuggestions.length > 0).length,
        totalTasks: userTasks.length,
      },
    });
  } catch (error) {
    next(error);
  }
};