/**
 * Powm Typography Tokens
 * Font: Garet (to be loaded with expo-font)
 *
 * Letter spacing calculations:
 * - Title: -6% of 33 = -1.98
 * - Subtitle: -6% of 18 = -1.08
 * - Text: -5% of 12 = -0.6
 */

// Font family names (will be registered with useFonts)
// Using System font fallback for now
export const FONT_FAMILIES = {
  garetRegular: 'System',
  garetSemiBold: 'System',
  garetBold: 'System',
} as const;

// Typography styles
export const powmTypography = {
  title: {
    fontFamily: FONT_FAMILIES.garetRegular,
    fontSize: 33,
    letterSpacing: -1.98,
  },
  subtitle: {
    fontFamily: FONT_FAMILIES.garetRegular,
    fontSize: 18,
    letterSpacing: -1.08,
  },
  text: {
    fontFamily: FONT_FAMILIES.garetRegular,
    fontSize: 12,
    letterSpacing: -0.6,
  },
  // Variants with different weights
  titleBold: {
    fontFamily: FONT_FAMILIES.garetBold,
    fontSize: 33,
    letterSpacing: -1.98,
  },
  subtitleSemiBold: {
    fontFamily: FONT_FAMILIES.garetSemiBold,
    fontSize: 18,
    letterSpacing: -1.08,
  },
  textSemiBold: {
    fontFamily: FONT_FAMILIES.garetSemiBold,
    fontSize: 12,
    letterSpacing: -0.6,
  },
} as const;

export type PowmTypographyToken = keyof typeof powmTypography;

/**
 * Font loading map for expo-font
 * Place Garet font files in src/assets/fonts/
 *
 * For now, using system font fallback since Garet is installed locally on your PC
 * but not bundled in the app. To use Garet:
 * 1. Export .ttf files from your system
 * 2. Place them in src/assets/fonts/
 * 3. Uncomment the lines below
 */
// export const FONT_LOAD_MAP = {
//   [FONT_FAMILIES.garetRegular]: require('../assets/fonts/Garet-Regular.ttf'),
//   [FONT_FAMILIES.garetSemiBold]: require('../assets/fonts/Garet-SemiBold.ttf'),
//   [FONT_FAMILIES.garetBold]: require('../assets/fonts/Garet-Bold.ttf'),
// };

// Temporary fallback to system font
export const FONT_LOAD_MAP = {};
