# React Feedback Report Widget

[![npm version](https://badge.fury.io/js/react-feedback-report-widget.svg)](https://badge.fury.io/js/react-feedback-report-widget)
[![Release](https://github.com/ArlindMaliqi/feedback-report/actions/workflows/release.yml/badge.svg)](https://github.com/ArlindMaliqi/feedback-report/actions/workflows/release.yml)
[![GitHub Package Registry](https://img.shields.io/badge/GitHub%20Package%20Registry-published-blue)](https://github.com/ArlindMaliqi/feedback-report/packages)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-feedback-report-widget)](https://bundlephobia.com/package/react-feedback-report-widget)

## Overview

A comprehensive, TypeScript-first feedback collection system for React applications. This widget provides an enterprise-grade solution for collecting user feedback with extensive customization options, powerful integrations, and professional developer experience.

## ✨ Key Features

### 🎨 User Interface & Experience

- **Multiple Themes**: Built-in dark/light mode with automatic system preference detection
- **Accessibility First**: WCAG 2.1 compliant with full keyboard navigation and screen reader support
- **Smooth Animations**: Configurable entrance/exit animations with performance optimization
- **Custom Templates**: Pre-defined forms for bug reports, feature requests, and general feedback
- **Responsive Design**: Mobile-first design that works across all devices

### 🚀 Core Functionality

- **Shake Detection**: Device shake to trigger feedback modal
- **File Attachments**: Support for screenshots and document uploads
- **User Identity**: Optional user identification with privacy controls
- **Smart Categories**: Hierarchical categorization system with subcategories
- **Offline Support**: Local storage with automatic sync when online
- **Feedback Voting**: Community-driven feedback prioritization
- **Rich Text Editor**: Enhanced input with formatting options

### 🔌 Powerful Integrations

- **Analytics**: Google Analytics, Segment, Mixpanel, and custom providers
- **Issue Trackers**: GitHub Issues, Jira, GitLab, Azure DevOps integration
- **Webhooks**: Custom endpoint integration with payload signing
- **Communications**: Slack, Microsoft Teams, Discord notifications
- **Localization**: Full i18n support with RTL language compatibility

### 👨‍💻 Developer Experience

- **TypeScript First**: Complete type safety and IntelliSense support
- **Testing Utilities**: Comprehensive test helpers and React Testing Library integration
- **Storybook Ready**: Component documentation and visual testing
- **Framework Examples**: Next.js, Gatsby, Remix implementation guides
- **Performance Optimized**: Bundle splitting, lazy loading, and SSR support

## 📦 Installation

### From NPM Registry

To install the React Feedback Report Widget from NPM, run the following command:

```bash
npm install react-feedback-report-widget
```

### Optional Dependencies

For enhanced toast notifications, you can optionally install:

```bash
npm install sonner
```

The widget will gracefully fall back to console logging if sonner is not available.

### From GitHub Packages

You can also install directly from GitHub Packages:

```bash
# Configure npm to use GitHub Packages for @ArlindMaliqi scope
echo "@ArlindMaliqi:registry=https://npm.pkg.github.com" >> .npmrc

# Install the package
npm install @ArlindMaliqi/react-feedback-report-widget
```

Or create a `.npmrc` file in your project root:

```
@ArlindMaliqi:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

## 🚀 Quick Start

### Basic Setup

To use the React Feedback Report Widget in your application, wrap your component tree with the `FeedbackProvider` and include the `FeedbackButton` component.

```tsx
import React from "react";
import { FeedbackProvider, FeedbackButton } from "react-feedback-report-widget";

const App = () => {
  return (
    <FeedbackProvider
      config={{
        apiEndpoint: "/api/feedback",
        enableShakeDetection: true,
        theme: "system", // 'light', 'dark', or 'system'
      }}
    >
      <YourMainComponent />
      <FeedbackButton />
    </FeedbackProvider>
  );
};

export default App;
```

### Advanced Configuration

```tsx
import { FeedbackProvider, OptimizedFeedbackWidget } from "react-feedback-report-widget";

const App = () => {
  const feedbackConfig = {
    // Core settings
    apiEndpoint: "/api/feedback",
    enableShakeDetection: true,
    enableOfflineSupport: true,
    enableVoting: true,
    
    // User experience
    collectUserIdentity: true,
    enableFileAttachments: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    
    // Categories
    categories: [
      {
        id: "bug",
        name: "Bug Report",
        subcategories: [
          { id: "ui", name: "User Interface" },
          { id: "performance", name: "Performance" },
          { id: "functionality", name: "Functionality" }
        ]
      },
      {
        id: "feature",
        name: "Feature Request",
        subcategories: [
          { id: "enhancement", name: "Enhancement" },
          { id: "new-feature", name: "New Feature" }
        ]
      }
    ],
    
    // Analytics integration
    analytics: {
      provider: "google-analytics",
      trackingId: "GA_TRACKING_ID",
      trackEvents: true,
      trackPageViews: true
    },
    
    // Issue tracker integration
    issueTracker: {
      provider: "github",
      apiToken: process.env.GITHUB_TOKEN,
      owner: "your-org",
      repository: "your-repo",
      labels: ["feedback", "user-report"]
    },
    
    // Webhook integration
    webhooks: [
      {
        url: "https://your-api.com/webhook",
        secret: process.env.WEBHOOK_SECRET,
        events: ["feedback.created", "feedback.voted"]
      }
    ],
    
    // Notifications
    notifications: {
      slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: "#feedback",
        mentions: ["@dev-team"]
      }
    },
    
    // Localization
    localization: {
      locale: "en",
      fallbackLocale: "en",
      rtl: false,
      customTranslations: {
        "feedback.submit": "Send Feedback",
        "feedback.placeholder": "Tell us what's on your mind..."
      }
    }
  };

  return (
    <OptimizedFeedbackWidget
      config={feedbackConfig}
      theme="system"
      showButton={true}
      enableShakeDetection={true}
    />
  );
};
```

## 🔧 Framework Integration Examples

### Next.js

```tsx
// pages/_app.tsx
import { OptimizedFeedbackWidget } from "react-feedback-report-widget";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <OptimizedFeedbackWidget
        config={{
          apiEndpoint: "/api/feedback",
          enableOfflineSupport: true,
        }}
      />
    </>
  );
}

// pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Handle feedback submission
    console.log("Feedback received:", req.body);
    res.status(200).json({ success: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### Gatsby

```tsx
// src/components/layout.tsx
import React from "react";
import { FeedbackProvider, FeedbackButton } from "react-feedback-report-widget";

const Layout = ({ children }) => {
  return (
    <FeedbackProvider
      config={{
        apiEndpoint: "/.netlify/functions/feedback",
        enableShakeDetection: true,
      }}
    >
      <main>{children}</main>
      <FeedbackButton />
    </FeedbackProvider>
  );
};

export default Layout;
```

## 🧪 Testing

### Test Utilities

```tsx
import { render, screen } from "@testing-library/react";
import { createMockFeedbackProvider, mockFeedbackSubmission } from "react-feedback-report-widget/testing";
import YourComponent from "./YourComponent";

describe("YourComponent", () => {
  it("should handle feedback submission", async () => {
    const mockSubmit = mockFeedbackSubmission();
    
    render(
      <createMockFeedbackProvider>
        <YourComponent />
      </createMockFeedbackProvider>
    );
    
    // Your test logic here
    expect(mockSubmit).toHaveBeenCalled();
  });
});
```

## 🎨 Storybook Integration

```tsx
// .storybook/main.js
module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "react-feedback-report-widget/storybook"
  ],
};

// Your component stories
import { FeedbackWidgetStories } from "react-feedback-report-widget/storybook";

export default FeedbackWidgetStories;
```

## 🔧 Advanced Hooks

### useFeedbackHistory

```tsx
import { useFeedbackHistory } from "react-feedback-report-widget";

const FeedbackDashboard = () => {
  const { feedbacks, loading, error, refresh } = useFeedbackHistory({
    limit: 50,
    sortBy: "timestamp",
    filterBy: { type: "bug" }
  });

  if (loading) return <div>Loading feedback...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {feedbacks.map((feedback) => (
        <div key={feedback.id}>
          <h3>{feedback.message}</h3>
          <p>Type: {feedback.type}</p>
          <p>Votes: {feedback.votes}</p>
        </div>
      ))}
    </div>
  );
};
```

### useFeedbackAnalytics

```tsx
import { useFeedbackAnalytics } from "react-feedback-report-widget";

const AnalyticsDashboard = () => {
  const { analytics, isLoading } = useFeedbackAnalytics({
    timeRange: "last-30-days",
    groupBy: "category"
  });

  return (
    <div>
      <h2>Feedback Analytics</h2>
      <p>Total Submissions: {analytics.totalSubmissions}</p>
      <p>Average Rating: {analytics.averageRating}</p>
      {/* Render charts and graphs */}
    </div>
  );
};
```

## 📊 Performance Optimization

The widget is built with performance in mind:

- **Code Splitting**: Components load only when needed
- **Tree Shaking**: Unused features are eliminated from bundles
- **SSR Compatible**: Works seamlessly with server-side rendering
- **Lazy Loading**: Heavy components load on demand
- **Bundle Analysis**: Built-in tools for monitoring bundle size

```bash
# Analyze bundle size
npm run analyze

# Performance audit
npm run perf:audit
```

## 🌍 Internationalization

```tsx
const config = {
  localization: {
    locale: "es",
    fallbackLocale: "en",
    rtl: false,
    customTranslations: {
      "feedback.title": "Enviar Comentarios",
      "feedback.submit": "Enviar",
      "feedback.cancel": "Cancelar"
    }
  }
};

// Supported locales: en, es, fr, de, it, pt, ja, ko, zh, ar, he, ru
```

## 🔒 Privacy & Security

- **GDPR Compliant**: Built-in privacy controls and data handling
- **Secure by Default**: XSS protection and input sanitization
- **Optional Data Collection**: Granular control over what data is collected
- **Local Storage**: Sensitive data never leaves the client without consent

## 📚 API Reference

### FeedbackProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `FeedbackConfig` | `{}` | Configuration object |
| `children` | `ReactNode` | - | Child components |

### FeedbackButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Button position |
| `label` | `string` | `'Feedback'` | Button label |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run typecheck

# Lint code
npm run lint

# Start Storybook
npm run storybook
```

## 📋 Browser Support

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Commit Convention

This project uses [Conventional Commits](https://conventionalcommits.org/):

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏷️ Package Availability

This package is available on both:

- **NPM Registry**: `react-feedback-report-widget`
- **GitHub Packages**: `@ArlindMaliqi/react-feedback-report-widget`

Both packages contain identical functionality - choose the one that fits your workflow better.

## 🆘 Support

- 📖 [Documentation](https://github.com/ArlindMaliqi/feedback-report/wiki)
- 🐛 [Issue Tracker](https://github.com/ArlindMaliqi/feedback-report/issues)
- 💬 [Discussions](https://github.com/ArlindMaliqi/feedback-report/discussions)
- 📧 [Email Support](mailto:support@example.com)

## 🎯 Roadmap

- [ ] React Native support
- [ ] Advanced analytics dashboard
- [ ] AI-powered feedback categorization
- [ ] Real-time collaboration features

---

Made with ❤️ by [ArlindMaliqi](https://github.com/ArlindMaliqi)
