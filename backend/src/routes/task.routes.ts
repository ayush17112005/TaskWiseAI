import express from 'express';
import { body, param } from 'express-validator';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  getMyTasks,
  getMyCreatedTasks,
  addDependency,
  removeDependency,
} from '@/controllers/task.controller';
import { protect } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validation.middleware';
import { TaskStatus, TaskPriority } from '@/types';

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @route   GET /api/tasks/my/assigned
 * @desc    Get tasks assigned to current user
 * @access  Private
 */
router.get('/my/assigned', getMyTasks);

/**
 * @route   GET /api/tasks/my/created
 * @desc    Get tasks created by current user
 * @access  Private
 */
router.get('/my/created', getMyCreatedTasks);

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Private (Team members only)
 */
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Task title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('projectId')
      .notEmpty()
      .withMessage('Project ID is required')
      .isMongoId()
      .withMessage('Invalid project ID'),
    body('assignedTo')
      .optional()
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('status')
      .optional()
      .isIn(Object.values(TaskStatus))
      .withMessage('Invalid task status'),
    body('priority')
      .optional()
      .isIn(Object.values(TaskPriority))
      .withMessage('Invalid task priority'),
    body('deadline')
      .optional()
      .isISO8601()
      .withMessage('Invalid deadline format'),
    body('estimatedHours')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Estimated hours must be a positive number'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('parentTask')
      .optional()
      .isMongoId()
      .withMessage('Invalid parent task ID'),
    validate,
  ],
  createTask
);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with filters
 * @access  Private
 */
router.get('/', getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task with subtasks
 * @access  Private
 */
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    validate,
  ],
  getTaskById
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private (Team members only)
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Task title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('assignedTo')
      .optional()
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('status')
      .optional()
      .isIn(Object.values(TaskStatus))
      .withMessage('Invalid task status'),
    body('priority')
      .optional()
      .isIn(Object.values(TaskPriority))
      .withMessage('Invalid task priority'),
    body('deadline')
      .optional()
      .isISO8601()
      .withMessage('Invalid deadline format'),
    body('estimatedHours')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Estimated hours must be a positive number'),
    body('actualHours')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Actual hours must be a positive number'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    validate,
  ],
  updateTask
);

/**
 * @route   DELETE /api/tasks/: id
 * @desc    Delete task
 * @access  Private (Creator or team owner/admin only)
 */
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    validate,
  ],
  deleteTask
);

/**
 * @route   POST /api/tasks/:id/comments
 * @desc    Add comment to task
 * @access  Private (Team members only)
 */
router.post(
  '/:id/comments',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Comment content is required')
      .isLength({ max: 500 })
      .withMessage('Comment cannot exceed 500 characters'),
    validate,
  ],
  addComment
);

/**
 * @route   POST /api/tasks/:id/dependencies
 * @desc    Add task dependency
 * @access  Private (Team members only)
 */
router.post(
  '/:id/dependencies',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('dependencyId')
      .notEmpty()
      .withMessage('Dependency ID is required')
      .isMongoId()
      .withMessage('Invalid dependency ID'),
    validate,
  ],
  addDependency
);

/**
 * @route   DELETE /api/tasks/:id/dependencies/:dependencyId
 * @desc    Remove task dependency
 * @access  Private (Team members only)
 */
router.delete(
  '/:id/dependencies/:dependencyId',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    param('dependencyId').isMongoId().withMessage('Invalid dependency ID'),
    validate,
  ],
  removeDependency
);

export default router;