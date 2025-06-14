/**
 * Type declarations for Storybook
 * These type definitions are for development use only and not published
 */

declare module '@storybook/react' {
  import { ComponentType, ReactElement } from 'react';

  export interface Meta<T> {
    title: string;
    component: ComponentType<T>;
    parameters?: Record<string, any>;
    decorators?: Array<(story: () => ReactElement) => ReactElement>;
    tags?: string[];
    argTypes?: Record<string, any>;
  }

  export interface StoryObj<T> {
    name?: string;
    storyName?: string;
    args?: Partial<React.ComponentProps<T & React.FC>>;
    parameters?: Record<string, any>;
    decorators?: Array<(story: () => ReactElement) => ReactElement>;
  }
}

declare module '@storybook/addon-actions' {
  export function action(name: string): (...args: any[]) => void;
}

declare module '@storybook/addon-links' {
  export function linkTo(book: string, story: string): (...args: any[]) => void;
}
