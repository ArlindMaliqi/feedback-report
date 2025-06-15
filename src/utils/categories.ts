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
    icon: '🐛',
    color: '#dc2626',
    subcategories: [
      {
        id: 'ui',
        name: 'User Interface',
        description: 'Visual or layout issues',
        icon: '🎨'
      },
      {
        id: 'performance',
        name: 'Performance',
        description: 'Slow or unresponsive behavior',
        icon: '⚡'
      },
      {
        id: 'functionality',
        name: 'Functionality',
        description: 'Feature not working as expected',
        icon: '⚙️'
      },
      {
        id: 'data',
        name: 'Data Issues',
        description: 'Incorrect or missing data',
        icon: '📊'
      }
    ]
  },
  {
    id: 'feature',
    name: 'Feature Request',
    description: 'Suggest a new feature or improvement',
    icon: '💡',
    color: '#2563eb',
    subcategories: [
      {
        id: 'enhancement',
        name: 'Enhancement',
        description: 'Improve existing feature',
        icon: '⬆️'
      },
      {
        id: 'new-feature',
        name: 'New Feature',
        description: 'Add completely new functionality',
        icon: '✨'
      },
      {
        id: 'integration',
        name: 'Integration',
        description: 'Connect with external services',
        icon: '🔗'
      }
    ]
  },
  {
    id: 'improvement',
    name: 'Improvement',
    description: 'Suggest improvements to existing features',
    icon: '📈',
    color: '#059669',
    subcategories: [
      {
        id: 'usability',
        name: 'Usability',
        description: 'Make features easier to use',
        icon: '👥'
      },
      {
        id: 'accessibility',
        name: 'Accessibility',
        description: 'Improve accessibility support',
        icon: '♿'
      },
      {
        id: 'design',
        name: 'Design',
        description: 'Visual and UX improvements',
        icon: '🎨'
      }
    ]
  },
  {
    id: 'question',
    name: 'Question',
    description: 'Ask questions or request help',
    icon: '❓',
    color: '#7c3aed',
    subcategories: [
      {
        id: 'how-to',
        name: 'How To',
        description: 'Learn how to use features',
        icon: '📚'
      },
      {
        id: 'clarification',
        name: 'Clarification',
        description: 'Need clarification on behavior',
        icon: '🤔'
      }
    ]
  },
  {
    id: 'other',
    name: 'Other',
    description: 'General feedback or questions',
    icon: '💬',
    color: '#6b7280',
    subcategories: []
  }
];

/**
 * Get category by ID
 */
export const getCategoryById = (id: string): FeedbackCategory | undefined => {
  return DEFAULT_CATEGORIES.find(category => category.id === id);
};

/**
 * Get subcategory by category and subcategory ID
 */
export const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories?.find(sub => sub.id === subcategoryId);
};

/**
 * Get all categories with their subcategories flattened
 */
export const getFlattenedCategories = () => {
  const flattened: Array<{ category: FeedbackCategory; subcategory?: any }> = [];
  
  DEFAULT_CATEGORIES.forEach(category => {
    flattened.push({ category });
    
    if (category.subcategories) {
      category.subcategories.forEach(subcategory => {
        flattened.push({ category, subcategory });
      });
    }
  });
  
  return flattened;
};
