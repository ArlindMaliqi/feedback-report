import React from 'react';
import { renderWithFeedback } from '../../../testing/testUtils';
import { FeedbackButton } from '../../FeedbackButton';

describe('FeedbackButton Visual Tests', () => {
  it('renders correctly in light theme', () => {
    const { container } = renderWithFeedback(<FeedbackButton />, {
      config: { theme: 'light' }
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly in different positions', () => {
    const positions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'] as const;
    
    positions.forEach(position => {
      const { container } = renderWithFeedback(
        <FeedbackButton position={position} />
      );
      
      expect(container.firstChild).toMatchSnapshot(`position-${position}`);
    });
  });
});
