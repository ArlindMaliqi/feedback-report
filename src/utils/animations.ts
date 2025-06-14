import type { AnimationConfig } from '../types';

/**
 * Default animation configuration
 */
const defaultAnimationConfig: Required<AnimationConfig> = {
  enter: 'fadeIn',
  exit: 'fadeOut',
  duration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)' // Now properly defined in AnimationConfig
};

/**
 * Generates CSS keyframes for animations
 */
export const generateKeyframes = () => {
  if (typeof document === 'undefined') return;
  
  // Check if keyframes are already added
  if (document.getElementById('feedback-widget-keyframes')) return;
  
  const style = document.createElement('style');
  style.id = 'feedback-widget-keyframes';
  style.innerHTML = `
    @keyframes feedback-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes feedback-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes feedback-slide-up-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes feedback-slide-up-out {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes feedback-slide-down-in {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes feedback-slide-down-out {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
    
    @keyframes feedback-zoom-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes feedback-zoom-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.95); }
    }
  `;
  
  document.head.appendChild(style);
};

/**
 * Gets animation styles for modal transitions
 * @param animation - Animation configuration
 * @param isVisible - Whether the element is visible
 * @returns CSS style object
 */
export const getAnimationStyles = (
  animation: AnimationConfig = defaultAnimationConfig,
  isVisible: boolean = false
): React.CSSProperties => {
  const { enter, exit, duration, easing } = { ...defaultAnimationConfig, ...animation };
  
  if (!isVisible && exit === 'none') {
    return { display: 'none' };
  }
  
  if (isVisible && enter === 'none') {
    return {};
  }
  
  // Generate keyframes if they don't exist
  generateKeyframes();
  
  const animationName = isVisible
    ? getEnterAnimationName(enter)
    : getExitAnimationName(exit);
  
  return {
    animation: `${animationName} ${duration}ms ${easing}`,
    animationFillMode: 'forwards'
  };
};

/**
 * Gets the enter animation name based on type
 */
function getEnterAnimationName(type: AnimationConfig['enter'] = 'fade'): string {
  switch (type) {
    case 'slide-up':
      return 'feedback-slide-up-in';
    case 'slide-down':
      return 'feedback-slide-down-in';
    case 'zoom':
      return 'feedback-zoom-in';
    case 'fade':
    default:
      return 'feedback-fade-in';
  }
}

/**
 * Gets the exit animation name based on type
 */
function getExitAnimationName(type: AnimationConfig['exit'] = 'fade'): string {
  switch (type) {
    case 'slide-up':
      return 'feedback-slide-up-out';
    case 'slide-down':
      return 'feedback-slide-down-out';
    case 'zoom':
      return 'feedback-zoom-out';
    case 'fade':
    default:
      return 'feedback-fade-out';
  }
}
