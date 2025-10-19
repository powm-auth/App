# Developer Documentation

## Overview

This is an Expo React Native application built with TypeScript and **zero UI frameworks**. All styling is done using React Native's built-in `StyleSheet` API. The project follows a clean, modular architecture with reusable components and a centralized theme system.

## Architecture

### Project Structure

```
App/
├── app/                  # Screens/Pages (Expo Router - must be at root)
│   ├── _layout.tsx       # Root navigation layout
│   ├── index.tsx         # Home screen
│   ├── details.tsx       # Details screen
│   ├── settings.tsx      # Settings screen
│   └── modal.tsx         # Modal screen
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── IconCircle.tsx
│   │   ├── ButtonPrimary.tsx
│   │   ├── TextTitle.tsx
│   │   ├── TextBody.tsx
│   │   └── index.ts      # Component exports
│   ├── features/         # Feature-specific components (when needed)
│   ├── assets/           # Images, icons, SVG files
│   ├── utils/            # Helper functions and constants
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   └── theme/            # Design tokens
│       ├── colors.ts
│       ├── spacing.ts
│       ├── typography.ts
│       ├── radius.ts
│       └── index.ts
├── package.json
├── tsconfig.json
├── .prettierrc.json
└── eslint.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (automatically installed with dependencies)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check if files are formatted |
| `npm run type-check` | Run TypeScript compiler checks |

## Development Conventions

### 1. **No UI Frameworks Policy**

- ❌ **DO NOT** use Tailwind, Bootstrap, or any UI component library
- ✅ **DO** use React Native's `StyleSheet` API exclusively
- ✅ **DO** import styles locally in each component file

```typescript
// ❌ WRONG - Don't do this
import { tw } from 'tailwind-react-native';

// ✅ CORRECT - Do this
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### 2. **TypeScript Strict Mode**

- Always use TypeScript with strict mode enabled
- Define explicit types for component props
- Avoid using `any` type

```typescript
// ✅ CORRECT
interface MyComponentProps {
  title: string;
  onPress: () => void;
  isActive?: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress, isActive = false }) => {
  // ...
};
```

### 3. **Absolute Imports**

Use the `@/` prefix for imports from the `src` directory:

```typescript
// ✅ CORRECT
import { colors, spacing } from '@/theme';
import { IconCircle, ButtonPrimary } from '@/components';
import { formatNumber } from '@/utils';

// ❌ WRONG - Don't use relative imports
import { colors } from '../../../theme';
```

### 4. **Theme Tokens**

Always use theme tokens instead of hardcoded values:

```typescript
// ✅ CORRECT
import { colors, spacing, fontSize, radius } from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    fontSize: fontSize.lg,
  },
});

// ❌ WRONG - Don't hardcode values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  },
});
```

### 5. **Component Documentation**

Every component should include JSDoc comments with usage examples:

```typescript
/**
 * MyComponent
 *
 * Brief description of what this component does.
 *
 * @example
 * // Basic usage
 * <MyComponent title="Hello" onPress={() => {}} />
 *
 * @example
 * // With optional props
 * <MyComponent title="Hello" onPress={() => {}} isActive={true} />
 */
```

## Creating New Components

### Step 1: Create the Component File

Create a new file in `src/components/`:

```bash
touch src/components/MyNewComponent.tsx
```

### Step 2: Define the Component Structure

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '@/theme';

/**
 * MyNewComponent
 *
 * Description of what this component does.
 *
 * @example
 * <MyNewComponent title="Example" />
 */

export interface MyNewComponentProps {
  title: string;
  // Add more props as needed
}

export const MyNewComponent: React.FC<MyNewComponentProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  text: {
    fontSize: fontSize.md,
    color: colors.text,
  },
});
```

### Step 3: Export the Component

Add the export to `src/components/index.ts`:

```typescript
export * from './MyNewComponent';
```

### Step 4: Use the Component

```typescript
import { MyNewComponent } from '@/components';

