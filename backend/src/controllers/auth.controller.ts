// LEARNING: Authentication controller
// Handles user registration, login, profile management

import { Request, Response, NextFunction } from 'express';
import { User } from '@/models';
import { generateToken } from '@/utils/jwt.util';
import { AppError } from '@/middlewares/error.middleware';
import { CreateUserDto, LoginUserDto, UserRole } from '@/types';

/**
 * Register new user
 * 
 * POST /api/auth/register
 * Body: { name, email, password, role?  }
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role }: CreateUserDto = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // 2. Create user (password will be hashed automatically by pre-save hook!)
    const user = await User.create({
      name,
      email:  email.toLowerCase(),
      password,
      role: role || UserRole.MEMBER,
      teams: [],
      isActive: true,
    });

    // 3. Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 4. Return response (password automatically removed by toJSON method!)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user:  user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * 
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password }: LoginUserDto = req.body;

    // 1. Find user by email (include password field this time!)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // 2. Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // 3. Compare passwords (using our custom method!)
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // 4. Update last login
    user.lastLogin = new Date();
    await user.save();

    // 5. Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 6. Return response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * 
 * GET /api/auth/me
 * Headers: Authorization: Bearer <token>
 */
export const getMe = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user?.userId)
      .select('-password')
      .populate('teams', 'name'); // 📚 Populate team names

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * 
 * PUT /api/auth/me
 * Headers: Authorization: Bearer <token>
 * Body: { name?, avatar?  }
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findById(req.user?.userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update allowed fields only
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user:  user.toJSON() },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 * 
 * PUT /api/auth/change-password
 * Headers: Authorization: Bearer <token>
 * Body: { currentPassword, newPassword }
 */
export const changePassword = async (
  req:  Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User. findById(req.user?.userId).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};