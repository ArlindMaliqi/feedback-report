# React Feedback Report Widget

[![npm version](https://badge.fury.io/js/react-feedback-report-widget.svg)](https://badge.fury.io/js/react-feedback-report-widget)
[![Release](https://github.com/ArlindMaliqi/feedback-report/actions/workflows/release.yml/badge.svg)](https://github.com/ArlindMaliqi/feedback-report/actions/workflows/release.yml)
[![GitHub Package Registry](https://img.shields.io/badge/GitHub%20Package%20Registry-published-blue)](https://github.com/ArlindMaliqi/feedback-report/packages)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-feedback-report-widget)](https://bundlephobia.com/package/react-feedback-report-widget)

## Overview

A comprehensive, TypeScript-first feedback collection system for React applications. This widget provides an enterprise-grade solution for collecting user feedback with extensive customization options, powerful integrations, and professional developer experience.

**Choose Your Implementation:**
- 🚀 **FeedbackWidget** - Simple, full-featured implementation
- ⚡ **OptimizedFeedbackWidget** - Performance-optimized with lazy loading
- 🎯 **MinimalFeedbackWidget** - Ultra-lightweight for bundle-conscious apps

## ✨ Key Features

### 🎨 User Interface & Experience
- **Multiple Themes**: Built-in dark/light mode with automatic system preference detection
- **Accessibility First**: WCAG 2.1 compliant with full keyboard navigation and screen reader support
- **Smooth Animations**: Configurable entrance/exit animations with performance optimization
- **Custom Templates**: Pre-defined forms for bug reports, feature requests, and general feedback
- **Responsive Design**: Mobile-first design that works across all devices
- **Flexible Positioning**: Customizable button placement (4 corner positions)

### 🚀 Core Functionality
- **Shake Detection**: Device shake to trigger feedback modal
- **File Attachments**: Support for screenshots and document uploads (configurable size limits)
- **User Identity**: Optional user identification with privacy controls
- **Smart Categories**: Hierarchical categorization system with subcategories
- **Offline Support**: Local storage with automatic sync when online
- **Feedback Voting**: Community-driven feedback prioritization
- **Form Validation**: Client-side validation with customizable rules

### 🔌 Powerful Integrations
- **Analytics**: Google Analytics, Segment, Mixpanel, and custom providers
- **Issue Trackers**: GitHub Issues, Jira, GitLab, Azure DevOps integration
- **Webhooks**: Custom endpoint integration with payload signing
- **Communications**: Slack, Microsoft Teams, Discord notifications
- **Email**: SMTP configuration for email notifications
- **Localization**: Full i18n support with RTL language compatibility

### 👨‍💻 Developer Experience
- **TypeScript First**: Complete type safety and IntelliSense support
- **Testing Utilities**: Comprehensive test helpers and framework integration
- **Multiple Bundle Sizes**: Choose between full-featured, optimized, or minimal builds
- **Framework Examples**: Next.js, Gatsby, Remix implementation guides
- **Performance Optimized**: Bundle splitting, lazy loading, and SSR support
- **Zero Dependencies**: Core functionality requires no external dependencies

## 📦 Installation

### From NPM Registry

To install the React Feedback Report Widget from NPM, run the following command:

```bash
npm install react-feedback-report-widget
```

### Peer Dependencies

The widget requires React 16.8+ (hooks support):

```bash
npm install react@^16.8.0 react-dom@^16.8.0
```

### Optional Dependencies

For enhanced toast notifications, you can optionally install:

```bash
npm install sonner
```

## 🚀 Quick Start

### Simple Implementation

The fastest way to get started:

```tsx
import React from "react";
import { FeedbackWidget } from "react-feedback-report-widget";

const App = () => {
  return (
    <>
      <YourMainComponent />
      <FeedbackWidget 
        config={{
          apiEndpoint: "/api/feedback",
          theme: "system"
        }}
      />
    </>
  );
};

export default App;
```

### Modular Implementation

For more control over the components:

```tsx
import React from "react";
import { 
  FeedbackProvider, 
  FeedbackButton, 
  FeedbackModal, 
  useFeedback 
} from "react-feedback-report-widget";

const CustomFeedbackTrigger = () => {
  const { openModal } = useFeedback();
  
  return (
    <button onClick={openModal} className="my-custom-button">
      💬 Share Feedback
    </button>
  );
};

const App = () => {
  return (
    <FeedbackProvider
      config={{
        apiEndpoint: "/api/feedback",
        enableShakeDetection: true,
        theme: "system",
        collectEmail: true,
        enableFileAttachments: true
      }}
    >
      <YourMainComponent />
      <CustomFeedbackTrigger />
      <FeedbackModal />
    </FeedbackProvider>
  );
};
```

## 🎯 Component Variants

### 1. FeedbackWidget (Recommended)

**Best for:** Most applications requiring full features with good performance

```tsx
import { FeedbackWidget } from "react-feedback-report-widget";

<FeedbackWidget 
  config={{
    apiEndpoint: "/api/feedback",
    enableShakeDetection: true,
    enableOfflineSupport: true,
    enableVoting: true,
    collectUserIdentity: true,
    enableFileAttachments: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    defaultTemplate: "bug-report",
    categories: [
      {
        id: "bug",
        name: "Bug Report",
        icon: "🐛",
        subcategories: [
          { id: "ui", name: "User Interface" },
          { id: "performance", name: "Performance" }
        ]
      }
    ]
  }}
/>
```

### 2. OptimizedFeedbackWidget

**Best for:** Performance-critical applications, large bundles, SSR applications

```tsx
import { OptimizedFeedbackWidget } from "react-feedback-report-widget";

<OptimizedFeedbackWidget
  config={{
    apiEndpoint: "/api/feedback",
    enableOfflineSupport: true
  }}
  theme="dark"
  showButton={true}
  enableShakeDetection={true}
  showOfflineIndicator={true}
  loadingFallback={<div>Loading feedback...</div>}
  errorFallback={({ error, resetError }) => (
    <div>
      <p>Failed to load: {error.message}</p>
      <button onClick={resetError}>Retry</button>
    </div>
  )}
/>
```

**Features:**
- ⚡ Lazy loading of all components
- 📦 Code splitting for optimal bundle size
- 🛡️ Error boundaries with fallback UI
- 🔄 SSR compatibility
- 📊 Loading states

### 3. MinimalFeedbackWidget

**Best for:** Bundle-size conscious applications, simple feedback collection

```tsx
import { MinimalFeedbackWidget } from "react-feedback-report-widget";

<MinimalFeedbackWidget
  apiEndpoint="/api/feedback"
  position="bottom-right"
  theme="system"
  onSubmit={async (feedback) => {
    console.log('Feedback received:', feedback);
    // Handle submission
  }}
/>
```

**Bundle Size:** ~3KB gzipped (vs ~15KB for full widget)

## 🔧 Framework Integration

### Next.js Implementation

**App Router (Recommended):**

```tsx
// app/layout.tsx
import { FeedbackWidget } from "react-feedback-report-widget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <FeedbackWidget
          config={{
            apiEndpoint: "/api/feedback",
            theme: "system",
            enableShakeDetection: true,
            analytics: {
              provider: "google-analytics",
              trackingId: process.env.NEXT_PUBLIC_GA_ID
            }
          }}
        />
      </body>
    </html>
  );
}

// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const feedback = await request.json();
    
    // Process feedback (save to database, send notifications, etc.)
    console.log("Feedback received:", feedback);
    
    // Optional: Create GitHub issue
    if (feedback.type === "bug") {
      // Create GitHub issue logic
    }
    
    return NextResponse.json({ 
      success: true, 
      id: `feedback-${Date.now()}` 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process feedback" },
      { status: 500 }
    );
  }
}
```

**Pages Router:**

```tsx
// pages/_app.tsx
import type { AppProps } from "next/app";
import { OptimizedFeedbackWidget } from "react-feedback-report-widget";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <OptimizedFeedbackWidget
        config={{
          apiEndpoint: "/api/feedback",
          enableOfflineSupport: true,
          issueTracker: {
            provider: "github",
            apiToken: process.env.GITHUB_TOKEN,
            owner: "your-org",
            repository: "your-repo"
          }
        }}
      />
    </>
  );
}

// pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const feedback = req.body;
    
    // Process feedback
    console.log("Feedback received:", feedback);
    
    res.status(200).json({ success: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### Gatsby Implementation

```tsx
// src/components/layout.tsx
import React from "react";
import { FeedbackWidget } from "react-feedback-report-widget";

const Layout = ({ children }) => {
  return (
    <>
      <main>{children}</main>
      <FeedbackWidget
        config={{
          apiEndpoint: "/.netlify/functions/feedback",
          enableShakeDetection: true,
          localization: {
            locale: "en",
            customTranslations: {
              "feedback.title": "Help us improve!"
            }
          }
        }}
      />
    </>
  );
};

export default Layout;

// netlify/functions/feedback.js
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const feedback = JSON.parse(event.body);
  
  // Process feedback
  console.log("Feedback received:", feedback);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
```

### Remix Implementation

```tsx
// app/root.tsx
import { OptimizedFeedbackWidget } from "react-feedback-report-widget";

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <OptimizedFeedbackWidget
          config={{
            apiEndpoint: "/api/feedback",
            enableOfflineSupport: true
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// app/routes/api.feedback.tsx
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }

  const feedback = await request.json();
  
  // Process feedback
  console.log("Feedback received:", feedback);
  
  return Response.json({ success: true });
};
```

### Vite + React Implementation

```tsx
// src/App.tsx
import { FeedbackWidget } from "react-feedback-report-widget";

function App() {
  return (
    <>
      <YourMainComponent />
      <FeedbackWidget
        config={{
          apiEndpoint: import.meta.env.VITE_FEEDBACK_API,
          theme: "system",
          enableShakeDetection: true
        }}
      />
    </>
  );
}

export default App;

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  }
});
```

## 📋 Advanced Configuration

### Complete Configuration Example

```tsx
const advancedConfig = {
  // Core API
  apiEndpoint: "/api/feedback",
  
  // User Experience
  enableShakeDetection: true,
  enableOfflineSupport: true,
  enableVoting: true,
  enableFileAttachments: true,
  collectUserIdentity: true,
  collectUserAgent: true,
  collectUrl: true,
  collectEmail: true,
  rememberUserIdentity: true,
  
  // File Upload Configuration
  maxAttachments: 5,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedAttachmentTypes: [
    "image/png", "image/jpeg", "image/gif", "image/webp",
    "application/pdf", "text/plain", "text/csv"
  ],
  
  // Templates and Categories
  defaultTemplate: "bug-report",
  templates: [
    {
      id: "custom-template",
      name: "Custom Feedback",
      fields: [
        {
          id: "title",
          type: "text",
          label: "Title",
          required: true,
          validation: { minLength: 5, maxLength: 100 }
        },
        {
          id: "description",
          type: "textarea",
          label: "Description",
          required: true,
          helpText: "Please provide detailed information"
        },
        {
          id: "urgency",
          type: "select",
          label: "Urgency",
          options: [
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
            { value: "critical", label: "Critical" }
          ],
          defaultValue: "medium"
        }
      ]
    }
  ],
  
  categories: [
    {
      id: "product",
      name: "Product Feedback",
      description: "Feedback about our products",
      icon: "📦",
      color: "#3B82F6",
      subcategories: [
        { id: "quality", name: "Quality Issues" },
        { id: "features", name: "Feature Requests" },
        { id: "pricing", name: "Pricing Feedback" }
      ]
    },
    {
      id: "service",
      name: "Customer Service",
      description: "Feedback about our service",
      icon: "🎧",
      color: "#10B981",
      subcategories: [
        { id: "response-time", name: "Response Time" },
        { id: "helpfulness", name: "Helpfulness" }
      ]
    }
  ],
  
  // Theme and Appearance
  theme: {
    mode: "system",
    primaryColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    borderColor: "#E5E7EB"
  },
  
  // Animation Configuration
  animation: {
    enter: "fadeIn",
    exit: "fadeOut",
    duration: 300,
    easing: "ease-in-out"
  },
  
  // Analytics Integration
  analytics: {
    provider: "google-analytics",
    trackingId: process.env.NEXT_PUBLIC_GA_ID,
    trackEvents: true,
    eventName: "feedback_submitted",
    customEvents: {
      "feedback_opened": "user_opened_feedback_modal",
      "feedback_closed": "user_closed_feedback_modal"
    }
  },
  
  // Issue Tracker Integration
  issueTracker: {
    provider: "github",
    apiToken: process.env.GITHUB_TOKEN,
    owner: "your-username",
    repository: "your-repo",
    labels: ["user-feedback", "triage"],
    assignee: "maintainer",
    
    // Custom issue template
    issueTemplate: (feedback) => ({
      title: `[Feedback] ${feedback.message.substring(0, 50)}...`,
      body: `
## Feedback Details

**Type:** ${feedback.type}
**Priority:** ${feedback.priority || 'medium'}
**Submitted:** ${feedback.timestamp}

## Description

${feedback.message}

## User Environment

- **URL:** ${feedback.url}
- **User Agent:** ${feedback.userAgent}
- **User ID:** ${feedback.user?.id || 'Anonymous'}

## Additional Data

\`\`\`json
${JSON.stringify(feedback.metadata, null, 2)}
\`\`\`
      `,
      labels: feedback.type === 'bug' ? ['bug', 'user-reported'] : ['enhancement', 'user-requested']
    })
  },
  
  // Notifications
  notifications: {
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: "#feedback",
      mentions: ["@dev-team"],
      
      // Custom message format
      messageTemplate: (feedback) => ({
        text: `New ${feedback.type} feedback received`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*New ${feedback.type} feedback:*\n${feedback.message}`
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Priority: ${feedback.priority} | User: ${feedback.user?.email || 'Anonymous'}`
              }
            ]
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "View Details" },
                url: `https://yourapp.com/admin/feedback/${feedback.id}`
              }
            ]
          }
        ]
      })
    }
  },
  
  // Webhooks
  webhooks: [
    {
      url: "https://your-webhook-endpoint.com/feedback",
      events: ["feedback.created", "feedback.updated"],
      headers: {
        "Authorization": `Bearer ${process.env.WEBHOOK_SECRET}`
      }
    }
  ],
  
  // Localization
  localization: {
    locale: "en",
    fallbackLocale: "en",
    customTranslations: {
      "en": {
        "feedback.title": "Send us your feedback",
        "feedback.success": "Thank you for your feedback!",
        "feedback.error": "Failed to send feedback. Please try again."
      },
      "es": {
        "feedback.title": "Envíanos tus comentarios",
        "feedback.success": "¡Gracias por tus comentarios!",
        "feedback.error": "Error al enviar comentarios. Inténtalo de nuevo."
      }
    }
  },
  
  // Privacy and Security
  privacyPolicyUrl: "/privacy",
  dataRetentionDays: 365,
  anonymizeData: false,
  
  // Event Callbacks
  onSuccess: (feedback) => {
    console.log("Feedback submitted:", feedback);
    // Custom success handling
  },
  
  onError: (error) => {
    console.error("Feedback error:", error);
    // Custom error handling
  },
  
  onOpen: () => {
    console.log("Feedback modal opened");
    // Track modal open
  },
  
  onClose: () => {
    console.log("Feedback modal closed");
    // Track modal close
  }
};
```

### Template System

#### Built-in Templates

```tsx
// Available templates
const templates = [
  "default",        // General feedback
  "bug-report",     // Bug reporting with technical fields
  "feature-request", // Feature requests with use cases
  "general"         // General feedback with ratings
];

