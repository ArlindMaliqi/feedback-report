/**
 * Lazy-loaded component definitions for optimal bundle splitting
 * @module core/lazyComponents
 */
import { lazy, ComponentType } from 'react';

/**
 * Lazy-loaded feedback modal component
 * This component is only loaded when the modal needs to be displayed
 */
export const LazyFeedbackModal = lazy(() => 
  import('../components/FeedbackModal').then(module => ({
    default: module.FeedbackModal
  }))
) as ComponentType<any>;

/**
 * Lazy-loaded file attachment input component
 * Only loaded when file attachments are enabled
 */
export const LazyFileAttachmentInput = lazy(() =>
  import('../components/FileAttachmentInput').then(module => ({
    default: module.FileAttachmentInput
  }))
) as ComponentType<any>;

/**
 * Lazy-loaded user identity fields component
 * Only loaded when user identity collection is enabled
 */
export const LazyUserIdentityFields = lazy(() =>
  import('../components/UserIdentityFields').then(module => ({
    default: module.UserIdentityFields
  }))
) as ComponentType<any>;

/**
 * Lazy-loaded category selector component
 * Only loaded when categories are configured
 */
export const LazyCategorySelector = lazy(() =>
  import('../components/CategorySelector').then(module => ({
    default: module.CategorySelector
  }))
) as ComponentType<any>;

/**
 * Lazy-loaded shake detector component
 * Only loaded when shake detection is enabled
 */
export const LazyShakeDetector = lazy(() =>
  import('../components/ShakeDetector').then(module => ({
    default: module.ShakeDetector
  }))
) as ComponentType<any>;

/**
 * Lazy-loaded offline indicator component
 * Only loaded when offline support is enabled
 */
export const LazyOfflineIndicator = lazy(() =>
  import('../components/OfflineIndicator').then(module => ({
    default: module.OfflineIndicator
  }))
) as ComponentType<any>;

/**
 * Lazy-loaded theme toggle button component
 * Only loaded when theme switching is enabled
 */
export const LazyThemeToggleButton = lazy(() =>
  import('../components/ThemeToggleButton').then(module => ({
    default: module.ThemeToggleButton
  }))
) as ComponentType<any>;

/**
 * Lazy-loaded integrations module
 * Only loaded when integrations are configured
 */
export const lazyIntegrations = {
  analytics: () => import('../utils/integrations/analytics'),
  issueTracker: () => import('../utils/integrations/issueTracker'),
  webhooks: () => import('../utils/integrations/webhooks'),
  notifications: () => import('../utils/integrations/notifications'),
};

/**
 * Lazy-loaded testing utilities
 * Only loaded in development/test environments
 */
export const lazyTestingUtils = () =>
  import('../testing').then(module => module);

/**
 * Lazy-loaded storybook stories
 * Only loaded in Storybook environment
 */
export const lazyStorybookStories = () =>
  import('../storybook/FeedbackWidget.stories').then(module => module);
