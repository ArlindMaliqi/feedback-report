/**
 * Storybook stories for FeedbackWidget components
 * @module storybook/FeedbackWidget.stories
 */
import type { Meta as StoryMeta, StoryObj as StoryObject } from '@storybook/react';
import { FeedbackProvider, type FeedbackProviderProps } from '../components/FeedbackProvider';

/**
 * Storybook configuration for FeedbackWidget
 */
const meta: StoryMeta<FeedbackProviderProps> = {
  title: 'Components/FeedbackWidget',
  component: FeedbackProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive feedback widget with various configuration options.'
      }
    }
  },
  argTypes: {
    config: {
      control: 'object',
      description: 'Configuration object for the feedback widget'
    }
  }
};

export default meta;

export type Story = StoryObject<typeof meta>;

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
