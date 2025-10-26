# VoiceFX - Offline Voice Effects & Editor

Production-ready React Native application for applying voice effects, editing audio, and exporting projects. Works completely offline with no external API dependencies.

## Features

- **Voice Effects**: Apply pitch, formant, reverb, echo, distortion, and custom effects
- **Offline-First**: All data stored locally using SQLite
- **Gesture-First UX**: Intuitive swipes, taps, and gestures with physics-based animations
- **In-App Purchases**: Pro unlock with lifetime, yearly, and monthly subscriptions
- **Export**: Export projects as Audio, JSON, Markdown, or PDF
- **Accessibility**: VoiceOver support, Dynamic Type, large touch targets
- **Dark Mode**: Automatic system theme detection with manual override

## Tech Stack

- **React Native 0.75.4** with TypeScript
- **New Architecture**: Fabric & TurboModules enabled
- **Navigation**: react-navigation 6.x
- **State Management**: Zustand
- **Database**: SQLite via @op-engineering/op-sqlite
- **Animation**: react-native-reanimated 3.x
- **Rendering**: @shopify/react-native-skia
- **Gestures**: react-native-gesture-handler

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── animated/    # Animated components with Reanimated
│   └── catalog/     # Component library (70 components)
├── screens/         # Screen components
├── navigation/      # Navigation configuration
├── store/           # Zustand state management
├── database/        # SQLite database layer
├── theme/           # Theme system (colors, typography, spacing)
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
└── utils/           # Utility functions

ios/                 # iOS native project
android/             # Android native project
__tests__/           # Test files
```

## Installation

### Prerequisites

- Node.js >= 18
- npm >= 9
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### Setup

1. **Install dependencies:**

```bash
npm install
```

2. **iOS Setup:**

```bash
cd ios
pod install
cd ..
```

3. **Run the app:**

```bash
# iOS
npm run ios

# Android
npm run android
```

## Development

### Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Building for Production

#### iOS

1. Open `ios/VoiceFX.xcworkspace` in Xcode
2. Select your team and provisioning profile
3. Archive the app (Product > Archive)
4. Distribute to App Store Connect

#### Android

```bash
cd android
./gradlew assembleRelease
```

The APK will be at `android/app/build/outputs/apk/release/app-release.apk`

## Configuration

### Environment Variables

No environment variables needed - app is fully offline.

### App Configuration

Edit `app.json` for app name and display name.

### Theme Customization

Edit `src/theme/colors.ts` to customize the color scheme.

## Performance

- **60fps animations** using Reanimated worklets on UI thread
- **< 100ms interaction response** with optimized gesture handling
- **Lazy loading** for large lists with FlatList
- **Memoization** for expensive computations
- **Hermes** JavaScript engine enabled for faster startup

## Accessibility

- VoiceOver/TalkBack support with descriptive labels
- Dynamic Type support for text scaling
- High contrast mode support
- Large touch targets (44pt minimum)
- Keyboard navigation support

## In-App Purchases

### Product IDs

- `pro_unlock_lifetime`: One-time purchase ($49.99)
- `pro_unlock_yearly`: Annual subscription ($29.99/year)
- `pro_unlock_monthly`: Monthly subscription ($4.99/month)

### Testing IAP

Use sandbox accounts in App Store Connect for testing purchases.

## Database Schema

### Tables

- **projects**: Audio projects with metadata
- **effects**: Voice effects library
- **project_effects**: Junction table for project-effect relationships
- **preferences**: User preferences
- **purchases**: IAP purchase records
- **notifications**: Scheduled notifications

### Migrations

Database migrations are handled automatically on app launch. Schema version is tracked in `PRAGMA user_version`.

## Offline Data

All data is stored locally:
- SQLite database for structured data
- File system (RNFS) for audio files
- AsyncStorage for small key-value data

No network requests are made except for IAP validation.

## Export Formats

- **Audio**: WAV, MP3 (via react-native-audio-toolkit)
- **JSON**: Complete project data export
- **Markdown**: Project report with metadata
- **PDF**: Visual project summary (via react-native-pdf)

## Contributing

This is a production codebase. All contributions must:

1. Pass all tests (`npm test`)
2. Pass type checking (`npm run type-check`)
3. Pass linting (`npm run lint`)
4. Maintain >80% code coverage
5. Include comprehensive tests
6. Follow existing code style

## License

Copyright © 2025. All rights reserved.

## Support

For issues and feature requests, please contact support or file an issue in the repository.

## Changelog

### v1.0.0 (2025-01-15)

- Initial release
- 70+ UI components with animations
- Complete offline functionality
- IAP integration
- Export in 4 formats
- Full accessibility support
- iOS and Android support
