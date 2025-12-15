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

export interface AttributeDefinition {
  label: string;
  description?: string;
  requestable?: boolean;
}

/**
 * Definitions for identity attributes
 * NOTE: The order of keys here determines the display order in the app.
 */
export const ATTRIBUTE_DEFINITIONS: Record<string, AttributeDefinition> = {
  'anonymous_id': {
    label: 'Anonymous Unique ID',
    description: 'Your unique anonymous identifier',
    requestable: true
  },
  'first_name': {
    label: 'First Name',
    description: 'Legal first name',
    requestable: true
  },
  'last_name': {
    label: 'Last Name',
    description: 'Legal last name',
    requestable: true
  },
  'date_of_birth': {
    label: 'Date of Birth',
    description: 'Full date of birth',
    requestable: true
  },
  'age_over_18': {
    label: 'Age Over 18',
    description: 'Verify adult status',
    requestable: true
  },
  'age_over_21': {
    label: 'Age Over 21',
    description: 'Verify 21+ status',
    requestable: true
  },
  'nationality_1': {
    label: 'Nationality 1',
    description: 'First nationality',
    requestable: true
  },
  'nationality_2': {
    label: 'Nationality 2',
    description: 'Second nationality',
    requestable: true
  },
  'nationality_3': {
    label: 'Nationality 3',
    description: 'Third nationality',
    requestable: true
  },
  'gender': {
    label: 'Gender',
    description: 'Gender identity',
    requestable: true
  },
  'birth_country': {
    label: 'Birth Country',
    requestable: true
  },
};

export const ANONYMOUS_ID_INFO_TITLE = "What is an Anonymous ID?";
export const ANONYMOUS_ID_INFO_MESSAGE =
  "When an app asks for your identity, it might also request your Anonymous ID.\n\n" +
  "Your Anonymous ID:\n" +
  "• Is a unique code generated for you just for that app\n" +
  "• Lets apps recognize you on future visits\n" +
  "• Is different for every app — they can't track you across apps\n\n" +
  "If you reset your Anonymous ID:\n\n" +
  "• Apps may see you as a new user\n" +
  "• Activity linked to your previous Anonymous ID is no longer associated with you\n" +
  "• Your identity details stay unchanged\n" +
  "• This cannot be undone\n\n";