// Using specific templates
<FeedbackWidget 
  config={{ 
    defaultTemplate: "bug-report",
    // Users can still switch templates in the modal
  }} 
/>
```

#### Custom Templates

```tsx
const customTemplate = {
  id: "support-request",
  name: "Support Request",
  description: "Get help with technical issues",
  fields: [
    {
      id: "issue-type",
      type: "select",
      label: "Issue Type",
      required: true,
      options: [
        { value: "login", label: "Login Problems" },
        { value: "billing", label: "Billing Issues" },
        { value: "technical", label: "Technical Support" },
        { value: "other", label: "Other" }
      ]
    },
    {
      id: "description",
      type: "textarea",
      label: "Describe your issue",
      required: true,
      placeholder: "Please provide as much detail as possible...",
      helpText: "Include error messages, steps you've tried, etc."
    },
    {
      id: "urgency",
      type: "select",
      label: "How urgent is this?",
      options: [
        { value: "low", label: "Low - Can wait a few days" },
        { value: "medium", label: "Medium - Needed this week" },
        { value: "high", label: "High - Needed today" },
        { value: "critical", label: "Critical - Service down" }
      ],
      defaultValue: "medium"
    },
    {
      id: "contact-me",
      type: "checkbox",
      label: "I would like to be contacted about this issue"
    },
    {
      id: "email",
      type: "email",
      label: "Contact Email",
      placeholder: "your@email.com",
      helpText: "We'll only use this to contact you about this specific issue"
    }
  ]
};

