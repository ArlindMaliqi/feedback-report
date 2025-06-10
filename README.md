# Feedback Report Widget

## Overview
The Feedback Report Widget is a private bug-reporting tool built with React. It allows users to easily submit feedback through a floating button and shake-to-report functionality. This widget is designed to be integrated into existing applications to enhance user experience by providing a simple way to report issues.

## Features
- **Floating Feedback Button**: A button that remains fixed on the screen, allowing users to access the feedback form at any time.
- **Shake-to-Report**: Users can shake their device to trigger the feedback modal, making it easy to report issues quickly.
- **Feedback Modal**: A user-friendly modal that allows users to enter their feedback and submit it.

## Installation
To install the Feedback Report Widget, run the following command:

```bash
npm install @esrxc/feedback-report
```

## Usage
To use the Feedback Report Widget in your application, wrap your component tree with the `FeedbackProvider` and include the `FeedbackButton` component.

```tsx
import React from 'react';
import { FeedbackProvider, FeedbackButton } from '@esrxc/feedback-report';

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

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is private and not open for public contributions.