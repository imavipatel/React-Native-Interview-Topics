/********************************************************************
 * 🚀 Fastlane, EAS Build & Automatic Versioning
 * ------------------------------------------------------------------
 * JS-Style Notes — Complete, Beginner-Friendly, New Architecture Ready
 ********************************************************************/

/**
 * ====================================================================
 * 🔹 WHY DO WE NEED BUILD AUTOMATION?
 * ====================================================================
 *
 * Mobile apps require repeated tasks:
 *  - Incrementing version codes (Android) & versions (iOS)
 *  - Generating release builds (APK/AAB / IPA)
 *  - Uploading to Play Store / App Store
 *  - Signing, provisioning, changelogs, screenshots
 *
 * Tools that automate this:
 *   ✔ Fastlane (iOS + Android automation)
 *   ✔ EAS Build (cloud builds for RN & Expo)
 *   ✔ Scripts for automatic versioning (CI/CD)
 *
 * Automation = fewer mistakes + faster releases + consistent builds.
 */

/********************************************************************
 * 🔹 FASTLANE — The Most Used Automation Tool For iOS + Android
 ********************************************************************/

/**
 * ====================================================================
 * 1️⃣ What is Fastlane?
 * ====================================================================
 *
 * - A CLI tool used for:
 *   ✔ signing
 *   ✔ building apps
 *   ✔ uploading to stores
 *   ✔ taking screenshots
 *   ✔ versioning
 *   ✔ managing provisioning profiles (match)
 *
 * - Works perfectly with React Native (bare or new architecture).
 */

/**
 * ====================================================================
 * 2️⃣ Fastlane Setup
 * ====================================================================
 */
//
// cd android && fastlane init
// cd ios && fastlane init
//

/**
 * Fastlane creates:
 *  - Fastfile  → defines actions (build, upload, sign)
 *  - Appfile   → app metadata (bundle ID, Apple ID)
 */

/**
 * ====================================================================
 * 3️⃣ Fastlane Build Example (Android)
 * ====================================================================
 */
//
// lane :android_release do
//   gradle(
//     task: "bundle",
//     build_type: "Release"
//   )
//   upload_to_play_store(track: "internal")
// end
//

/**
 * - Produces AAB
 * - Uploads directly to Google Play Internal Track
 */

/**
 * ====================================================================
 * 4️⃣ Fastlane Build Example (iOS)
 * ====================================================================
 */
//
// lane :ios_release do
//   increment_version_number(bump_type: "patch")
//   build_app(scheme: "MyApp")
//   upload_to_app_store(skip_screenshots: true, skip_metadata: true)
// end
//

/**
 * - Xcode archive
 * - Uploads to App Store Connect
 */

/**
 * ====================================================================
 * 5️⃣ Fastlane Match (Certificate Management)
 * ====================================================================
 *
 * match:
 *  - Centralizes certificates & provisioning profiles
 *  - Stores encrypted files in Git repo
 *
 * Example:
 */
// fastlane match development
// fastlane match appstore
//

/**
 * Great for teams: everyone uses SAME certs without conflicts.
 */

/********************************************************************
 * 🔹 EAS BUILD (Expo Application Services)
 ********************************************************************/

/**
 * ====================================================================
 * 1️⃣ What is EAS Build?
 * ====================================================================
 *
 * - Cloud-based mobile builds for React Native (Expo or bare).
 * - No need for Xcode/Android Studio locally.
 * - Handles:
 *    ✔ Signing
 *    ✔ Provisioning profiles
 *    ✔ Automatic versioning
 *    ✔ OTA updates (EAS Update)
 *
 * Works with **React Native New Architecture** perfectly.
 */

/**
 * ====================================================================
 * 2️⃣ EAS Build Example
 * ====================================================================
 */
//
// eas build --platform ios
// eas build --platform android
//

/**
 * Config in eas.json:
 */
//
// {
//   "build": {
//     "production": {
//       "ios": { "simulator": false },
//       "android": { "buildType": "app-bundle" }
//     }
//   }
// }
//

/**
 * EAS automates:
 *  - Signing (upload key/keystore)
 *  - Credentials management
 *  - App Store + Play Store uploads
 */

/********************************************************************
 * 🔹 AUTOMATIC VERSIONING (iOS + Android)
 ********************************************************************/

/**
 * ====================================================================
 * How versioning works on each platform?
 * ====================================================================
 *
 * ANDROID:
 *   versionName → user visible (1.0.3)
 *   versionCode → integer, REQUIRED for Play Store (must increase every build)
 *
 * iOS:
 *   CFBundleShortVersionString → user visible (1.0.3)
 *   CFBundleVersion → build number (must increase every release)
 *
 * AUTOMATED VERSIONING avoids:
 *   - Manual mistakes
 *   - Duplicate version conflicts
 *   - CI/CD failures
 */

/**
 * ====================================================================
 * 1️⃣ Auto-Versioning in Fastlane
 * ====================================================================
 */
//
// lane :release do
//   increment_build_number
//   increment_version_number(bump_type: "patch")
//   build_app
//   upload_to_app_store
// end
//

/**
 * bump_type can be: patch, minor, major
 */

/**
 * ====================================================================
 * 2️⃣ Auto-Versioning in Android (Gradle)
 * ====================================================================
 */
// android/app/build.gradle
//
// versionCode Integer.parseInt(System.currentTimeMillis().toString().takeLast(8))
// versionName "1.0.${System.getenv("BUILD_NUMBER") ?: "0"}"
//

/**
 * Example:
 * - Every CI build creates a unique versionCode
 */

/**
 * ====================================================================
 * 3️⃣ Auto-Versioning in EAS Build
 * ====================================================================
 *
 * eas.json:
 */
//
// {
//   "build": {
//     "production": {
//       "autoIncrement": true
//     }
//   }
// }
//

/**
 * EAS autoIncrement supports:
 *  • "version" → increment patch version
 *  • "buildNumber" → only increment build number
 */

/********************************************************************
 * 🔹 CI/CD Integration (GitHub Actions Example)
 ********************************************************************/
/*
```yaml
name: Build

jobs:
  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: yarn install
      - run: eas build --platform android --non-interactive

      /**

CI/CD BENEFITS:

Build automation

Testing

Auto-versioning

Faster releases

Team collaboration
*/

/********************************************************************

🔹 INTERVIEW QUICK ANSWERS

Q: Difference between Fastlane and EAS Build?

A:

Fastlane → Local automation + store upload + signing + metadata.

EAS Build → Cloud build + managed signing + OTA updates.

Q: Why use automatic versioning?

A:

Prevent Play Store rejection (same versionCode)

Simplify releases

Integrate with CI/CD

Q: Should I choose AAB or APK?

A:

AAB for Play Store (optimized APK delivery)

APK only for internal/testing

********************************************************************/
