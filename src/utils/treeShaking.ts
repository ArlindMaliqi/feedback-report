// Mark side-effect-free functions for better tree shaking
export const /* #__PURE__ */ createFeedbackPayload = (data: any) => {
  return { ...data, timestamp: Date.now() };
};

export const /* #__PURE__ */ validateFeedback = (feedback: any) => {
  return feedback && typeof feedback.message === 'string';
};

// Use dynamic imports for heavy features
export const loadShakeDetection = () => 
  import('../features/shakeDetection').then(m => m.ShakeDetection);

// Lazy load integrations
export const loadAnalytics = () =>
  import('../integrations').then(m => m.Analytics);

export const loadGitHubIntegration = () =>
  import('../integrations').then(m => m.GitHubIntegration);
