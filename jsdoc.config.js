/**
 * JSDoc configuration for React Feedback Report Widget
 * Generates comprehensive API documentation
 */
module.exports = {
  source: {
    include: [
      './src/',
      './README.md'
    ],
    exclude: [
      './src/**/*.test.ts',
      './src/**/*.test.tsx',
      './src/**/*.stories.ts',
      './src/**/*.stories.tsx',
      './node_modules/'
    ],
    includePattern: '\\.(js|jsx|ts|tsx)$',
    excludePattern: '(test|spec|stories)\\.(js|jsx|ts|tsx)$'
  },
  opts: {
    destination: './docs/api/',
    recurse: true,
    readme: './README.md'
  },
  plugins: [
    'plugins/markdown',
    'jsdoc-plugin-typescript'
  ],
  templates: {
    cleverLinks: false,
    monospaceLinks: false
  },
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure']
  },
  typescript: {
    moduleRoot: './src'
  }
};
