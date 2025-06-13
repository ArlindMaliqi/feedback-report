# React Feedback Report Widget

[![npm version](https://badge.fury.io/js/react-feedback-report-widget.svg)](https://badge.fury.io/js/react-feedback-report-widget)
[![Release](https://github.com/ArlindMaliqi/feedback-report/actions/workflows/release.yml/badge.svg)](https://github.com/ArlindMaliqi/feedback-report/actions/workflows/release.yml)
[![GitHub Package Registry](https://img.shields.io/badge/GitHub%20Package%20Registry-published-blue)](https://github.com/ArlindMaliqi/feedback-report/packages)

## Overview

The React Feedback Report Widget is a TypeScript-first feedback collection tool built with React. It allows users to easily submit feedback through a floating button and shake-to-report functionality. This widget is designed to be integrated into existing applications to enhance user experience by providing a simple way to report issues.

## Features

- **Floating Feedback Button**: A button that remains fixed on the screen, allowing users to access the feedback form at any time.
- **Shake-to-Report**: Users can shake their device to trigger the feedback modal, making it easy to report issues quickly.
- **Feedback Modal**: A user-friendly modal that allows users to enter their feedback and submit it.
- **TypeScript Support**: Fully typed for better development experience.
- **Lightweight**: Minimal dependencies for optimal performance.

## Installation

### From NPM Registry

To install the React Feedback Report Widget from NPM, run the following command:

```bash
npm install react-feedback-report-widget
```

### From GitHub Packages

You can also install directly from GitHub Packages:

```bash
# Configure npm to use GitHub Packages for @ArlindMaliqi scope
echo "@ArlindMaliqi:registry=https://npm.pkg.github.com" >> .npmrc

# Install the package
npm install @ArlindMaliqi/react-feedback-report-widget
```

Or create a `.npmrc` file in your project root:

```
@ArlindMaliqi:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

## Usage

To use the React Feedback Report Widget in your application, wrap your component tree with the `FeedbackProvider` and include the `FeedbackButton` component.

```tsx
import React from "react";
import { FeedbackProvider, FeedbackButton } from "react-feedback-report-widget";

const App = () => {
  return (
    <FeedbackProvider>
      <YourMainComponent />
      <FeedbackButton />
    </FeedbackProvider>
  );
};

export default App;
```

## Development

To build the project, run:

```bash
npm run build
```

To clean the build directory, use:

```bash
npm run clean
```

## Automated Releases

This project uses semantic-release for automated versioning and publishing. Releases are triggered automatically when commits are pushed to the main branch following conventional commit format:

- `feat:` for new features (minor version bump)
- `fix:` for bug fixes (patch version bump)
- `BREAKING CHANGE:` for breaking changes (major version bump)

## Contributing

Contributions are welcome! Please follow conventional commit format for your commit messages.

## License

This project is licensed under the MIT License.

## Package Availability

This package is available on both:

- **NPM Registry**: `react-feedback-report-widget`
- **GitHub Packages**: `@ArlindMaliqi/react-feedback-report-widget`

Both packages contain identical functionality - choose the one that fits your workflow better.
