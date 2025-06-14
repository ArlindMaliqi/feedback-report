import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FeedbackProvider } from '../components/FeedbackProvider';
import { FeedbackButton } from '../components/FeedbackButton';
import { FeedbackWidget } from '../index';
import { defaultCategories } from '../utils/categories';
import { bugReportTemplate, featureRequestTemplate, defaultTemplate } from '../utils/templates';

/**
 * Storybook metadata for FeedbackWidget component
 */
const meta: Meta<typeof FeedbackWidget> = {
  title: 'Components/FeedbackWidget',
  component: FeedbackWidget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive feedback collection widget for React applications.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    config: {
      description: 'Configuration options for the feedback system',
      control: 'object'
    },
    showButton: {
      description: 'Whether to show the floating feedback button',
      control: 'boolean'
    },
    enableShakeDetection: {
      description: 'Whether to enable shake detection to trigger feedback',
      control: 'boolean'
    },
    theme: {
      description: 'Theme preference for the widget',
      control: { type: 'select' },
      options: ['light', 'dark', 'system']
    },
    template: {
      description: 'Feedback template to use',
      control: { type: 'select' },
      options: ['default', 'bug-report', 'feature-request']
    },
    animation: {
      description: 'Animation configuration for the modal',
      control: 'object'
    }
  }
};

export default meta;
type Story = StoryObj<typeof FeedbackWidget>;

/**
 * Default implementation of the feedback widget
 */
export const Default: Story = {
  args: {
    showButton: true,
    enableShakeDetection: false,
    theme: 'system',
    template: 'default',
    config: {
      apiEndpoint: 'https://api.example.com/feedback',
      enableOfflineSupport: true,
      enableVoting: true
    }
  }
};

/**
 * Light theme variant
 */
export const LightTheme: Story = {
  args: {
    ...Default.args,
    theme: 'light'
  }
};

/**
 * Dark theme variant
 */
export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: 'dark'
  }
};

/**
 * Bug report template implementation
 */
export const BugReportTemplate: Story = {
  args: {
    ...Default.args,
    template: 'bug-report',
    config: {
      ...Default.args?.config,
      useExpandedCategories: true
    }
  }
};

/**
 * Feature request template implementation
 */
export const FeatureRequestTemplate: Story = {
  args: {
    ...Default.args,
    template: 'feature-request'
  }
};

/**
 * Customized styling example
 */
export const CustomStyling: Story = {
  args: {
    ...Default.args,
    theme: 'light',
    modalStyles: {
      overlay: {
        backgroundColor: 'rgba(0, 0, 100, 0.7)'
      },
      content: {
        backgroundColor: '#f0f8ff',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 150, 0.2)'
      },
      buttons: {
        primaryBackgroundColor: '#0055ff',
        secondaryBackgroundColor: '#f0f0ff',
        secondaryTextColor: '#0033cc'
      }
    }
  }
};

/**
 * Integration with analytics and issue trackers
 */
export const WithIntegrations: Story = {
  args: {
    ...Default.args,
    config: {
      ...Default.args?.config,
      analytics: {
        provider: 'google-analytics',
        trackingId: 'UA-EXAMPLE-ID',
        eventName: 'feedback_submitted'
      },
      issueTracker: {
        provider: 'github',
        apiEndpoint: 'https://api.github.com',
        apiToken: 'your-token-here',
        owner: 'your-username',
        repository: 'your-repo-name'
      },
      notifications: {
        platform: 'slack',
        webhookUrl: 'https://hooks.slack.com/services/your/webhook/url'
      }
    }
  }
};
