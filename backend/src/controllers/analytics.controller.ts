//Analytics controller

import { Request, Response, NextFunction } from 'express';
import { Team } from '@/models';
import { AppError } from '@/middlewares/error.middleware';
import {
  getTeamWorkload,
  getProjectStats,
  getUserDashboard,
  getMemberPerformanceHistory,
  getTaskCompletionTrends,
} from '@/services/analytics.service';

/**
 * Get team workload
 * 
 * GET /api/analytics/team/: teamId/workload
 */
export const teamWorkload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { teamId } = req.params;
    const userId = req.user?.userId;

    // Check if user is team member
    const team = await Team. findById(teamId);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const isMember = team.members.some(
      (member) => member.userId. toString() === userId
    );

    if (!isMember) {
      throw new AppError('You are not a member of this team', 403);
    }

    const workload = await getTeamWorkload(teamId as string);

    res.status(200).json({
      success: true,
      data: workload,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get project statistics
 * 
 * GET /api/analytics/project/:projectId/stats
 */
export const projectStatistics = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    const stats = await getProjectStats(projectId as string);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Get user dashboard
 * 
 * GET /api/analytics/dashboard
 */
export const userDashboard = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const dashboard = await getUserDashboard(userId);

    res.status(200).json({
      success: true,
      data:  dashboard,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get member performance history
 * 
 * GET /api/analytics/team/:teamId/member/: memberId/performance
 */
export const memberPerformance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { teamId, memberId } = req.params;

    const performance = await getMemberPerformanceHistory(memberId as string, teamId as string);

    res.status(200).json({
      success: true,
      data: performance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get task completion trends
 * 
 * GET /api/analytics/project/:projectId/trends
 */
export const completionTrends = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    const trends = await getTaskCompletionTrends(projectId as string);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};