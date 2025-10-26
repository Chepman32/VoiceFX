# VoiceFX Deployment Guide

Complete guide for building and deploying VoiceFX to production.

## Prerequisites

### iOS

- Mac with Xcode 14.3 or later
- Apple Developer Program membership
- Valid provisioning profiles and certificates
- CocoaPods installed

### Android

- Android Studio Arctic Fox or later
- Java Development Kit (JDK) 17
- Android SDK 34
- Release keystore file

## iOS Deployment

### 1. Prepare the Build

```bash
# Install dependencies
npm install

# Install iOS pods
cd ios
pod install
cd ..
```

### 2. Configure App Store Connect

1. Create app in App Store Connect
2. Set up app information:
   - Name: VoiceFX
   - Bundle ID: com.voicefx
   - Primary language: English
   - Category: Music/Entertainment

3. Configure In-App Purchases:
   - Add products: `pro_unlock_lifetime`, `pro_unlock_yearly`, `pro_unlock_monthly`
   - Set pricing tiers
   - Submit for review

### 3. Code Signing

1. Open `ios/VoiceFX.xcworkspace` in Xcode
2. Select the VoiceFX target
3. Go to "Signing & Capabilities"
4. Select your team
5. Choose "Automatically manage signing"
6. Verify provisioning profile is valid

### 4. Build for Release

1. In Xcode, select "Any iOS Device" as build target
2. Go to Product > Archive
3. Wait for archive to complete
4. Click "Distribute App"
5. Select "App Store Connect"
6. Choose "Upload"
7. Follow the wizard to upload

### 5. Submit for Review

1. Return to App Store Connect
2. Select your app version
3. Add screenshots (required sizes):
   - 6.5" Display: 1284 x 2778 pixels
   - 5.5" Display: 1242 x 2208 pixels
   - iPad Pro (3rd gen): 2048 x 2732 pixels

4. Fill in:
   - App description
   - Keywords
   - Support URL
   - Marketing URL (optional)
   - Privacy Policy URL

5. Submit for review

## Android Deployment

### 1. Generate Release Keystore

```bash
cd android/app

# Generate keystore (do this once)
keytool -genkeypair -v -storetype PKCS12 -keystore voicefx-release.keystore -alias voicefx -keyalg RSA -keysize 2048 -validity 10000

# Enter password and information when prompted
# Store password securely!
```

### 2. Configure Gradle for Release

Create `android/gradle.properties` (do not commit):

```properties
VOICEFX_RELEASE_STORE_FILE=voicefx-release.keystore
VOICEFX_RELEASE_KEY_ALIAS=voicefx
VOICEFX_RELEASE_STORE_PASSWORD=your_store_password
VOICEFX_RELEASE_KEY_PASSWORD=your_key_password
```

Update `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('VOICEFX_RELEASE_STORE_FILE')) {
                storeFile file(VOICEFX_RELEASE_STORE_FILE)
                storePassword VOICEFX_RELEASE_STORE_PASSWORD
                keyAlias VOICEFX_RELEASE_KEY_ALIAS
                keyPassword VOICEFX_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build Release APK/AAB

```bash
cd android

# Build APK
./gradlew assembleRelease

# Or build AAB (preferred for Play Store)
./gradlew bundleRelease
```

Output files:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### 4. Test Release Build

```bash
# Install release APK on device
adb install android/app/build/outputs/apk/release/app-release.apk

