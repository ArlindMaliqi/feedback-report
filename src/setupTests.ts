import '@testing-library/jest-dom';

// Mock shake.js since it's not available in test environment
jest.mock('shake.js', () => {
  return jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  }));
});

// Mock sonner toast library
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: () => null,
}));

// Setup global test environment
global.console = {
  ...console,
  // Suppress console logs during tests unless needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
