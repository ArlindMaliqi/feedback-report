'use client';

import type { PropsWithChildren } from 'react';
import { OptimizedFeedbackWidget } from '../../components/OptimizedFeedbackWidget';

export default function NextjsFeedbackProvider({
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
      <OptimizedFeedbackWidget
        config={feedbackConfig}
        showButton={true}
        enableShakeDetection={true}
        theme="system"
      />
    </>
  );
}
