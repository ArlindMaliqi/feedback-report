/**
 * Offline storage utilities
 * @module utils/offlineStorage
 */
import type { Feedback, UserIdentity } from '../types';

const FEEDBACK_STORAGE_KEY = 'feedback-report-offline-items';
const USER_IDENTITY_KEY = 'feedback-report-user-identity';

/**
 * Saves pending feedback to local storage for offline use
 * @param feedback - The feedback item to store
 */
export const saveFeedbackOffline = (feedback: Feedback): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getFeedbackFromStorage();
    const updated = [...existing, feedback];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save feedback offline:', error);
  }
};

/**
 * Retrieves all pending feedback items from local storage
 * @returns Array of pending feedback items
 */
export const getFeedbackFromStorage = (): Feedback[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
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
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getFeedbackFromStorage();
    const filtered = existing.filter(f => f.id !== id);
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove feedback from storage:', error);
  }
};

/**
 * Updates a feedback item in local storage
 * @param id - ID of the feedback to update
 * @param updates - Partial updates to apply
 */
export const updateFeedbackInStorage = (id: string, updates: Partial<Feedback>): void => {
  if (typeof window === 'undefined') return;
  
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
  if (typeof window === 'undefined') return false;
  return !navigator.onLine;
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
