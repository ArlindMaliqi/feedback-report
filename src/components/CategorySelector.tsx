/**
 * Category selector component for feedback categorization
 * @module components/CategorySelector
 */
import React, { useState, useEffect, useCallback } from 'react';
import type { Category, Subcategory } from '../types';

export interface CategorySelectorProps {
  /** Array of available categories */
  categories: Category[];
  /** Currently selected category ID */
  selectedCategory?: string;
  /** Currently selected subcategory ID */
  selectedSubcategory?: string;
  /** Function called when selection changes */
  onSelectionChange: (categoryId: string, subcategoryId?: string) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Optional custom class name for styling */
  className?: string;
}

/**
 * Component for selecting feedback categories and subcategories
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onSelectionChange,
  disabled = false,
  className = ''
}) => {
  const [selectedCat, setSelectedCat] = useState<string>(selectedCategory || '');
  const [selectedSubcat, setSelectedSubcat] = useState<string | undefined>(selectedSubcategory);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(selectedCategory || null);
  
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
      setSelectedCat(selectedCategory || '');
    }
    if (selectedSubcategory !== selectedSubcat) {
      setSelectedSubcat(selectedSubcategory);
    }
  }, [selectedCategory, selectedSubcategory, selectedCat, selectedSubcat]);

  // Handle category change
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCat(categoryId);
    setSelectedSubcat(undefined);
    onSelectionChange(categoryId, undefined); // Reset subcategory when category changes
  }, [onSelectionChange]);

  // Handle subcategory change
  const handleSubcategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategoryId = e.target.value;
    setSelectedSubcat(subcategoryId || undefined);
    onSelectionChange(selectedCat, subcategoryId || undefined);
  }, [onSelectionChange, selectedCat]);

  // Handle category expansion/collapse
  const handleCategorySelect = useCallback((categoryId: string) => {
    if (disabled) return;
    
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    onSelectionChange(categoryId);
  }, [expandedCategory, onSelectionChange, disabled]);

  // Handle subcategory selection
  const handleSubcategorySelect = useCallback((categoryId: string, subcategoryId: string) => {
    if (disabled) return;
    onSelectionChange(categoryId, subcategoryId);
  }, [onSelectionChange, disabled]);

  // Reset subcategory if category changes and subcategory doesn't exist
  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      const category = categories.find(c => c.id === selectedCategory);
      const subcategoryExists = category?.subcategories?.some((s: Subcategory) => s.id === selectedSubcategory);
      
      if (!subcategoryExists) {
        onSelectionChange(selectedCategory);
      }
    }
  }, [selectedCategory, selectedSubcategory, categories, onSelectionChange]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <>
      <style>
        {`
          .feedback-category-container * {
            box-sizing: border-box;
          }
          .feedback-category-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .feedback-category-select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 14px;
            background-color: #fafafa;
            color: #111827;
            transition: all 0.2s ease;
            outline: none;
            font-family: inherit;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 12px center;
            background-repeat: no-repeat;
            background-size: 16px;
            padding-right: 40px;
          }
          .feedback-category-select:focus {
            border-color: #3b82f6;
            background-color: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          .feedback-category-select:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: #f3f4f6;
          }
          .feedback-category-help {
            font-size: 12px;
            color: #6b7280;
            margin-top: 6px;
            line-height: 1.4;
          }
        `}
      </style>
      
      <div className={`feedback-category-container ${className}`} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="feedback-category" className="feedback-category-label">
            📂 Category <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            id="feedback-category"
            value={selectedCat}
            onChange={handleCategoryChange}
            className="feedback-category-select"
            disabled={disabled}
            required
            aria-required="true"
          >
            <option value="" disabled>Select a category</option>
            {categories.map(category => (
              <option 
                key={category.id} 
                value={category.id}
              >
                {category.icon ? `${category.icon} ` : ''}{category.name}
              </option>
            ))}
          </select>
          {selectedCat && (
            <p className="feedback-category-help">
              {categories.find(c => c.id === selectedCat)?.description}
            </p>
          )}
        </div>
        
        {availableSubcategories.length > 0 && (
          <div>
            <label htmlFor="feedback-subcategory" className="feedback-category-label">
              🏷️ Subcategory (Optional)
            </label>
            <select
              id="feedback-subcategory"
              value={selectedSubcat || ''}
              onChange={handleSubcategoryChange}
              className="feedback-category-select"
              disabled={disabled}
            >
              <option value="">Select a subcategory (optional)</option>
              {availableSubcategories.map(subcategory => (
                <option 
                  key={subcategory.id} 
                  value={subcategory.id}
                >
                  {subcategory.icon ? `${subcategory.icon} ` : ''}{subcategory.name}
                </option>
              ))}
            </select>
            {selectedSubcat && (
              <p className="feedback-category-help">
                {availableSubcategories.find(s => s.id === selectedSubcat)?.description}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CategorySelector;
