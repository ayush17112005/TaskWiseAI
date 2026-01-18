import express from 'express';
import { body, param } from 'express-validator';
import {
  suggestAssignee,
  suggestDeadline,
  suggestPriority,
  suggestBreakdown,
  getTaskSuggestions,
  getAIUsage,
} from '@/controllers/ai.controller';
import { protect } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validation.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/ai/suggest-assignee
 * @desc    Get AI suggestion for task assignee
 * @access  Private (Team members only)
 */
router.post(
  '/suggest-assignee',
  [
    body('taskId')
      .notEmpty()
      .withMessage('Task ID is required')
      .isMongoId()
      .withMessage('Invalid task ID'),
    validate,
  ],
  suggestAssignee
);

/**
 * @route   POST /api/ai/suggest-deadline
 * @desc    Get AI suggestion for task deadline
 * @access  Private (Team members only)
 */
router.post(
  '/suggest-deadline',
  [
    body('taskId')
      .notEmpty()
      .withMessage('Task ID is required')
      .isMongoId()
      .withMessage('Invalid task ID'),
    validate,
  ],
  suggestDeadline
);

/**
 * @route   POST /api/ai/suggest-priority
 * @desc    Get AI suggestion for task priority
 * @access  Private (Team members only)
 */
router.post(
  '/suggest-priority',
  [
    body('taskId')
      .notEmpty()
      .withMessage('Task ID is required')
      .isMongoId()
      .withMessage('Invalid task ID'),
    validate,
  ],
  suggestPriority
);

/**
 * @route   POST /api/ai/breakdown-task
 * @desc    Get AI suggestion to break down task into subtasks
 * @access  Private (Team members only)
 */
router.post(
  '/breakdown-task',
  [
    body('taskId')
      .notEmpty()
      .withMessage('Task ID is required')
      .isMongoId()
      .withMessage('Invalid task ID'),
    body('maxSubtasks')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Max subtasks must be between 1 and 10'),
    validate,
  ],
  suggestBreakdown
);

/**
 * @route   GET /api/ai/suggestions/: taskId
 * @desc    Get all AI suggestions for a task
 * @access  Private (Team members only)
 */
router.get(
  '/suggestions/:taskId',
  [
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    validate,
  ],
  getTaskSuggestions
);

/**
 * @route   GET /api/ai/usage
 * @desc    Get AI usage statistics for current user
 * @access  Private
 */
router.get('/usage', getAIUsage);

export default router;