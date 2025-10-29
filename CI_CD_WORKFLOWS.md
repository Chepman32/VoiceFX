# CI/CD Workflow Configurations

Due to GitHub permissions, the workflow files need to be added manually or through the GitHub UI.

## Setup Instructions

1. Create `.github/workflows/` directory in your repository
2. Create two files: `ci.yml` and `release.yml`
3. Copy the content below into each file

---

## File: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop, 'claude/**']
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run type-check

      - name: Check formatting
        run: npx prettier --check "src/**/*.{ts,tsx}"

  test:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  build-ios:
    name: Build iOS
    runs-on: macos-latest
    needs: [lint, test]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
          bundler-cache: true

      - name: Install dependencies
        run: npm ci

      - name: Install CocoaPods
        run: |
          cd ios
          pod install
          cd ..

      - name: Build iOS app
        run: |
          cd ios
          xcodebuild -workspace VoiceFX.xcworkspace \
            -scheme VoiceFX \
            -configuration Debug \
            -sdk iphonesimulator \
            -destination 'platform=iOS Simulator,name=iPhone 14' \
            clean build \
            CODE_SIGNING_ALLOWED=NO

  build-android:
    name: Build Android
    runs-on: ubuntu-latest
    needs: [lint, test]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Install dependencies
        run: npm ci

      - name: Setup Gradle
        uses: gradle/gradle-build-action@v2

      - name: Build Android app
        run: |
          cd android
          ./gradlew assembleDebug --no-daemon

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk

  e2e-ios:
    name: E2E Tests (iOS)
    runs-on: macos-latest
    needs: [build-ios]
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install CocoaPods
        run: |
          cd ios
          pod install
          cd ..

      - name: Install Detox CLI
        run: npm install -g detox-cli

      - name: Build for Detox
        run: detox build --configuration ios.sim.debug

      - name: Run E2E tests
        run: detox test --configuration ios.sim.debug --cleanup

      - name: Upload test artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-test-artifacts
          path: e2e/artifacts

  security:
    name: Security Audit
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD

  analyze:
    name: Code Analysis
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        continue-on-error: true
```

---

## File: `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  create-release:
    name: Create GitHub Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Generate changelog
        id: changelog
        uses: metcalfc/changelog-generator@v4.0.0
        with:
          myToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: false

  build-ios-release:
    name: Build & Deploy iOS
    runs-on: macos-latest
    needs: [create-release]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
          bundler-cache: true

      - name: Install dependencies
        run: npm ci

      - name: Install CocoaPods
        run: |
          cd ios
          pod install
          cd ..

      - name: Setup fastlane
        run: |
          cd ios
          bundle install
          cd ..

      - name: Build & upload to TestFlight
        env:
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          FASTLANE_PASSWORD: ${{ secrets.FASTLANE_PASSWORD }}
          APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}
        run: |
          cd ios
          bundle exec fastlane beta
          cd ..

  build-android-release:
    name: Build & Deploy Android
    runs-on: ubuntu-latest
    needs: [create-release]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Install dependencies
        run: npm ci

      - name: Decode keystore
        env:
          ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
        run: |
          echo $ANDROID_KEYSTORE_BASE64 | base64 -d > android/app/voicefx-release.keystore

      - name: Build release bundle
        env:
          VOICEFX_RELEASE_STORE_PASSWORD: ${{ secrets.VOICEFX_RELEASE_STORE_PASSWORD }}
          VOICEFX_RELEASE_KEY_PASSWORD: ${{ secrets.VOICEFX_RELEASE_KEY_PASSWORD }}
        run: |
          cd android
          ./gradlew bundleRelease
          cd ..

      - name: Upload to Play Console
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
          packageName: com.voicefx
          releaseFiles: android/app/build/outputs/bundle/release/app-release.aab
          track: internal
          status: completed

  notify:
    name: Notify Team
    runs-on: ubuntu-latest
    needs: [build-ios-release, build-android-release]
    if: always()

    steps:
      - name: Send Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            Release ${{ github.ref }} deployment completed!
            iOS: ${{ needs.build-ios-release.result }}
            Android: ${{ needs.build-android-release.result }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

---

## Required GitHub Secrets

For the workflows to function properly, configure these secrets in GitHub:

### iOS Secrets:
- `MATCH_PASSWORD` - Fastlane match password
- `FASTLANE_PASSWORD` - Apple ID password
- `APP_STORE_CONNECT_API_KEY` - App Store Connect API key

### Android Secrets:
- `ANDROID_KEYSTORE_BASE64` - Base64 encoded release keystore
- `VOICEFX_RELEASE_STORE_PASSWORD` - Keystore password
- `VOICEFX_RELEASE_KEY_PASSWORD` - Key password
- `GOOGLE_PLAY_SERVICE_ACCOUNT` - Service account JSON

### Additional Secrets:
- `SONAR_TOKEN` - SonarCloud token (optional)
- `SLACK_WEBHOOK` - Slack webhook URL for notifications (optional)

---

## Setup Steps

1. Go to GitHub repository Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add each secret listed above
4. Create the workflow files manually or via GitHub UI
5. Push code to trigger the CI pipeline

---

## Testing the Workflows

### Test CI:
```bash
git push origin your-branch
```

### Test Release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Notes

- The workflows are configured for both iOS and Android
- E2E tests only run on pull requests to save CI time
- Release workflow triggers on version tags (v*)
- All builds require passing tests first
- Security audit runs on every push
