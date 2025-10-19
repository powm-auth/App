# Quick Start Guide

## 🚀 Launch the App

```bash
cd App

# Install dependencies (if not already done)
npm install

# Start development server
npm start

# Then press:
# - 'a' for Android
# - 'i' for iOS
# - 'w' for Web
```

## 📂 What's Inside

Your app now has:

### ✅ Complete Architecture
- **src/app/** - 4 screens (Home, Details, Settings, Modal)
- **src/components/** - 4 reusable components (IconCircle, ButtonPrimary, TextTitle, TextBody)
- **src/theme/** - Design tokens (colors, spacing, typography, radius)
- **src/utils/** - Helper functions and constants
- **src/features/** - Ready for feature-specific components

### ✅ Navigation Setup
- Expo Router configured with Stack navigation
- Home → Details → Settings flow
- Modal presentation example

### ✅ Developer Tools
- TypeScript strict mode ✓
- ESLint configured ✓
- Prettier configured ✓
- Absolute imports (`@/*`) ✓

## 🎨 Key Components

### IconCircle
```typescript
<IconCircle
  size={80}
  backgroundColor={colors.primary}
  icon="🚀"
  iconSize={40}
  onPress={() => console.log('Pressed')}
  elevation={4}
  variant="filled" // or "outline"
/>
```

### ButtonPrimary
```typescript
<ButtonPrimary
  title="Click Me"
  onPress={() => {}}
  variant="primary" // primary, secondary, outline, ghost
  size="large" // small, medium, large
  fullWidth
/>
```

### TextTitle
```typescript
<TextTitle level="h1" color={colors.primary}>
  My Title
</TextTitle>
```

### TextBody
```typescript
<TextBody size="large" variant="secondary" weight="semibold">
  Body text here
</TextBody>
```

## 🔧 Development Commands

```bash
npm start          # Start dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run lint       # Check code quality
npm run format     # Format all files
npm run type-check # TypeScript validation
```

## 📖 Full Documentation

See **DEV_README.md** for:
- Detailed architecture explanation
- How to create new components
- How to add new screens
- Theme customization
- Best practices
- Troubleshooting

## ⚡ Next Steps

1. **Customize theme**: Edit `src/theme/colors.ts`
2. **Add icons**: Put images in `src/assets/`
3. **Create features**: Use `src/features/` for complex features
4. **Build screens**: Add new screens in `src/app/`

## 🎯 Remember

- ❌ **NO UI frameworks** (no Tailwind, no UI kits)
- ✅ **StyleSheet only** in each component
- ✅ **Use theme tokens** instead of hardcoded values
- ✅ **Absolute imports** with `@/*` prefix

---

**Happy coding!** 🎉
