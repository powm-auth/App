/**
 * Powm Design Tokens
 * Central export for all Powm design system tokens
 */
export * from './powm-colors';
export * from './powm-spacing';
export * from './powm-typography';
export * from './powm-radii';

import { powmColors } from './powm-colors';
import { powmSpacing } from './powm-spacing';
import { powmTypography, FONT_FAMILIES } from './powm-typography';
import { powmRadii } from './powm-radii';

/**
 * Complete Powm theme object
 */
export const powmTheme = {
  colors: powmColors,
  spacing: powmSpacing,
  typography: powmTypography,
  radii: powmRadii,
  fonts: FONT_FAMILIES,
} as const;
