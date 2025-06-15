import React from 'react';

/**
 * Comprehensive error tracking and reporting
 */

export interface ErrorReport {
  message: string;
  stack?: string;
  component?: string;
  userAgent: string;
  url: string;
  timestamp: Date;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorReport[] = [];

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  captureError(error: Error, context?: Partial<ErrorReport>) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date(),
      severity: 'medium',
      ...context
    };

    this.errors.push(report);
    this.sendErrorReport(report);
  }

  private async sendErrorReport(report: ErrorReport) {
    try {
      // Send to your error tracking service
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
    } catch (e) {
      console.error('Failed to send error report:', e);
    }
  }

  getErrorHistory() {
    return this.errors;
  }
}

// React error boundary with enhanced reporting
export class FeedbackErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorTracker.getInstance().captureError(error, {
      component: errorInfo.componentStack?.split('\n')[1]?.trim(),
      severity: 'high'
    });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return React.createElement(FallbackComponent, { error: this.state.error });
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  return React.createElement('div', 
    { style: { padding: '20px', border: '1px solid #ff6b6b', borderRadius: '4px' } },
    React.createElement('h3', null, 'Something went wrong'),
    React.createElement('p', null, 'The feedback widget encountered an error. Please try refreshing the page.'),
    process.env.NODE_ENV === 'development' && error && React.createElement('details',
      { style: { marginTop: '10px' } },
      React.createElement('summary', null, 'Error details'),
      React.createElement('pre', 
        { style: { fontSize: '12px', overflow: 'auto' } },
        error.stack
      )
    )
  );
};
