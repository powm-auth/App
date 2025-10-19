/**
 * Application-wide constants
 */

export const APP_NAME = 'Expo App';
export const APP_VERSION = '1.0.0';

/**
 * API configuration (example)
 */
export const API_CONFIG = {
  baseUrl: 'https://api.example.com',
  timeout: 10000,
} as const;

/**
 * Common animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Screen breakpoints for responsive design
 */
export const BREAKPOINTS = {
  small: 320,
  medium: 768,
  large: 1024,
  xlarge: 1440,
} as const;
