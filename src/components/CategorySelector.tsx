/**
 * Category selector component
 * @module components/CategorySelector
 */
import React, { useState, useEffect } from 'react';
import type { FeedbackCategory, FeedbackSubcategory } from '../types';
import { useTheme } from '../hooks/useTheme';

export interface CategorySelectorProps {
  /** Array of available categories */
  categories: FeedbackCategory[];
  /** Currently selected category ID */
  selectedCategory: string;
  /** Currently selected subcategory ID */
  selectedSubcategory?: string;
  /** Function called when selection changes */
  onSelectionChange: (categoryId: string, subcategoryId?: string) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
}

/**
 * Component for selecting feedback categories and subcategories
 * 
 * Provides a user-friendly interface for categorizing feedback
 * with a two-level hierarchy of categories and subcategories.
 * 
 * @param props - Component props
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onSelectionChange,
  disabled = false
}) => {
  const { theme } = useTheme();
  const [selectedCat, setSelectedCat] = useState<string>(selectedCategory);
  const [selectedSubcat, setSelectedSubcat] = useState<string | undefined>(selectedSubcategory);
  const [availableSubcategories, setAvailableSubcategories] = useState<FeedbackSubcategory[]>([]);
  
  // Update available subcategories when selected category changes
  useEffect(() => {
    const category = categories.find(c => c.id === selectedCat);
    setAvailableSubcategories(category?.subcategories || []);
    
    // Reset subcategory if changing to a category that doesn't have the currently selected one
    if (selectedSubcat) {
      const subcategoryExists = category?.subcategories?.some(s => s.id === selectedSubcat);
      if (!subcategoryExists) {
        setSelectedSubcat(undefined);
        onSelectionChange(selectedCat, undefined);
      }
    }
  }, [selectedCat, categories, selectedSubcat, onSelectionChange]);
  
  // Update component state when props change (for external control)
  useEffect(() => {
    if (selectedCategory !== selectedCat) {
      setSelectedCat(selectedCategory);
    }
    if (selectedSubcategory !== selectedSubcat) {
      setSelectedSubcat(selectedSubcategory);
    }
  }, [selectedCategory, selectedSubcategory, selectedCat, selectedSubcat]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCat(newCategory);
    setSelectedSubcat(undefined);
    onSelectionChange(newCategory, undefined);
  };

  // Handle subcategory change
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubcategory = e.target.value;
    setSelectedSubcat(newSubcategory || undefined);
    onSelectionChange(selectedCat, newSubcategory || undefined);
  };

  // Base styles with theme support
  const styles = {
    container: {
      marginBottom: '1rem',
    },
    categorySelector: {
      marginBottom: '0.5rem',
    },
    label: {
      display: 'block' as const,
      marginBottom: '0.25rem',
      color: theme === 'dark' ? '#e5e7eb' : 'inherit',
    },
    select: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '4px',
      border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`,
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      color: theme === 'dark' ? '#e5e7eb' : 'inherit',
    },
    categoryOption: (category: FeedbackCategory) => ({
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      color: category.color || (theme === 'dark' ? '#e5e7eb' : 'inherit'),
    }),
    helpText: {
      fontSize: '0.75rem',
      marginTop: '0.25rem',
      color: theme === 'dark' ? '#9ca3af' : '#718096',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.categorySelector}>
        <label htmlFor="feedback-category" style={styles.label}>
          Category *
        </label>
        <select
          id="feedback-category"
          value={selectedCat}
          onChange={handleCategoryChange}
          style={styles.select}
          disabled={disabled}
          required
          aria-required="true"
        >
          <option value="" disabled>Select a category</option>
          {categories.map(category => (
            <option 
              key={category.id} 
              value={category.id}
              style={styles.categoryOption(category)}
            >
              {category.icon ? `${category.icon} ` : ''}{category.name}
            </option>
          ))}
        </select>
        {selectedCat && (
          <p style={styles.helpText}>
            {categories.find(c => c.id === selectedCat)?.description}
          </p>
        )}
      </div>
      
      {availableSubcategories.length > 0 && (
        <div>
          <label htmlFor="feedback-subcategory" style={styles.label}>
            Subcategory
          </label>
          <select
            id="feedback-subcategory"
            value={selectedSubcat || ''}
            onChange={handleSubcategoryChange}
            style={styles.select}
            disabled={disabled}
          >
            <option value="">Select a subcategory (optional)</option>
            {availableSubcategories.map(subcategory => (
              <option 
                key={subcategory.id} 
                value={subcategory.id}
              >
                {subcategory.name}
              </option>
            ))}
          </select>
          {selectedSubcat && (
            <p style={styles.helpText}>
              {availableSubcategories.find(s => s.id === selectedSubcat)?.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
