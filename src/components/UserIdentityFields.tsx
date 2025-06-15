/**
 * User identity fields component for feedback collection
 * @module components/UserIdentityFields
 */
import React, { useCallback, useEffect, useState } from 'react';
import type { UserIdentity, FeedbackConfig } from '../types';
import { getUserIdentity, saveUserIdentity } from '../utils/offlineStorage';
import { useTheme } from '../hooks/useTheme';

/**
 * Props for the UserIdentityFields component
 */
interface UserIdentityFieldsProps {
  /** Current user identity values */
  value?: UserIdentity;
  /** Function to update identity values */
  onChange: (identity: UserIdentity) => void;
  /** Configuration options */
  config?: Pick<FeedbackConfig, 
    'requiredIdentityFields' | 
    'rememberUserIdentity'
  >;
  /** Whether the fields are disabled */
  disabled?: boolean;
  /** Whether the avatar field should be shown */
  showAvatar?: boolean;
}

/**
 * Component for collecting user identity information in feedback forms
 * 
 * Allows users to provide optional or required identity information
 * like name and email when submitting feedback.
 * 
 * @param props - Component props
 */
export const UserIdentityFields: React.FC<UserIdentityFieldsProps> = ({
  value = {},
  onChange,
  config = {},
  disabled = false,
  showAvatar = false,
}) => {
  const { theme } = useTheme();
  const [rememberIdentity, setRememberIdentity] = useState<boolean>(
    config.rememberUserIdentity !== false
  );
  
  // Load saved identity on mount if remembered
  useEffect(() => {
    if (config.rememberUserIdentity !== false) {
      const savedIdentity = getUserIdentity();
      if (savedIdentity) {
        onChange(savedIdentity);
      }
    }
  }, [config.rememberUserIdentity, onChange]);

  // Handle field change
  const handleFieldChange = (field: keyof UserIdentity, fieldValue: string) => {
    const currentValue = value || {};
    const updatedIdentity = { ...currentValue, [field]: fieldValue };
    onChange(updatedIdentity);
    
    // Save to storage if remember is enabled
    if (rememberIdentity) {
      saveUserIdentity(updatedIdentity);
    }
  };

  // Handle remember checkbox change
  const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberIdentity(e.target.checked);
    
    if (e.target.checked) {
      // Save current identity
      saveUserIdentity(value);
    }
  };

  // Required fields
  const requiredFields = config.requiredIdentityFields || [];

  // Base styles with theme support
  const styles = {
    container: {
      marginBottom: '1rem',
    },
    fieldGroup: {
      marginBottom: '0.5rem',
    },
    label: {
      display: 'block' as const,
      marginBottom: '0.25rem',
      color: theme === 'dark' ? '#e5e7eb' : 'inherit',
      fontWeight: 'normal' as const,
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      borderRadius: '4px',
      border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`,
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
      color: theme === 'dark' ? '#e5e7eb' : 'inherit',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '0.5rem',
    },
    checkbox: {
      marginRight: '0.5rem',
      accentColor: theme === 'dark' ? '#3b82f6' : '#007bff',
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: theme === 'dark' ? '#d1d5db' : '#4b5563',
    },
    privacyText: {
      fontSize: '0.75rem',
      marginTop: '0.5rem',
      color: theme === 'dark' ? '#9ca3af' : '#718096',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.fieldGroup}>
        <label htmlFor="feedback-user-name" style={styles.label}>
          Name {requiredFields.includes('name') && '*'}
        </label>
        <input
          type="text"
          id="feedback-user-name"
          value={value.name || ''}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          style={styles.input}
          disabled={disabled}
          required={requiredFields.includes('name')}
          aria-required={requiredFields.includes('name')}
          placeholder="Your name"
        />
      </div>
      
      <div style={styles.fieldGroup}>
        <label htmlFor="feedback-user-email" style={styles.label}>
          Email {requiredFields.includes('email') && '*'}
        </label>
        <input
          type="email"
          id="feedback-user-email"
          value={value.email || ''}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          style={styles.input}
          disabled={disabled}
          required={requiredFields.includes('email')}
          aria-required={requiredFields.includes('email')}
          placeholder="your.email@example.com"
        />
      </div>

      {showAvatar && (
        <div style={styles.fieldGroup}>
          <label htmlFor="feedback-user-avatar" style={styles.label}>
            Avatar URL (Optional)
          </label>
          <input
            type="url"
            id="feedback-user-avatar"
            value={value.avatar || ''}
            onChange={(e) => handleFieldChange('avatar', e.target.value)}
            style={styles.input}
            disabled={disabled}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
      )}
      
      {config.rememberUserIdentity !== false && (
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="feedback-remember-identity"
            checked={rememberIdentity}
            onChange={handleRememberChange}
            style={styles.checkbox}
            disabled={disabled}
          />
          <label 
            htmlFor="feedback-remember-identity" 
            style={styles.checkboxLabel}
          >
            Remember my information for future feedback
          </label>
        </div>
      )}
      
      <p style={styles.privacyText}>
        Your information will only be used to follow up on your feedback if necessary.
      </p>
    </div>
  );
};

export default UserIdentityFields;
