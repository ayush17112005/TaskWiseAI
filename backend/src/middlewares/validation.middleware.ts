// LEARNING: Request validation middleware using express-validator
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validate request based on validation chain
 * 
 * Usage: 
 * router.post('/register',
 *   body('email').isEmail(),
 *   body('password').isLength({ min: 6 }),
 *   validate,  // ← This middleware checks the validations
 *   register
 * );
 */
export const validate = (
  req:  Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
      })),
    });
    return;
  }

  next();
};