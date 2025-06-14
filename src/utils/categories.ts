import type { FeedbackCategory } from '../types';

/**
 * Default feedback categories with subcategories
 */
export const defaultCategories: FeedbackCategory[] = [
  {
    id: 'bug',
    name: 'Bug Report',
    description: 'Report an issue or unexpected behavior',
    icon: '🐛',
    color: '#e53e3e',
    subcategories: [
      { id: 'crash', name: 'App Crash' },
      { id: 'visual', name: 'Visual Glitch' },
      { id: 'performance', name: 'Performance Issue' },
      { id: 'functionality', name: 'Broken Functionality' },
      { id: 'typo', name: 'Text/Content Error' },
      { id: 'other-bug', name: 'Other Bug' }
    ]
  },
  {
    id: 'feature',
    name: 'Feature Request',
    description: 'Suggest a new feature or enhancement',
    icon: '✨',
    color: '#38a169',
    subcategories: [
      { id: 'new-feature', name: 'New Feature' },
      { id: 'enhancement', name: 'Enhancement to Existing Feature' },
      { id: 'integration', name: 'Integration Request' },
      { id: 'workflow', name: 'Workflow Improvement' },
      { id: 'other-feature', name: 'Other Suggestion' }
    ]
  },
  {
    id: 'usability',
    name: 'Usability',
    description: 'Feedback about user experience and ease of use',
    icon: '👆',
    color: '#3182ce',
    subcategories: [
      { id: 'confusion', name: 'Confusing Interface' },
      { id: 'difficulty', name: 'Difficult to Use' },
      { id: 'accessibility', name: 'Accessibility Issue' },
      { id: 'navigation', name: 'Navigation Problem' },
      { id: 'other-usability', name: 'Other Usability Issue' }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Feedback about the text, images, or other content',
    icon: '📝',
    color: '#805ad5',
    subcategories: [
      { id: 'inaccurate', name: 'Inaccurate Information' },
      { id: 'outdated', name: 'Outdated Content' },
      { id: 'incomplete', name: 'Incomplete Information' },
      { id: 'inappropriate', name: 'Inappropriate Content' },
      { id: 'other-content', name: 'Other Content Issue' }
    ]
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Feedback about speed and resource usage',
    icon: '⚡',
    color: '#dd6b20',
    subcategories: [
      { id: 'slowness', name: 'Slow Performance' },
      { id: 'memory', name: 'High Memory Usage' },
      { id: 'battery', name: 'Battery Drain' },
      { id: 'network', name: 'Network Usage Issue' },
      { id: 'other-performance', name: 'Other Performance Issue' }
    ]
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Any other feedback that doesn\'t fit elsewhere',
    icon: '💬',
    color: '#718096',
    subcategories: [
      { id: 'praise', name: 'Praise' },
      { id: 'question', name: 'Question' },
      { id: 'other-feedback', name: 'Other Feedback' }
    ]
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
