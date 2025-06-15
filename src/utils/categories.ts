/**
 * Category management utilities
 * @module utils/categories
 */
import type { Category, Subcategory } from '../types';

/**
 * Default categories for feedback classification
 */
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'bug',
    name: 'Bug Report',
    description: 'Report a problem or issue',
    icon: '🐛',
    color: '#ef4444',
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
        id: 'crash',
        name: 'Crash/Error',
        description: 'Application crashes or error messages',
        icon: '💥'
      },
      {
        id: 'data',
        name: 'Data Issues',
        description: 'Problems with data loading or saving',
        icon: '📊'
      }
    ]
  },
  {
    id: 'feature',
    name: 'Feature Request',
    description: 'Suggest a new feature or improvement',
    icon: '💡',
    color: '#10b981',
    subcategories: [
      {
        id: 'enhancement',
        name: 'Enhancement',
        description: 'Improve existing functionality',
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
      },
      {
        id: 'automation',
        name: 'Automation',
        description: 'Automate manual processes',
        icon: '🤖'
      }
    ]
  },
  {
    id: 'usability',
    name: 'Usability',
    description: 'User experience and interface feedback',
    icon: '👥',
    color: '#3b82f6',
    subcategories: [
      {
        id: 'navigation',
        name: 'Navigation',
        description: 'Difficulty finding or accessing features',
        icon: '🧭'
      },
      {
        id: 'accessibility',
        name: 'Accessibility',
        description: 'Issues with screen readers or keyboard navigation',
        icon: '♿'
      },
      {
        id: 'mobile',
        name: 'Mobile Experience',
        description: 'Issues specific to mobile devices',
        icon: '📱'
      },
      {
        id: 'design',
        name: 'Design',
        description: 'Visual design and layout suggestions',
        icon: '🎨'
      }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Feedback about content quality and accuracy',
    icon: '📝',
    color: '#8b5cf6',
    subcategories: [
      {
        id: 'accuracy',
        name: 'Accuracy',
        description: 'Incorrect or outdated information',
        icon: '✅'
      },
      {
        id: 'missing',
        name: 'Missing Content',
        description: 'Content that should be added',
        icon: '❓'
      },
      {
        id: 'quality',
        name: 'Quality',
        description: 'Content quality improvements',
        icon: '⭐'
      }
    ]
  },
  {
    id: 'other',
    name: 'Other',
    description: 'General feedback or questions',
    icon: '💬',
    color: '#6b7280',
    subcategories: [
      {
        id: 'question',
        name: 'Question',
        description: 'General questions or help requests',
        icon: '❓'
      },
      {
        id: 'compliment',
        name: 'Compliment',
        description: 'Positive feedback and praise',
        icon: '👏'
      },
      {
        id: 'complaint',
        name: 'Complaint',
        description: 'General complaints or concerns',
        icon: '😞'
      }
    ]
  }
];

/**
 * Get a category by ID
 */
export const getCategoryById = (categoryId: string): Category | undefined => {
  return DEFAULT_CATEGORIES.find(category => category.id === categoryId);
};

/**
 * Get a subcategory by category and subcategory ID
 */
export const getSubcategoryById = (categoryId: string, subcategoryId: string): Subcategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subcategories?.find((sub: Subcategory) => sub.id === subcategoryId);
};

/**
 * Get all categories as a flat list with their subcategories
 */
export const getFlatCategoryList = (): Array<{ category: Category; subcategory?: Subcategory }> => {
  const flatList: Array<{ category: Category; subcategory?: Subcategory }> = [];
  
  DEFAULT_CATEGORIES.forEach(category => {
    // Add the main category
    flatList.push({ category });
    
    // Add subcategories if they exist
    if (category.subcategories) {
      category.subcategories.forEach((subcategory: Subcategory) => {
        flatList.push({ category, subcategory });
      });
    }
  });
  
  return flatList;
};
