'use client';

import type { PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues and module resolution problems
const OptimizedFeedbackWidget = dynamic(
	() => import('react-feedback-report-widget').then(mod => ({ 
		default: mod.OptimizedFeedbackWidget 
	})),
	{
		ssr: false,
		loading: () => null,
	}
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
			<OptimizedFeedbackWidget
				config={feedbackConfig}
				showButton={true}
				enableShakeDetection={true}
				theme="system"
			/>
		</>
	);
}
