/**
 * Powm Color Tokens
 * Official Powm color palette
 */
export const powmColors = {
  // Primary Electric Purple
  electricMain: '#A06BFF',
  electricFade: '#41207D',

  // Active State
  activeElectricMain: '#606BE2',
  activeElectricFade: '#1E1E74',

  // Backgrounds
  mainBackground: '#060410',
  mainBackgroundAlt: '#2A2834',

  // Neutral
  white: '#FFFFFF',
  gray: '#C5C5C5',
  inactive: '#7D7C85',

  // Deletion/Error
  deletionRedHard: '#7B2425',
  deletionRedAlt: '#4D1617',
} as const;

export type PowmColorToken = keyof typeof powmColors;
