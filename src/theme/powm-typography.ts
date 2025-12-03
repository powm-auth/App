/**
 * Powm Typography Tokens
 * Font: Inter (Google Fonts)
 */

export const FONT_FAMILIES = {
  // Inter has a "Variable" font, but we map specific weights for safety
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const powmTypography = {
  title: {
    fontFamily: FONT_FAMILIES.medium, // Modern apps often use Medium for titles, not Bold
    fontSize: 32,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 18,
    letterSpacing: -0.4,
  },
  text: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 14,
    letterSpacing: 0,
  },
  // Variants
  titleBold: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 32,
    letterSpacing: -0.8,
  },
  subtitleSemiBold: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: 18,
    letterSpacing: -0.4,
  },
  textSemiBold: {
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: 14,
    letterSpacing: 0,
  },
} as const;

export type PowmTypographyToken = keyof typeof powmTypography;