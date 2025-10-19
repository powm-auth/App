# Powm - Identity Management App

Powm is a React Native (Expo) mobile application for managing your digital identity. Authenticate on third-party websites, create identity tickets, and control your personal information from one central hub.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

Then press:
- `a` for Android
- `i` for iOS
- `w` for Web

## 📱 Features

### Current (V1)
- **Home Screen**: QR code scanner, ID ticket management
- **History Screen**: Activity tracking with third-party verifications
- **Profile Screen**: Personal information and account management
- **Bottom Navigation**: Seamless navigation between main screens

### Coming Soon
- QR code scanning functionality
- Identity ticket creation
- Document verification
- Biometric authentication
- Real-time notifications

## 🎨 Design System

### Powm Theme Tokens

#### Colors
- **Electric Purple**: #A06BFF (primary), #41207D (fade)
- **Active Purple**: #606BE2 (main), #1E1E74 (fade)
- **Backgrounds**: #060410 (main), #2A2834 (alt)
- **Neutrals**: #FFFFFF (white), #C5C5C5 (gray), #7D7C85 (inactive)
- **Error**: #7B2425 (hard), #4D1617 (alt)

#### Typography
- **Font**: Garet (Regular, SemiBold, Bold)
- **Title**: 33px, -1.98 letter-spacing
- **Subtitle**: 18px, -1.08 letter-spacing
- **Text**: 12px, -0.6 letter-spacing

#### Spacing
- Base padding: 14dp
- Small padding: 8dp
- Scale: 4, 8, 12, 14, 16, 20, 24

#### Border Radius
- xs: 6, sm: 8, md: 12, lg: 16, xl: 24, full: 9999

## 🏗️ Architecture

```
app/                    # Screens (Expo Router)
├── _layout.tsx        # Navigation configuration
├── index.tsx          # Home screen
├── history.tsx        # Activity history
└── profile.tsx        # User profile

src/
├── components/powm/   # Reusable Powm components
│   ├── Card.tsx       # Container card
│   ├── Row.tsx        # Horizontal layout
│   ├── Column.tsx     # Vertical layout
│   ├── Divider.tsx    # Line separator
│   ├── PowmText.tsx   # Typography component
│   ├── PowmIcon.tsx   # Icon component
│   └── FootBar.tsx    # Bottom navigation
│
├── theme/             # Design tokens
│   ├── powm-colors.ts
│   ├── powm-spacing.ts
│   ├── powm-typography.ts
│   ├── powm-radii.ts
│   └── powm-tokens.ts
│
├── assets/
│   └── powm/
│       ├── icons/     # 18 SVG icons
│       ├── mockup/    # Design mockups
│       └── fonts/     # Garet font files
│
└── utils/             # Helper functions
```

## 🛠️ Tech Stack

- **Framework**: Expo ~54.0
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet (no UI frameworks)
- **Icons**: Custom SVG icon system
- **State**: React hooks (future: Zustand/Context)

## 📝 Development

### Code Standards

- **No UI Frameworks**: Zero external UI libraries (no Tailwind, no UI kits)
- **StyleSheet Only**: All styles via `StyleSheet.create()`
- **Design Tokens**: All values from theme (no magic numbers)
- **TypeScript**: Strict mode, full type coverage
- **Absolute Imports**: Use `@/components`, `@/theme`, `@/utils`

### Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run lint       # Run ESLint
npm run format     # Format with Prettier
npm run type-check # TypeScript validation
```

### Adding Components

1. Create component in `src/components/powm/`
2. Use design tokens from `@/theme/powm-tokens`
3. Style with `StyleSheet.create()`
4. Export from `src/components/powm/index.ts`

Example:
```typescript
import { powmColors, powmSpacing } from '@/theme/powm-tokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: powmColors.mainBackground,
    padding: powmSpacing.base,
  },
});
```

### Adding Screens

1. Create screen in `app/`
2. Add to `app/_layout.tsx` if needed
3. Use FootBar for navigation
4. Follow existing screen patterns

## 🎯 Design Philosophy

### Principles
1. **Pixel-Perfect**: Match mockups exactly
2. **Consistent**: Use design tokens everywhere
3. **Reusable**: Component composition
4. **Type-Safe**: TypeScript strict mode
5. **Clean**: No inline styles, no magic numbers

### Component Structure
```typescript
// Layout components
<Column gap={12}>
  <Card onPress={...}>
    <Row gap={8} align="center">
      <PowmIcon name="qrcode" size={24} />
      <PowmText variant="subtitle">Scan ID</PowmText>
    </Row>
  </Card>
</Column>
```

## 📚 Documentation

- **claude.md**: Complete development progress and technical details
- **Component JSDoc**: Inline documentation with examples

## 🐛 Known Issues

1. **Fonts**: Garet fonts need to be added to `src/assets/fonts/`
2. **SVG Icons**: Using Image component (may need react-native-svg)
3. **QR Scanner**: Not yet implemented (needs expo-camera)

## 🔄 Roadmap

### Phase 1 (Current)
- ✅ Core screens (Home, History, Profile)
- ✅ Navigation system
- ✅ Design system
- ✅ Component library

### Phase 2 (Next)
- [ ] Integrate Garet fonts
- [ ] QR code scanning
- [ ] Ticket creation flow
- [ ] Personal info screen

### Phase 3 (Future)
- [ ] Backend integration
- [ ] Data persistence
- [ ] Biometric auth
- [ ] Push notifications

## 📄 License

Private project - All rights reserved

---

**Built with Expo, React Native, and TypeScript**
**No UI frameworks, just clean code** 🎯

**For detailed development progress, see [claude.md](./claude.md)**
