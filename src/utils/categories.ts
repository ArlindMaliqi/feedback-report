/**
 * Default feedback categories and utilities
 * @module utils/categories
 */

import type { FeedbackCategory } from '../types';

/**
 * Default feedback categories
 */
export const DEFAULT_CATEGORIES: FeedbackCategory[] = [
  {
    id: 'bug',
    name: 'Bug Report',
    description: 'Report a problem or issue',
    subcategories: [
      { id: 'ui', name: 'User Interface', description: 'Visual or layout issues' },
      { id: 'functionality', name: 'Functionality', description: 'Feature not working as expected' },
      { id: 'performance', name: 'Performance', description: 'Slow loading or responsiveness issues' }
    ]
  },
  {
    id: 'feature',
    name: 'Feature Request',
    description: 'Suggest a new feature',
    subcategories: [
      { id: 'enhancement', name: 'Enhancement', description: 'Improve existing functionality' },
      { id: 'new-feature', name: 'New Feature', description: 'Completely new functionality' }
    ]
  },
  {
    id: 'improvement',
    name: 'Improvement',
    description: 'Suggest an improvement',
    subcategories: [
      { id: 'usability', name: 'Usability', description: 'Make something easier to use' },
      { id: 'accessibility', name: 'Accessibility', description: 'Improve accessibility features' }
    ]
  },
  {
    id: 'question',
    name: 'Question',
    description: 'Ask a question',
    subcategories: [
      { id: 'how-to', name: 'How To', description: 'How to use a feature' },
      { id: 'general', name: 'General', description: 'General questions' }
    ]
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Something else',
    subcategories: []
  }
];

/**
 * Gets a category by ID
 * @param categories - Array of categories to search
 * @param categoryId - ID of the category to find
 * @returns The matching category or undefined if not found
 */
export const getCategoryById = (
  categories: FeedbackCategory[],
  categoryId: string
): FeedbackCategory | undefined => {
  return categories.find(category => category.id === categoryId);
};

/**
 * Gets a subcategory by ID within a specific category
 * @param categories - Array of categories to search
 * @param categoryId - ID of the parent category
 * @param subcategoryId - ID of the subcategory to find
 * @returns The matching subcategory or undefined if not found
 */
export const getSubcategoryById = (
  categories: FeedbackCategory[],
  categoryId: string,
  subcategoryId: string
) => {
  const category = getCategoryById(categories, categoryId);
  if (!category || !category.subcategories) return undefined;
  
  return category.subcategories.find(sub => sub.id === subcategoryId);
};

/**
 * Maps legacy type values to expanded category IDs
 * @param type - Legacy feedback type
 * @returns Corresponding category ID
 */
export const mapTypeToCategory = (
  type: 'bug' | 'feature' | 'improvement' | 'other'
): string => {
  switch (type) {
    case 'bug':
      return 'bug';
    case 'feature':
      return 'feature';
    case 'improvement':
      return 'usability';
    case 'other':
    default:
      return 'other';
  }
};

/**
 * Gets the display name for a category and subcategory combination
 * @param categories - Array of categories
 * @param categoryId - ID of the category
 * @param subcategoryId - ID of the subcategory (optional)
 * @returns Formatted display string, e.g. "Bug Report: App Crash"
 */
export const getCategoryDisplayName = (
  categories: FeedbackCategory[],
  categoryId: string,
  subcategoryId?: string
): string => {
  const category = getCategoryById(categories, categoryId);
  if (!category) return 'Unknown';
  
  if (!subcategoryId) return category.name;
  
  const subcategory = getSubcategoryById(categories, categoryId, subcategoryId);
  if (!subcategory) return category.name;
  
  return `${category.name}: ${subcategory.name}`;
};
