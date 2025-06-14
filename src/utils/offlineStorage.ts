import type { Feedback, UserIdentity } from '../types';

const FEEDBACK_STORAGE_KEY = 'feedback-report-offline-items';
const USER_IDENTITY_KEY = 'feedback-report-user-identity';

/**
 * Saves pending feedback to local storage for offline use
 * @param feedback - The feedback item to store
 */
export const saveFeedbackOffline = (feedback: Feedback): void => {
  try {
    const storedItems = getFeedbackFromStorage();
    
    // Handle attachments for offline storage
    const preparedFeedback: Feedback = {
      ...feedback,
      // Convert any Blob/File objects to data URLs
      attachments: feedback.attachments?.map(attachment => {
        // Only keep dataUrl for offline storage
        const { file, ...rest } = attachment;
        return rest;
      }),
      submissionStatus: 'pending' as const
    };
    
    // Add to stored items
    storedItems.push(preparedFeedback);
    
    // Save back to storage
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(storedItems));
  } catch (error) {
    console.error('Failed to save feedback offline:', error);
  }
};

/**
 * Retrieves all pending feedback items from local storage
 * @returns Array of pending feedback items
 */
export const getFeedbackFromStorage = (): Feedback[] => {
  try {
    const storedData = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error('Failed to retrieve offline feedback:', error);
    return [];
  }
};

/**
 * Removes a feedback item from local storage
 * @param id - ID of the feedback to remove
 */
export const removeFeedbackFromStorage = (id: string): void => {
  try {
    const storedItems = getFeedbackFromStorage();
    const updatedItems = storedItems.filter(item => item.id !== id);
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Failed to remove feedback from offline storage:', error);
  }
};

/**
 * Updates a feedback item in local storage
 * @param id - ID of the feedback to update
 * @param updates - Partial updates to apply
 */
export const updateFeedbackInStorage = (id: string, updates: Partial<Feedback>): void => {
  try {
    const storedItems = getFeedbackFromStorage();
    const updatedItems = storedItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Failed to update feedback in offline storage:', error);
  }
};

/**
 * Saves user identity information to local storage
 * @param identity - User identity information to store
 */
export const saveUserIdentity = (identity: UserIdentity): void => {
  try {
    localStorage.setItem(USER_IDENTITY_KEY, JSON.stringify(identity));
  } catch (error) {
    console.error('Failed to save user identity:', error);
  }
};

/**
 * Retrieves user identity information from local storage
 * @returns User identity or null if not found
 */
export const getUserIdentity = (): UserIdentity | null => {
  try {
    const storedData = localStorage.getItem(USER_IDENTITY_KEY);
    if (!storedData) return null;
    
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to retrieve user identity:', error);
    return null;
  }
};

/**
 * Clears user identity information from local storage
 */
export const clearUserIdentity = (): void => {
  try {
    localStorage.removeItem(USER_IDENTITY_KEY);
  } catch (error) {
    console.error('Failed to clear user identity:', error);
  }
};

/**
 * Checks if the application is currently offline
 * @returns Boolean indicating offline status
 */
export const isOffline = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

/**
 * Registers listeners for online/offline events
 * @param onlineCallback - Function to call when going online
 * @param offlineCallback - Function to call when going offline
 * @returns Cleanup function to remove listeners
 */
export const registerConnectivityListeners = (
  onlineCallback: () => void,
  offlineCallback: () => void
): () => void => {
  if (typeof window === 'undefined') return () => {};
  
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
  
  return () => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  };
};
