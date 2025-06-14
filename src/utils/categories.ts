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
    color: '#ff4444',
    subcategories: [
      { id: 'ui', name: 'User Interface', description: 'Visual or layout issues' },
      { id: 'performance', name: 'Performance', description: 'Slow loading or responsiveness' },
      { id: 'functionality', name: 'Functionality', description: 'Feature not working as expected' }
    ]
  },
  {
    id: 'feature',
    name: 'Feature Request',
    description: 'Suggest a new feature or improvement',
    color: '#4CAF50',
    subcategories: [
      { id: 'enhancement', name: 'Enhancement', description: 'Improve existing functionality' },
      { id: 'new-feature', name: 'New Feature', description: 'Request entirely new functionality' }
    ]
  },
  {
    id: 'improvement',
    name: 'Improvement',
    description: 'Suggest an enhancement to existing functionality',
    color: '#2196F3',
    subcategories: [
      { id: 'usability', name: 'Usability', description: 'Make it easier to use' },
      { id: 'design', name: 'Design', description: 'Visual or aesthetic improvements' }
    ]
  },
  {
    id: 'other',
    name: 'Other',
    description: 'General feedback or questions',
    color: '#9E9E9E',
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