<FeedbackWidget 
  config={{
    templates: [customTemplate],
    defaultTemplate: "support-request"
  }}
/>
```

## 🎣 Advanced Hooks

### useFeedback Hook

```tsx
import { useFeedback } from "react-feedback-report-widget";

const CustomComponent = () => {
  const {
    // State
    isOpen,
    isSubmitting,
    error,
    feedbacks,
    pendingCount,
    
    // Actions
    openModal,
    closeModal,
    submitFeedback,
    voteFeedback,
    
    // Data management
    clearFeedback,
    getFeedbackById,
    updateFeedback,
    syncPendingFeedback,
    
    // Configuration
    config,
    categories
  } = useFeedback();

  const handleCustomSubmit = async () => {
    await submitFeedback({
      message: "Custom feedback",
      type: "feature",
      category: "enhancement",
      metadata: { source: "custom-component" }
    });
  };

  return (
    <div>
      <button onClick={openModal}>Open Feedback</button>
      <button onClick={handleCustomSubmit} disabled={isSubmitting}>
        Submit Custom Feedback
      </button>
      
      {pendingCount > 0 && (
        <div>
          {pendingCount} pending feedback items
          <button onClick={syncPendingFeedback}>Sync Now</button>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
    </div>
  );
};
```

### Custom Feedback Dashboard

```tsx
import { useFeedback } from "react-feedback-report-widget";

const FeedbackDashboard = () => {
  const { feedbacks, voteFeedback, updateFeedback } = useFeedback();

  const handleStatusChange = (id: string, status: string) => {
    updateFeedback(id, { status });
  };

  return (
    <div className="feedback-dashboard">
      <h2>Feedback Dashboard</h2>
      
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="feedback-item">
          <div className="feedback-header">
            <h3>{feedback.message}</h3>
            <span className={`status ${feedback.status}`}>
              {feedback.status}
            </span>
          </div>
          
          <div className="feedback-meta">
            <span>Type: {feedback.type}</span>
            <span>Priority: {feedback.priority}</span>
            <span>Votes: {feedback.votes || 0}</span>
          </div>
          
          <div className="feedback-actions">
            <button 
              onClick={() => voteFeedback(feedback.id, "up")}
              className="vote-up"
            >
              👍 Upvote
            </button>
            
            <select 
              value={feedback.status}
              onChange={(e) => handleStatusChange(feedback.id, e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          {feedback.attachments && feedback.attachments.length > 0 && (
            <div className="attachments">
              <h4>Attachments:</h4>
              {feedback.attachments.map((attachment, index) => (
                <div key={index} className="attachment">
                  {attachment.name} ({Math.round(attachment.size / 1024)}KB)
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

## 🧪 Testing

### Test Utilities

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { 
  createMockFeedbackProvider, 
  createMockFeedback,
  testUtils 
} from "react-feedback-report-widget/testing";
import YourComponent from "./YourComponent";

describe("YourComponent", () => {
  it("should handle feedback submission", async () => {
    const mockSubmit = testUtils.createMockFunction();
    mockSubmit.mockResolvedValue({ success: true });
    
    render(
      <createMockFeedbackProvider 
        config={{ apiEndpoint: "/test" }}
        mockSubmissions={[{ success: true }]}
      >
        <YourComponent />
      </createMockFeedbackProvider>
    );
    
    // Test your component
    const feedbackButton = screen.getByText("Feedback");
    fireEvent.click(feedbackButton);
    
    // Assert feedback modal opened
    expect(screen.getByText("Send Feedback")).toBeInTheDocument();
  });

  it("should create mock feedback data", () => {
    const mockFeedback = createMockFeedback({
      type: "bug",
      message: "Test bug report",
      priority: "high"
    });
    
    expect(mockFeedback.type).toBe("bug");
    expect(mockFeedback.message).toBe("Test bug report");
    expect(mockFeedback.priority).toBe("high");
  });
});
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapping: {
    "^react-feedback-report-widget/testing$": 
      "<rootDir>/node_modules/react-feedback-report-widget/dist/testing"
  }
};

// src/setupTests.ts
import "@testing-library/jest-dom";
```

## 🌍 Internationalization

### Dynamic Locale Switching

```tsx
import { useState } from "react";
import { FeedbackWidget } from "react-feedback-report-widget";

const MultilingualApp = () => {
  const [currentLocale, setCurrentLocale] = useState("en");
  
  const config = {
    apiEndpoint: "/api/feedback",
    localization: {
      locale: currentLocale,
      fallbackLocale: "en",
      rtl: ["ar", "he"].includes(currentLocale),
      customTranslations: {
        en: {
          "feedback.title": "Send us your feedback",
          "feedback.submit": "Submit Feedback",
          "feedback.placeholder": "Tell us what you think..."
        },
        es: {
          "feedback.title": "Envíanos tus comentarios",
          "feedback.submit": "Enviar comentarios",
          "feedback.placeholder": "Dinos qué piensas..."
        },
        fr: {
          "feedback.title": "Envoyez-nous vos commentaires",
          "feedback.submit": "Soumettre des commentaires",
          "feedback.placeholder": "Dites-nous ce que vous pensez..."
        }
      }
    }
  };

  return (
    <div>
      <div className="language-selector">
        <select 
          value={currentLocale} 
          onChange={(e) => setCurrentLocale(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ar">العربية</option>
        </select>
      </div>
      
      <FeedbackWidget config={config} />
    </div>
  );
};
```

### Complete Translation Keys

```typescript
const translationKeys = {
  // Modal
  "feedback.title": "Feedback",
  "feedback.submit": "Submit",
  "feedback.cancel": "Cancel",
  "feedback.close": "Close",
  
  // Form
  "feedback.placeholder": "Tell us what you think...",
  "feedback.message.label": "Your Message",
  "feedback.type.label": "Feedback Type",
  "feedback.category.label": "Category",
  "feedback.priority.label": "Priority",
  "feedback.email.label": "Email (Optional)",
  
  // Validation
  "validation.messageRequired": "Message is required",
  "validation.emailInvalid": "Please enter a valid email",
  "validation.tooLong": "Message is too long",
  
  // Notifications
  "notification.success": "Thank you for your feedback!",
  "notification.error": "Failed to submit feedback",
  "notification.offline": "You are offline",
  "notification.syncing": "Syncing feedback...",
  
  // Status
  "status.sending": "Sending...",
  "status.offline": "Offline",
  "status.pending": "Pending sync",
  
  // Attachments
  "attachments.label": "Attachments",
  "attachments.add": "Add files",
  "attachments.remove": "Remove",
  "attachments.maxSize": "Maximum file size: {maxSize}MB",
  "attachments.maxCount": "Maximum {maxCount} files"
};
```

## 📊 Performance & Bundle Analysis

### Bundle Size Comparison

| Component | Gzipped Size | Features |
|-----------|-------------|----------|
| **MinimalFeedbackWidget** | ~3KB | Basic feedback, simple form |
| **FeedbackWidget** | ~8KB | Full features, optimized |
| **OptimizedFeedbackWidget** | ~5KB initial + lazy chunks | All features, code splitting |

### Performance Optimization

```tsx
// Preload critical components
import { preloadCriticalComponents } from "react-feedback-report-widget";

// Call this early in your app lifecycle
preloadCriticalComponents();

// Or preload on user interaction
const handleMouseEnter = () => {
  import("react-feedback-report-widget/advanced");
};

<div onMouseEnter={handleMouseEnter}>
  <YourApp />
</div>
```

### Bundle Analysis

```bash
# Analyze your bundle
npx webpack-bundle-analyzer dist/static/js/*.js

# Or with Vite
npx vite-bundle-analyzer dist/assets
```

## 🔒 Security & Privacy

### Privacy-First Configuration

```tsx
const privacyConfig = {
  // Data Collection Controls
  collectUserAgent: false,    // Don't collect browser info
  collectUrl: false,         // Don't collect current URL
  collectUserIdentity: false, // Don't collect user info
  anonymizeData: true,       // Anonymize collected data
  
  // Data Retention
  dataRetentionDays: 30,     // Auto-delete after 30 days
  
  // Privacy Policy
  privacyPolicyUrl: "/privacy",
  
  // Secure transmission
  apiEndpoint: "https://secure-api.yourapp.com/feedback",
  
  // Local storage encryption (if offline support enabled)
  encryptOfflineData: true
};

<FeedbackWidget config={privacyConfig} />
```

### Content Security Policy (CSP)

Add these directives to your CSP header:

```
Content-Security-Policy: 
  script-src 'self' 'unsafe-inline';
  connect-src 'self' your-api-domain.com;
  img-src 'self' data: blob:;
```

## 🚀 Production Deployment

### Environment Configuration

```bash
# .env.production
NEXT_PUBLIC_FEEDBACK_API=https://api.yourapp.com/feedback
GITHUB_TOKEN=your_github_token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
WEBHOOK_SECRET=your_webhook_secret
```

### API Endpoint Implementation

```typescript
// Example Express.js endpoint
import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express();

app.post('/api/feedback', [
  body('message').isLength({ min: 1 }).escape(),
  body('type').isIn(['bug', 'feature', 'improvement', 'other']),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const feedback = req.body;
  
  try {
    // Save to database
    const savedFeedback = await saveFeedback(feedback);
    
    // Send notifications
    await sendNotifications(savedFeedback);
    
    // Create issue if needed
    if (feedback.type === 'bug') {
      await createGitHubIssue(savedFeedback);
    }
    
    res.json({ success: true, id: savedFeedback.id });
  } catch (error) {
    console.error('Feedback processing error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
```

## 📚 API Reference

### FeedbackConfig Interface

```typescript
interface FeedbackConfig {
  // Core Settings
  apiEndpoint?: string;
  enableShakeDetection?: boolean;
  enableOfflineSupport?: boolean;
  enableVoting?: boolean;
  disableNetworkRequests?: boolean;
  
  // Data Collection
  collectUserIdentity?: boolean;
  collectUserAgent?: boolean;
  collectUrl?: boolean;
  collectEmail?: boolean;
  rememberUserIdentity?: boolean;
  
  // File Uploads
  enableFileAttachments?: boolean;
  maxFileSize?: number; // in bytes
  maxAttachments?: number;
  allowedAttachmentTypes?: string[];
  
  // UI/UX
  theme?: ThemePreference | ThemeConfig;
  animation?: AnimationConfig;
  defaultTemplate?: string;
  
  // Data Organization
  categories?: Category[];
  templates?: TemplateConfig[];
  
  // Integrations
  analytics?: AnalyticsConfig;
  issueTracker?: IssueTrackerConfig;
  webhooks?: WebhookConfig[];
  notifications?: NotificationConfig;
  
  // Localization
  localization?: LocalizationConfig;
  
  // Privacy & Security
  privacyPolicyUrl?: string;
  dataRetentionDays?: number;
  anonymizeData?: boolean;
  
  // Event Handlers
  onSuccess?: (feedback: Feedback) => void;
  onError?: (error: Error) => void;
  onOpen?: () => void;
  onClose?: () => void;
}
```

### Component Props

```typescript
// FeedbackWidget Props
interface FeedbackWidgetProps {
  config: FeedbackConfig;
  children?: React.ReactNode;
}

// OptimizedFeedbackWidget Props
interface OptimizedFeedbackWidgetProps {
  config?: FeedbackConfig;
  theme?: ThemePreference;
  showButton?: boolean;
  enableShakeDetection?: boolean;
  buttonProps?: FeedbackButtonProps;
  modalStyles?: FeedbackModalStyles;
  animation?: AnimationConfig;
  template?: TemplateConfig;
  showOfflineIndicator?: boolean;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{error: Error; resetError: () => void}>;
}

// MinimalFeedbackWidget Props
interface MinimalFeedbackWidgetProps {
  apiEndpoint?: string;
  onSubmit?: (feedback: any) => Promise<void>;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: ThemePreference;
  enableShakeDetection?: boolean;
  config?: FeedbackConfig;
}
```

## 🛠️ Development & Contributing

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ArlindMaliqi/feedback-report.git
cd feedback-report

# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run typecheck

# Build for production
npm run build

# Run tests
npm test

# Start Storybook
npm run storybook
```

### Project Structure

```
src/
├── components/          # React components
│   ├── FeedbackWidget.tsx
│   ├── OptimizedFeedbackWidget.tsx
│   ├── MinimalFeedbackWidget.tsx
│   ├── FeedbackProvider.tsx
│   ├── FeedbackButton.tsx
│   └── FeedbackModal.tsx
├── hooks/              # Custom hooks
│   ├── useFeedback.ts
│   └── useTheme.ts
├── contexts/           # React contexts
├── utils/              # Utility functions
├── types/              # TypeScript definitions
├── templates/          # Built-in templates
├── integrations/       # Third-party integrations
├── testing/           # Test utilities
└── examples/          # Framework examples
```

### Contributing Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes with tests**
4. **Run the test suite**: `npm test`
5. **Run type checking**: `npm run typecheck`
6. **Create a pull request**

### Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 🔗 Integration Examples

### GitHub Issues Integration

```typescript
const config = {
  issueTracker: {
    provider: "github",
    apiToken: process.env.GITHUB_TOKEN,
    owner: "your-org",
    repository: "your-repo",
    labels: ["user-feedback", "triage"],
    assignee: "maintainer",
    
    // Custom issue template
    issueTemplate: (feedback) => ({
      title: `[Feedback] ${feedback.message.substring(0, 50)}...`,
      body: `
## Feedback Details

**Type:** ${feedback.type}
**Priority:** ${feedback.priority || 'medium'}
**Submitted:** ${feedback.timestamp}

## Description

${feedback.message}

## User Environment

- **URL:** ${feedback.url}
- **User Agent:** ${feedback.userAgent}
- **User ID:** ${feedback.user?.id || 'Anonymous'}

## Additional Data

\`\`\`json
${JSON.stringify(feedback.metadata, null, 2)}
\`\`\`
      `,
      labels: feedback.type === 'bug' ? ['bug', 'user-reported'] : ['enhancement', 'user-requested']
    })
  }
};
```

### Slack Integration

```typescript
const config = {
  notifications: {
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: "#feedback",
      mentions: ["@dev-team"],
      
      // Custom message format
      messageTemplate: (feedback) => ({
        text: `New ${feedback.type} feedback received`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*New ${feedback.type} feedback:*\n${feedback.message}`
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Priority: ${feedback.priority} | User: ${feedback.user?.email || 'Anonymous'}`
              }
            ]
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "View Details" },
                url: `https://yourapp.com/admin/feedback/${feedback.id}`
              }
            ]
          }
        ]
      })
    }
  },
  
  // Webhooks
  webhooks: [
    {
      url: "https://your-webhook-endpoint.com/feedback",
      events: ["feedback.created", "feedback.updated"],
      headers: {
        "Authorization": `Bearer ${process.env.WEBHOOK_SECRET}`
      }
    }
  ],
  
  // Localization
  localization: {
    locale: "en",
    fallbackLocale: "en",
    customTranslations: {
      "en": {
        "feedback.title": "Send us your feedback",
        "feedback.success": "Thank you for your feedback!",
        "feedback.error": "Failed to send feedback. Please try again."
      },
      "es": {
        "feedback.title": "Envíanos tus comentarios",
        "feedback.success": "¡Gracias por tus comentarios!",
        "feedback.error": "Error al enviar comentarios. Inténtalo de nuevo."
      }
    }
  },
  
  // Privacy and Security
  privacyPolicyUrl: "/privacy",
  dataRetentionDays: 365,
  anonymizeData: false,
  
  // Event Callbacks
  onSuccess: (feedback) => {
    console.log("Feedback submitted:", feedback);
    // Custom success handling
  },
  
  onError: (error) => {
    console.error("Feedback error:", error);
    // Custom error handling
  },
  
  onOpen: () => {
    console.log("Feedback modal opened");
    // Track modal open
  },
  
  onClose: () => {
    console.log("Feedback modal closed");
    // Track modal close
  }
};
```

## 📋 Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| iOS Safari | 14+ | Touch gestures supported |
| Chrome Mobile | 90+ | Shake detection supported |

### Polyfills

For older browser support, include these polyfills:

```bash
npm install core-js regenerator-runtime
```

```javascript
// In your app entry point
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

## 🎯 Roadmap

### Current Version (2.2.0)
- ✅ Complete TypeScript rewrite
- ✅ Three widget variants (Simple, Optimized, Minimal)
- ✅ Advanced template system
- ✅ Comprehensive integrations
- ✅ Performance optimizations

### Next Version (2.3.0)
- 🔄 React Native support
- 🔄 Advanced analytics dashboard
- 🔄 AI-powered feedback categorization
- 🔄 Real-time collaboration features
- 🔄 Enhanced accessibility features

### Future Versions
- 📋 Vue.js and Angular adaptors
- 📋 Advanced reporting and insights
- 📋 Workflow automation
- 📋 Advanced security features

## 🆘 Support & Resources

- 📖 **Documentation**: [Full documentation](https://github.com/ArlindMaliqi/feedback-report/wiki)
- 🐛 **Issues**: [Bug reports and feature requests](https://github.com/ArlindMaliqi/feedback-report/issues)
- 💬 **Discussions**: [Community discussions](https://github.com/ArlindMaliqi/feedback-report/discussions)
- 📧 **Email**: [contact@feedbackwidget.dev](mailto:contact@feedbackwidget.dev)
- 🗨️ **Discord**: [Join our community](https://discord.gg/feedbackwidget)

### Community Examples

- [Next.js App Router Example](https://github.com/ArlindMaliqi/feedback-report/tree/main/examples/nextjs-app)
- [Gatsby Blog Integration](https://github.com/ArlindMaliqi/feedback-report/tree/main/examples/gatsby-blog)
- [Remix SaaS App](https://github.com/ArlindMaliqi/feedback-report/tree/main/examples/remix-saas)
- [Vite React App](https://github.com/ArlindMaliqi/feedback-report/tree/main/examples/vite-react)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏷️ Package Availability

This package is available on both:

- **NPM Registry**: `npm install react-feedback-report-widget`
- **GitHub Packages**: `npm install @ArlindMaliqi/react-feedback-report-widget`

Both packages contain identical functionality.

---

**Made with ❤️ by [ArlindMaliqi](https://github.com/ArlindMaliqi)**

*If this package helps your project, please consider giving it a ⭐ on GitHub!*
