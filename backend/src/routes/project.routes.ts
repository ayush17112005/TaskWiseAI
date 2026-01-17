import express from 'express';
import { body, param} from 'express-validator';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByTeam,
  updateProjectStatus,
} from '@/controllers/project.controller';
import { protect } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validation.middleware';
import { ProjectStatus, ProjectPriority } from '@/types';

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private (Team members only)
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Project name is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Project name must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('teamId')
      .notEmpty()
      .withMessage('Team ID is required')
      .isMongoId()
      .withMessage('Invalid team ID'),
    body('status')
      .optional()
      .isIn(Object.values(ProjectStatus))
      .withMessage('Invalid project status'),
    body('priority')
      .optional()
      .isIn(Object.values(ProjectPriority))
      .withMessage('Invalid project priority'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid start date format'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid end date format'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    validate,
  ],
  createProject
);

/**
 * @route   GET /api/projects
 * @desc    Get all projects (with filters)
 * @access  Private
 */
router.get('/', getProjects);

/**
 * @route   GET /api/projects/team/:teamId
 * @desc    Get all projects for a team
 * @access  Private (Team members only)
 */
router.get(
  '/team/:teamId',
  [
    param('teamId').isMongoId().withMessage('Invalid team ID'),
    validate,
  ],
  getProjectsByTeam
);

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project with stats
 * @access  Private (Team members only)
 */
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid project ID'),
    validate,
  ],
  getProjectById
);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private (Team members only)
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Project name must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(Object.values(ProjectStatus))
      .withMessage('Invalid project status'),
    body('priority')
      .optional()
      .isIn(Object.values(ProjectPriority))
      .withMessage('Invalid project priority'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid start date format'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid end date format'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    validate,
  ],
  updateProject
);

/**
 * @route   PATCH /api/projects/:id/status
 * @desc    Update project status only
 * @access  Private (Team members only)
 */
router.patch(
  '/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(Object.values(ProjectStatus))
      .withMessage('Invalid project status'),
    validate,
  ],
  updateProjectStatus
);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private (Creator or team owner/admin only)
 */
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid project ID'),
    validate,
  ],
  deleteProject
);

export default router;