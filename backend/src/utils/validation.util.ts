/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * At least 6 characters
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Sanitize string (remove extra whitespace)
 */
export const sanitizeString = (str: string): string => {
  return str.trim();
};

/**
 * Check if string is empty or only whitespace
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};