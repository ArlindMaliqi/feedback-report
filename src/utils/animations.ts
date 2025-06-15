import type { AnimationConfig } from '../types';

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION: Required<AnimationConfig> = {
  enter: 'fade',
  exit: 'fade',
  duration: 300,
  easing: 'ease-in-out'
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
  animation: AnimationConfig = DEFAULT_ANIMATION,
  isVisible: boolean = false
): React.CSSProperties => {
  const { enter, exit, duration, easing } = { ...DEFAULT_ANIMATION, ...animation };
  
  if (!isVisible && exit === 'none') {
    return { display: 'none' };
  }
  
  if (isVisible && enter === 'none') {
    return {};
  }
  
  // Generate keyframes if they don't exist
  generateKeyframes();
  
  const animationName = isVisible
    ? getEnterKeyframes(enter)
    : getExitKeyframes(exit);
  
  return {
    animation: `${animationName} ${duration}ms ${easing}`,
    animationFillMode: 'forwards'
  };
};

/**
 * Gets the enter animation name based on type
 */
export const getEnterKeyframes = (type: AnimationConfig['enter']): string => {
  switch (type) {
    case 'fade':
    case 'fadeIn':
      return 'fadeIn';
    case 'slide':
      return 'slideInUp';
    case 'slide-up':
      return 'slideInUp';
    case 'slide-down':
      return 'slideInDown';
    case 'scale':
      return 'scaleIn';
    case 'zoom':
      return 'zoomIn';
    case 'none':
    default:
      return 'none';
  }
};

/**
 * Gets the exit animation name based on type
 */
export const getExitKeyframes = (type: AnimationConfig['exit']): string => {
  switch (type) {
    case 'fade':
    case 'fadeOut':
      return 'fadeOut';
    case 'slide':
      return 'slideOutDown';
    case 'slide-up':
      return 'slideOutUp';
    case 'slide-down':
      return 'slideOutDown';
    case 'scale':
      return 'scaleOut';
    case 'zoom':
      return 'zoomOut';
    case 'none':
    default:
      return 'none';
  }
};

/**
 * Gets the animation name for enter or exit based on visibility
 */
export const getAnimationName = (enter?: string, exit?: string): string => {
  return enter 
    ? getEnterKeyframes(enter as AnimationConfig['enter'])
    : getExitKeyframes(exit as AnimationConfig['exit']);
};
