'use client';

import React, { lazy, Suspense } from 'react';

// Dynamic import from local components instead of package
const OptimizedFeedbackWidget = lazy(() =>
  import('./OptimizedFeedbackWidget').then(mod => ({
    default: mod.OptimizedFeedbackWidget
  }))
);

interface NextJSFeedbackWrapperProps {
  children?: React.ReactNode;
}

export default function NextJSFeedbackWrapper({ children }: NextJSFeedbackWrapperProps) {
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