// Use it in your screen
<MyNewComponent title="Hello World" />
```

## Creating New Screens

### Step 1: Create Screen File

Create a new file in `app/` (Expo Router requires screens at root level):

```bash
touch app/my-screen.tsx
```

### Step 2: Implement the Screen

```typescript
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TextTitle, TextBody, ButtonPrimary } from '@/components';
import { colors, spacing } from '@/theme';

export default function MyScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TextTitle level="h1">My New Screen</TextTitle>
      <TextBody>Screen content goes here</TextBody>

      <ButtonPrimary
        title="Go Back"
        onPress={() => router.back()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
});
```

### Step 3: Add Route to Layout

Update `app/_layout.tsx` to include the new screen:

```typescript
<Stack.Screen
  name="my-screen"
  options={{
    title: 'My Screen',
    headerShown: true,
  }}
/>
```

### Step 4: Navigate to the Screen

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/my-screen');
```

## Adding New Features

For larger features that require multiple components, create a feature directory:

```bash
mkdir src/features/auth
touch src/features/auth/LoginForm.tsx
touch src/features/auth/RegisterForm.tsx
touch src/features/auth/index.ts
```

Structure:
```
src/features/auth/
├── LoginForm.tsx
├── RegisterForm.tsx
├── AuthButton.tsx
├── index.ts           # Export all auth components
└── types.ts           # Auth-specific types
```

## Theme Customization

### Adding New Colors

Edit `src/theme/colors.ts`:

```typescript
export const colors = {
  // ... existing colors

  // Add new color
  brandPrimary: '#FF6B6B',
} as const;
```

### Adding New Spacing Values

Edit `src/theme/spacing.ts`:

```typescript
export const spacing = {
  // ... existing spacing

  // Add new spacing
  xxs: 2,
} as const;
```

### Adding New Font Sizes

Edit `src/theme/typography.ts`:

```typescript
export const fontSize = {
  // ... existing sizes

  // Add new size
  xxxxxl: 48,
} as const;
```

## Code Quality

### Running Linter

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint -- --fix
```

### Formatting Code

```bash
# Format all files
npm run format

# Check formatting without changing files
npm run format:check
```

### Type Checking

```bash
# Run TypeScript compiler checks
npm run type-check
```

## Best Practices

### 1. Component Composition

Break down complex components into smaller, reusable pieces:

```typescript
// ✅ CORRECT - Composable components
<Card>
  <CardHeader>
    <IconCircle icon="🚀" />
    <TextTitle level="h3">Title</TextTitle>
  </CardHeader>
  <CardBody>
    <TextBody>Content</TextBody>
  </CardBody>
</Card>

// ❌ WRONG - Monolithic component
<Card title="Title" icon="🚀" content="Content" />
```

### 2. Consistent Naming

- Components: PascalCase (`IconCircle`, `ButtonPrimary`)
- Files: Match component name (`IconCircle.tsx`)
- Props interfaces: ComponentName + Props (`IconCircleProps`)
- Style objects: camelCase (`container`, `headerTitle`)

### 3. Accessibility

Always provide accessibility props:

```typescript
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  accessibilityHint="Double tap to submit"
  accessibilityState={{ disabled: false }}
>
  <Text>Submit</Text>
</Pressable>
```

### 4. Performance

- Use `React.memo()` for expensive components
- Avoid inline styles and functions in render
- Use `useMemo` and `useCallback` appropriately

```typescript
// ✅ CORRECT
const styles = StyleSheet.create({
  button: { padding: 16 },
});

const handlePress = useCallback(() => {
  // handle press
}, [dependencies]);

// ❌ WRONG
<View style={{ padding: 16 }}>
  <Button onPress={() => handlePress()} />
</View>
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache and restart
npx expo start -c
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run type-check
```

### Module Resolution Issues

Make sure `tsconfig.json` has correct paths configuration:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Expo Router Documentation](https://expo.github.io/router/docs/)

## Contributing

When contributing to this project:

1. Follow the established architecture and conventions
2. Add JSDoc comments to all components
3. Run linter and formatter before committing
4. Ensure TypeScript compiles without errors
5. Test on both iOS and Android if possible

---

**Remember: NO UI FRAMEWORKS. StyleSheet only!** 🎨
