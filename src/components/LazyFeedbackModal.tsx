import React, { lazy, Suspense } from 'react';
import type { FeedbackModalProps } from './FeedbackModal';

// Lazy load the heavy modal component
const FeedbackModal = lazy(() => import('./FeedbackModal'));

// Lightweight loading component
const ModalSkeleton: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-end space-x-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

export const LazyFeedbackModal: React.FC<FeedbackModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <Suspense fallback={<ModalSkeleton />}>
      <FeedbackModal {...props} />
    </Suspense>
  );
};

export default LazyFeedbackModal;
