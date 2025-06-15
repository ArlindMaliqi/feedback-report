/**
 * User identity fields component for feedback collection
 * @module components/UserIdentityFields
 */
import React, { useCallback, useEffect, useState } from 'react';
import type { UserIdentity, FeedbackConfig } from '../types';

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
  /** Theme preference */
  theme?: 'light' | 'dark' | 'system';
}

/**
 * Component for collecting user identity information in feedback forms
 */
export const UserIdentityFields: React.FC<UserIdentityFieldsProps> = ({
  value = {},
  onChange,
  config = {},
  disabled = false,
  showAvatar = false,
  theme = 'light'
}) => {
  const [rememberIdentity, setRememberIdentity] = useState<boolean>(
    config.rememberUserIdentity !== false
  );
  
  // Handle field change
  const handleFieldChange = (field: keyof UserIdentity, fieldValue: string) => {
    const currentValue = value || {};
    const updatedIdentity = { ...currentValue, [field]: fieldValue };
    onChange(updatedIdentity);
  };

  // Handle remember checkbox change
  const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberIdentity(e.target.checked);
  };

  // Required fields
  const requiredFields = config.requiredIdentityFields || [];

  // Enhanced styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      padding: '20px',
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
      borderRadius: '12px',
      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500' as const,
      color: theme === 'dark' ? '#f3f4f6' : '#374151',
      marginBottom: '2px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: `2px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
      backgroundColor: theme === 'dark' ? '#111827' : 'white',
      color: theme === 'dark' ? '#f3f4f6' : '#111827',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      outline: 'none',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box' as const,
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 0',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      accentColor: '#3b82f6',
    },
    checkboxLabel: {
      fontSize: '14px',
      color: theme === 'dark' ? '#d1d5db' : '#4b5563',
    },
    privacyText: {
      fontSize: '12px',
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      lineHeight: '1.4',
      padding: '8px 12px',
      backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
      borderRadius: '6px',
      border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
    }
  };

  const inputFocusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = '#3b82f6';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.fieldGroup}>
        <label htmlFor="feedback-user-name" style={styles.label}>
          Name {requiredFields.includes('name') && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <input
          type="text"
          id="feedback-user-name"
          value={value.name || ''}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          style={styles.input}
          disabled={disabled}
          required={requiredFields.includes('name')}
          placeholder="Your full name"
          {...inputFocusProps}
        />
      </div>
      
      <div style={styles.fieldGroup}>
        <label htmlFor="feedback-user-email" style={styles.label}>
          Email {requiredFields.includes('email') && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <input
          type="email"
          id="feedback-user-email"
          value={value.email || ''}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          style={styles.input}
          disabled={disabled}
          required={requiredFields.includes('email')}
          placeholder="your.email@example.com"
          {...inputFocusProps}
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
            {...inputFocusProps}
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
      
      <div style={styles.privacyText}>
        🔒 Your information will only be used to follow up on your feedback if necessary. 
        We respect your privacy and won't share your details with third parties.
      </div>
    </div>
  );
};

export default UserIdentityFields;
