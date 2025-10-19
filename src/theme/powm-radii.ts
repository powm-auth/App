/**
 * Powm Border Radius Tokens
 */
export const powmRadii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type PowmRadiusToken = keyof typeof powmRadii;
