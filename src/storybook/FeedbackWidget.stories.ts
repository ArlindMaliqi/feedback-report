/**
 * Storybook stories for FeedbackWidget components
 * @module storybook/FeedbackWidget.stories
 */
import type { Meta, StoryObj } from '@storybook/react';
import { FeedbackProvider } from '../components/FeedbackProvider';
import type { FeedbackProviderProps } from '../types';

/**
 * Storybook configuration for FeedbackWidget
 */
const meta: Meta<FeedbackProviderProps> = {
  title: 'Feedback/FeedbackProvider',
  component: FeedbackProvider as any, // Type assertion to handle the interface mismatch
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export type Story = StoryObj<typeof meta>;

/**
 * Default story with basic configuration
 */
export const Default: Story = {
  args: {
    config: {
      apiEndpoint: '/api/feedback',
      enableShakeDetection: true,
      theme: 'system'
    }
  }
};

/**
 * Story with advanced features enabled
 */
export const Advanced: Story = {
  args: {
    config: {
      apiEndpoint: '/api/feedback',
      enableShakeDetection: true,
      enableOfflineSupport: true,
      enableVoting: true,
      collectUserIdentity: true,
      enableFileAttachments: true
    }
  }
};
