# React Feedback Report Widget

[![npm version](https://badge.fury.io/js/react-feedback-report-widget.svg)](https://badge.fury.io/js/react-feedback-report-widget)
[![Release](https://github.com/ArlindMaliqi/feedback-report/actions/workflows/release.yml/badge.svg)](https://github.com/ArlindMaliqi/feedback-report/actions/workflows/release.yml)

## Overview

The React Feedback Report Widget is a TypeScript-first feedback collection tool built with React. It allows users to easily submit feedback through a floating button and shake-to-report functionality. This widget is designed to be integrated into existing applications to enhance user experience by providing a simple way to report issues.

## Features

- **Floating Feedback Button**: A button that remains fixed on the screen, allowing users to access the feedback form at any time.
- **Shake-to-Report**: Users can shake their device to trigger the feedback modal, making it easy to report issues quickly.
- **Feedback Modal**: A user-friendly modal that allows users to enter their feedback and submit it.
- **TypeScript Support**: Fully typed for better development experience.
- **Lightweight**: Minimal dependencies for optimal performance.

## Installation

To install the React Feedback Report Widget, run the following command:

```bash
npm install react-feedback-report-widget
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
