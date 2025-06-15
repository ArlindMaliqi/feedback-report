import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { OptimizedFeedbackWidget } from '../components/OptimizedFeedbackWidget';

const meta: Meta<typeof OptimizedFeedbackWidget> = {
  title: 'Components/FeedbackWidget',
  component: OptimizedFeedbackWidget as any, // Fix the type issue
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive feedback widget with extensive customization options.'
      }
    }
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system']
    },
    config: {
      control: { type: 'object' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof OptimizedFeedbackWidget>;

// Basic stories
export const Default: Story = {
  args: {
    config: {
      apiEndpoint: '/api/feedback',
      enableShakeDetection: false
    }
  }
};

export const WithShakeDetection: Story = {
  args: {
    config: {
      apiEndpoint: '/api/feedback',
      enableShakeDetection: true
    }
  }
};

// Theme variants
export const LightTheme: Story = {
  args: {
    theme: 'light',
    config: { apiEndpoint: '/api/feedback' }
  }
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    config: { apiEndpoint: '/api/feedback' }
  }
};

// Advanced configurations
export const WithAnalytics: Story = {
  args: {
    config: {
      apiEndpoint: '/api/feedback',
      analytics: {
        provider: 'google-analytics',
        trackingId: 'GA_TRACKING_ID'
      }
    }
  }
};

export const WithIntegrations: Story = {
  args: {
    config: {
      apiEndpoint: '/api/feedback',
      issueTracker: {
        provider: 'github',
        owner: 'example',
        repository: 'example-repo'
      },
      notifications: {
        slack: {
          webhookUrl: 'https://hooks.slack.com/services/...'
        }
      }
    }
  }
};

// Interactive playground
export const Playground: Story = {
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
