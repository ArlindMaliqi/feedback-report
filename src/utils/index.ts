/**
 * Core utility functions
 */

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Handle API response
 */
export const handleApiResponse = async (response: Response): Promise<{ success: boolean; error?: string }> => {
  if (response.ok) {
    return { success: true };
  }
  
  let errorMessage = `HTTP ${response.status}`;
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    // Ignore JSON parsing errors
  }
  
  return { success: false, error: errorMessage };
};

// Re-export validation
export { validateFeedback, isValidEmail, isValidUrl, sanitizeInput } from './validation';