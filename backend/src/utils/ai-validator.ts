import { User } from '@/models';

/*
 * Validate assignee suggestion response
 */
export const validateAssigneeSuggestion = async (response: any): Promise<boolean> => {
  // Check required fields
  if (!response.suggestedUserId) {
    console.error('Missing suggestedUserId');
    return false;
  }

  if (typeof response.confidence !== 'number' || response. confidence < 0 || response. confidence > 1) {
    console.error('Invalid confidence score');
    return false;
  }

  if (!response.reasoning || typeof response.reasoning !== 'string') {
    console.error('Missing or invalid reasoning');
    return false;
  }

  // Check if user exists
  const userExists = await User.findById(response.suggestedUserId);
  if (!userExists) {
    console.error('Suggested user does not exist');
    return false;
  }

  return true;
};

/*
 * Validate deadline suggestion
 */
export const validateDeadlineSuggestion = (response: any): boolean => {
  if (typeof response.suggestedDays !== 'number' || response. suggestedDays < 0) {
    console.error('Invalid suggestedDays');
    return false;
  }

  if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 1) {
    console.error('Invalid confidence');
    return false;
  }

  if (!response.reasoning) {
    console.error('Missing reasoning');
    return false;
  }

  return true;
};

/*
 * Validate priority suggestion
 */
export const validatePrioritySuggestion = (response: any): boolean => {
  const validPriorities = ['low', 'medium', 'high', 'urgent'];

  if (! validPriorities.includes(response.suggestedPriority)) {
    console.error('Invalid priority value');
    return false;
  }

  if (typeof response. confidence !== 'number' || response.confidence < 0 || response.confidence > 1) {
    console.error('Invalid confidence');
    return false;
  }

  if (!response.reasoning) {
    console.error('Missing reasoning');
    return false;
  }

  return true;
};

/*
 * Validate task breakdown
 */
export const validateTaskBreakdown = (response: any): boolean => {
  if (!Array.isArray(response.subtasks)) {
    console.error('Subtasks must be an array');
    return false;
  }

  for (const subtask of response.subtasks) {
    if (!subtask.title || typeof subtask.title !== 'string') {
      console.error('Invalid subtask title');
      return false;
    }

    if (typeof subtask.order !== 'number') {
      console.error('Invalid subtask order');
      return false;
    }
  }

  if (! response.reasoning) {
    console.error('Missing reasoning');
    return false;
  }

  return true;
};