# Test all features thoroughly
```

### 5. Google Play Console Setup

1. Create app in Google Play Console
2. Set up store listing:
   - Title: VoiceFX
   - Short description (80 chars)
   - Full description
   - App icon: 512 x 512 PNG
   - Feature graphic: 1024 x 500 PNG
   - Screenshots (at least 2):
     - Phone: 1080 x 1920 to 1920 x 1080
     - 7" Tablet: 1200 x 1920 to 1920 x 1200
     - 10" Tablet: 1600 x 2560 to 2560 x 1600

3. Configure content rating
4. Set up pricing & distribution
5. Configure In-App Products (same IDs as iOS)

### 6. Upload to Play Store

1. Go to "Production" track
2. Create new release
3. Upload AAB file
4. Fill in release notes
5. Review and rollout

## Performance Optimization

### iOS

1. **Enable Hermes** (already enabled):
   - Faster startup time
   - Reduced memory usage

2. **Optimize Images**:
   ```bash
   # Use ImageOptim or similar
   imageoptim --quality 85 assets/images/**/*.png
   ```

3. **Profile with Instruments**:
   - Time Profiler for CPU usage
   - Allocations for memory leaks
   - Network for unexpected requests

### Android

1. **Enable ProGuard** (already enabled)

2. **R8 Optimization** (already enabled)

3. **Profile with Android Profiler**:
   - CPU usage
   - Memory allocations
   - Network activity

4. **Reduce APK size**:
   - Enable split APKs per ABI
   - Remove unused resources

## CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: cd ios && pod install
      - run: fastlane ios release
        env:
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          FASTLANE_PASSWORD: ${{ secrets.FASTLANE_PASSWORD }}

  deploy-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: cd android && ./gradlew bundleRelease
      - run: fastlane android release
        env:
          ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
```

### Fastlane Setup

Install Fastlane:

```bash
sudo gem install fastlane -NV
```

Initialize:

```bash
# iOS
cd ios
fastlane init

# Android
cd ../android
fastlane init
```

## Monitoring & Analytics

### Crash Reporting

Consider adding:
- Sentry
- Firebase Crashlytics
- Bugsnag

### Analytics

Since app is offline-first, analytics must be:
- Optional (user consent)
- Queued locally
- Uploaded when connected

## Post-Launch

### Monitor

1. App Store/Play Console reviews
2. Crash reports
3. User feedback
4. IAP revenue

### Update Strategy

1. Bug fixes: Patch releases (1.0.x)
2. Features: Minor releases (1.x.0)
3. Breaking changes: Major releases (x.0.0)

### Version Bumping

```bash
# Bump version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Update native versions
# iOS: Update in Xcode (MARKETING_VERSION)
# Android: Update versionCode and versionName in build.gradle
```

## Troubleshooting

### iOS Build Errors

**Error: Code signing failed**
- Solution: Verify certificates in Xcode, regenerate provisioning profiles

**Error: Pods not found**
- Solution: `cd ios && pod install --repo-update`

**Error: Hermes build failed**
- Solution: Clean build folder, `rm -rf ios/build`

### Android Build Errors

**Error: Execution failed for ':app:mergeReleaseResources'**
- Solution: Clean build, `cd android && ./gradlew clean`

**Error: Keystore not found**
- Solution: Verify keystore path in gradle.properties

**Error: Out of memory**
- Solution: Increase heap size in gradle.properties:
  ```
  org.gradle.jvmargs=-Xmx4096m
  ```

## Security Checklist

- [ ] Remove all console.log statements
- [ ] Disable Flipper in production
- [ ] Verify no API keys in code
- [ ] Enable ProGuard/R8
- [ ] Use release keystore
- [ ] Verify HTTPS for any network requests
- [ ] Test IAP with sandbox accounts
- [ ] Review permissions in Info.plist/AndroidManifest
- [ ] Implement certificate pinning (if using network)
- [ ] Add obfuscation for sensitive code

## Final Checklist

Before submitting:

- [ ] All tests passing
- [ ] No console warnings
- [ ] Tested on multiple devices
- [ ] Tested all IAP flows
- [ ] Tested offline functionality
- [ ] Tested export features
- [ ] Tested accessibility features
- [ ] Screenshots prepared
- [ ] App description written
- [ ] Privacy policy published
- [ ] Support email configured
- [ ] Marketing materials ready

## Support

For deployment issues, contact the development team or refer to official React Native documentation.
