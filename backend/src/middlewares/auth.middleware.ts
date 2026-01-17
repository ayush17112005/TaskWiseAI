//  Authentication middleware
// Middleware = function that runs BEFORE your controller

import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '@/utils/jwt.util';
import { User } from '@/models';
import { JwtPayload, UserRole } from '@/types';

// Extend Express Request type to include user
// This allows us to access req.user in controllers
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { _id: string };
    }
  }
}

/**
 * Protect routes - Verify JWT token
 * 
 * How it works:
 * 1. Extract token from Authorization header
 * 2. Verify token is valid
 * 3. Find user in database
 * 4.  Attach user to request object
 * 5. Call next() to proceed to controller
 * 
 * If ANY step fails → return 401 Unauthorized
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Get token from header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized.  No token provided.',
      });
      return;
    }

    // 2. Verify token
    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      res.status(401).json({
        success: false,
        message:  'Not authorized. Invalid token.',
      });
      return;
    }

    // 3. Check if user still exists (user might be deleted after token was issued)
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
      return;
    }

    // 4. Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account is deactivated.',
      });
      return;
    }

    // 5. Attach user to request
    req.user = {
      ...decoded,
      _id: user._id.toString(),
    };

    // 6. Proceed to next middleware/controller
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Authorize roles - Check if user has required role
 * 
 * @param roles - Array of allowed roles
 * @returns Middleware function
 * 
 * Usage:  authorize([UserRole. ADMIN, UserRole. MANAGER])
 * 
 * This is a middleware FACTORY (returns a middleware function)
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // protect middleware must run before this! 
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.',
      });
      return;
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message:  `Not authorized. Required roles: ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
};