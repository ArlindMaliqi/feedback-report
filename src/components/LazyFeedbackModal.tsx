import React, { Suspense } from 'react';

// Simple lazy component wrapper without dynamic imports for now
const FeedbackModal = React.lazy(() => 
  Promise.resolve({ default: () => <div>Modal Placeholder</div> })
);

export const LazyFeedbackModal: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbackModal />
    </Suspense>
  );
};

export default LazyFeedbackModal;
