import express from 'express';
import { body, param } from 'express-validator';
import {
  createTeam,
  getMyTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  updateMemberRole,
} from '@/controllers/team.controller';
import { protect } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validation.middleware';
import { TeamMemberRole } from '@/types';

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @route   POST /api/teams
 * @desc    Create new team
 * @access  Private
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Team name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Team name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    validate,
  ],
  createTeam
);

/**
 * @route   GET /api/teams
 * @desc    Get all teams for current user
 * @access  Private
 */
router.get('/', getMyTeams);

/**
 * @route   GET /api/teams/:id
 * @desc    Get single team
 * @access  Private
 */
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid team ID'),
    validate,
  ],
  getTeamById
);

/**
 * @route   PUT /api/teams/:id
 * @desc    Update team
 * @access  Private (Owner/Admin only)
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid team ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Team name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    validate,
  ],
  updateTeam
);

/**
 * @route   DELETE /api/teams/:id
 * @desc    Delete team
 * @access  Private (Owner only)
 */
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid team ID'),
    validate,
  ],
  deleteTeam
);

/**
 * @route   POST /api/teams/:id/members
 * @desc    Add member to team
 * @access  Private (Owner/Admin only)
 */
router.post(
  '/:id/members',
  [
    param('id').isMongoId().withMessage('Invalid team ID'),
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('role')
      .isIn(Object.values(TeamMemberRole))
      .withMessage('Invalid role'),
    validate,
  ],
  addTeamMember
);

/**
 * @route   DELETE /api/teams/: id/members/:memberId
 * @desc    Remove member from team
 * @access  Private (Owner/Admin only)
 */
router.delete(
  '/:id/members/:memberId',
  [
    param('id').isMongoId().withMessage('Invalid team ID'),
    param('memberId').isMongoId().withMessage('Invalid member ID'),
    validate,
  ],
  removeTeamMember
);

/**
 * @route   PUT /api/teams/:id/members/:memberId
 * @desc    Update member role
 * @access  Private (Owner only)
 */
router.put(
  '/:id/members/:memberId',
  [
    param('id').isMongoId().withMessage('Invalid team ID'),
    param('memberId').isMongoId().withMessage('Invalid member ID'),
    body('role')
      .isIn(Object.values(TeamMemberRole))
      .withMessage('Invalid role'),
    validate,
  ],
  updateMemberRole
);

export default router;