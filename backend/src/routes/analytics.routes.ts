import express from 'express';
import { param } from 'express-validator';
import {
  teamWorkload,
  projectStatistics,
  userDashboard,
  memberPerformance,
  completionTrends,
} from '@/controllers/analytics.controller';
import { protect } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validation.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get user dashboard statistics
 * @access  Private
 */
router.get('/dashboard', userDashboard);

/**
 * @route   GET /api/analytics/team/:teamId/workload
 * @desc    Get team workload distribution
 * @access  Private (Team members only)
 */
router.get(
  '/team/:teamId/workload',
  [param('teamId').isMongoId().withMessage('Invalid team ID'), validate],
  teamWorkload
);

/**
 * @route   GET /api/analytics/project/:projectId/stats
 * @desc    Get project statistics
 * @access  Private
 */
router.get(
  '/project/:projectId/stats',
  [param('projectId').isMongoId().withMessage('Invalid project ID'), validate],
  projectStatistics
);

/**
 * @route   GET /api/analytics/project/:projectId/trends
 * @desc    Get task completion trends
 * @access  Private
 */
router.get(
  '/project/:projectId/trends',
  [param('projectId').isMongoId().withMessage('Invalid project ID'), validate],
  completionTrends
);

/**
 * @route   GET /api/analytics/team/:teamId/member/:memberId/performance
 * @desc    Get member performance history
 * @access  Private (Team members only)
 */
router.get(
  '/team/:teamId/member/:memberId/performance',
  [
    param('teamId').isMongoId().withMessage('Invalid team ID'),
    param('memberId').isMongoId().withMessage('Invalid member ID'),
    validate,
  ],
  memberPerformance
);

export default router;