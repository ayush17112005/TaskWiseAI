// Global error handler
// Catches all errors and sends consistent responses
import { Request, Response, NextFunction } from 'express';
import config from '@/config/env';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 📚 Global error handler middleware
 * 
 * MUST have 4 parameters (err, req, res, next) for Express to recognize it as error handler
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  // If it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err. statusCode;
    message = err.message;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // Mongoose duplicate key error
  if (err. name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 400;
    const field = Object.keys((err as any).keyPattern)[0];
    message = `${field} already exists`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }), // Show stack trace in dev
  });
};