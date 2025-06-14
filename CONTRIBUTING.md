# Contributing to React Feedback Report Widget

Thank you for your interest in contributing to the React Feedback Report Widget! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## 🤝 Code of Conduct

This project adheres to a Code of Conduct that we expect all contributors to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and encourage diverse perspectives
- **Be collaborative**: Work together and help each other succeed
- **Be constructive**: Provide helpful feedback and suggestions

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** (>= 16.0.0)
- **npm** (>= 7.0.0)
- **Git** for version control
- A **GitHub account**

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/feedback-report.git
   cd feedback-report
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the development environment**
   ```bash
   # Create a new branch for your feature
   git checkout -b feature/your-feature-name
   
   # Start development mode
   npm run dev
   ```

4. **Verify your setup**
   ```bash
   # Run tests
   npm test
   
   # Type checking
   npm run typecheck
   
   # Linting
   npm run lint
   ```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- **🐛 Bug Reports**: Help us identify and fix issues
- **✨ Feature Requests**: Suggest new functionality
- **🔧 Bug Fixes**: Submit fixes for known issues
- **⚡ Performance Improvements**: Optimize existing code
- **📚 Documentation**: Improve or add documentation
- **🧪 Tests**: Add or improve test coverage
- **🎨 UI/UX Improvements**: Enhance the user experience

### Contribution Workflow

1. **Search existing issues** before creating new ones
2. **Discuss major changes** in an issue before implementing
3. **Keep changes focused** - one feature/fix per PR
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Follow coding standards** outlined below

## 🔄 Pull Request Process

### Before Submitting

- [ ] Ensure all tests pass: `npm test`
- [ ] Verify type checking: `npm run typecheck`
- [ ] Run linting: `npm run lint`
- [ ] Update documentation if needed
- [ ] Add tests for new functionality
- [ ] Verify bundle size impact: `npm run analyze`

### PR Guidelines

1. **Use descriptive titles** following conventional commits:
   ```
   feat: add dark mode support
   fix: resolve memory leak in performance monitor
   docs: update installation instructions
   ```

2. **Provide detailed descriptions**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   ```

3. **Link related issues**:
   ```markdown
   Closes #123
   Fixes #456
   ```

### Review Process

1. **Automated checks** must pass (tests, linting, type checking)
2. **Code review** by maintainers
3. **Manual testing** if applicable
4. **Approval** and merge by maintainers

## 🐛 Issue Guidelines

### Bug Reports

When reporting bugs, please include:

```markdown
**Bug Description**
A clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 95]
- Node.js: [e.g., 16.14.0]
- Package Version: [e.g., 1.5.0]

**Additional Context**
Screenshots, code samples, etc.
```

### Feature Requests

For feature requests, please include:

- **Problem statement**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches you've thought of
- **Use cases**: Real-world scenarios where this would be helpful

## 💻 Coding Standards

### TypeScript Guidelines

- **Use strict TypeScript**: Enable all strict compiler options
- **Prefer interfaces** over type aliases for object types
- **Use explicit return types** for public functions
- **Avoid `any`**: Use proper typing or `unknown`
- **Use JSDoc comments** for public APIs

```typescript
/**
 * Processes feedback data and sends to configured endpoints
 * 
 * @param feedback - The feedback object to process
 * @param config - Configuration for processing
 * @returns Promise resolving to processing result
 * 
 * @example
 * ```typescript
 * const result = await processFeedback(feedback, config);
 * ```
 */
export const processFeedback = async (
  feedback: Feedback,
  config: FeedbackConfig
): Promise<ProcessingResult> => {
  // Implementation
};
```

### React Guidelines

- **Use functional components** with hooks
- **Prefer composition** over inheritance
- **Use proper dependency arrays** in useEffect
- **Memoize expensive calculations** with useMemo
- **Extract custom hooks** for reusable logic

```typescript
// Good
const MyComponent: React.FC<Props> = ({ data }) => {
  const processedData = useMemo(() => 
    expensiveCalculation(data), [data]
  );
  
  return <div>{processedData}</div>;
};

// Use custom hooks for logic
const useFeedbackData = (config: Config) => {
  // Hook implementation
};
```

### Code Organization

- **Group related functionality** in modules
- **Use barrel exports** (`index.ts`) for clean imports
- **Separate concerns**: UI, logic, types, utilities
- **Follow naming conventions**:
  - `camelCase` for variables and functions
  - `PascalCase` for components and types
  - `UPPER_SNAKE_CASE` for constants

### Performance Considerations

- **Use React.memo** for expensive components
- **Implement code splitting** for large features
- **Optimize bundle size** with tree shaking
- **Monitor performance** with built-in tools

## 🧪 Testing

### Testing Philosophy

- **Test behavior, not implementation**
- **Focus on user interactions**
- **Mock external dependencies**
- **Maintain good test coverage**

### Test Structure

```typescript
describe('FeedbackModal', () => {
  beforeEach(() => {
    // Setup
  });

  describe('when user submits feedback', () => {
    it('should call onSubmit with correct data', async () => {
      // Arrange
      const mockSubmit = jest.fn();
      render(<FeedbackModal onSubmit={mockSubmit} />);
      
      // Act
      await userEvent.type(screen.getByRole('textbox'), 'Test feedback');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      // Assert
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test feedback'
        })
      );
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- FeedbackModal.test.tsx
```

## 📚 Documentation

### Documentation Standards

- **Keep README up to date** with new features
- **Use JSDoc** for all public APIs
- **Provide examples** for complex functionality
- **Include TypeScript types** in documentation

### Storybook

We use Storybook for component documentation:

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

Add stories for new components:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { FeedbackButton } from './FeedbackButton';

const meta: Meta<typeof FeedbackButton> = {
  title: 'Components/FeedbackButton',
  component: FeedbackButton,
  parameters: {
    docs: {
      description: {
        component: 'A button component for triggering feedback modal'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Feedback'
  }
};
```

## 🚢 Release Process

### Conventional Commits

We use [Conventional Commits](https://conventionalcommits.org/) for automated releases:

- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)
- `BREAKING CHANGE:` - Breaking changes (major version bump)
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/modifications
- `chore:` - Maintenance tasks

### Release Workflow

1. **Development**: Work on feature branches
2. **Testing**: Ensure all tests pass
3. **Merge**: Merge to main via PR
4. **Automated Release**: semantic-release handles versioning and publishing

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR.MINOR.PATCH** (e.g., 1.5.0)
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

## 🆘 Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Email**: [support@example.com](mailto:support@example.com) for sensitive issues

### Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Testing Framework](https://jestjs.io/docs)
- [Storybook Documentation](https://storybook.js.org/docs)

## 🏆 Recognition

We appreciate all contributions! Contributors will be:

- **Listed in CONTRIBUTORS.md**
- **Mentioned in release notes** for significant contributions
- **Invited to join** the maintainers team for ongoing contributors

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

Thank you for contributing to React Feedback Report Widget! 🎉
