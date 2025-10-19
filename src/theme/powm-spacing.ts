/**
 * Powm Spacing Tokens
 * Consistent spacing values for the Powm design system
 */
export const powmSpacing = {
  // Base padding/margin values
  paddingBase: 14,
  paddingSmall: 8,
  marginBase: 14,

  // Standard spacing scale
  xs: 4,
  sm: 8,
  md: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export type PowmSpacingToken = keyof typeof powmSpacing;
