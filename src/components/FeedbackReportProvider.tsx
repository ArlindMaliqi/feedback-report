'use client';

import React, { type PropsWithChildren, lazy, Suspense } from 'react';

// Lazy load the widget to avoid circular dependencies
const OptimizedFeedbackWidget = lazy(() => 
  import('./OptimizedFeedbackWidget').then(mod => ({ 
    default: mod.OptimizedFeedbackWidget 
  }))
);

export default function FeedbackReportProvider({
  children,
}: PropsWithChildren) {
  const feedbackConfig = {
    apiEndpoint: '/api/feedback',
    collectUserAgent: true,
    collectUrl: true,
    enableShakeDetection: true,
    theme: 'system' as const,
    enableOfflineSupport: true,
  };

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <OptimizedFeedbackWidget
          config={feedbackConfig}
          showButton={true}
          enableShakeDetection={true}
          theme="system"
        />
      </Suspense>
    </>
  );
}
