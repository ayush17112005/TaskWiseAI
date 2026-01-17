import jwt from 'jsonwebtoken';
import config from '@/config/env';
import { JwtPayload } from '@/types';

/**
 * Generate JWT token
 * 
 * @param payload - Data to encode in token (userId, email, role)
 * @returns Signed JWT token string
 * 
 * How it works:
 * 1. Takes user data (payload)
 * 2. Signs it with secret key (only our server knows this key!)
 * 3. Returns encoded token
 * 4. Token expires after JWT_EXPIRE time (7 days in our case)
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  } as jwt.SignOptions);
};

/**
 * Verify JWT token
 * 
 * @param token - JWT token to verify
 * @returns Decoded payload if valid
 * @throws Error if token is invalid/expired
 * 
 * How it works:
 * 1. Takes token from user
 * 2. Verifies it using our secret key
 * 3. If valid, returns the payload (userId, email, role)
 * 4. If invalid/expired, throws error
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from Authorization header
 * 
 * @param authHeader - Authorization header from request
 * @returns Token string or null
 * 
 * Authorization header format:  "Bearer <token>"
 * We need to extract just the <token> part
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // Split "Bearer token123" → ["Bearer", "token123"]
  // Return the second part
  return authHeader.split(' ')[1];
};