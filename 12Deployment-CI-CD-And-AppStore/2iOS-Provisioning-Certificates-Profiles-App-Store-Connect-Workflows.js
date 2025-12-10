/********************************************************************
 * 🍏 iOS Provisioning – Certificates, Profiles & App Store Connect
 * ------------------------------------------------------------------
 * JS-Style Notes (Complete + Beginner-Friendly + New Architecture Ready)
 ********************************************************************/

/**
 * ============================================================
 * 🔹 WHY IS IOS PROVISIONING HARD?
 * ============================================================
 *
 * iOS apps **must** be cryptographically signed AND authorized:
 * 1) WHO can build the app? → Certificates
 * 2) WHAT devices can run the app? → Provisioning Profiles
 * 3) WHAT app identifier is allowed? → App ID / Bundle ID
 * 4) WHO can publish on the App Store? → App Store Connect
 *
 * Apple uses a strict security model:
 * - Developer identity → Certificate (private key)
 * - Device authorization → UDID + Provisioning Profile
 * - App identity → App ID
 * - Distribution → Store profile + App Store Connect metadata
 *
 * 🔐 If any part mismatches → iOS build fails.
 */

/**
 * ============================================================
 * 🔹 CERTIFICATES (Developer, Distribution)
 * ============================================================
 *
 * Certificates prove the identity of the developer or CI system.
 *
 * TYPES OF CERTIFICATES:
 * ----------------------------------
 * 1) **Development Certificate**
 *    - Used for debug builds
 *    - Allows installation on registered devices
 *
 * 2) **Distribution Certificate**
 *    - Used for release builds
 *    - Required for TestFlight + App Store
 *
 * 3) **Apple Distribution (Recommended by Apple)**
 *    - Replaces legacy “iOS Distribution”
 *    - Used to sign App Store & AdHoc builds
 *
 * HOW TO GENERATE CERTIFICATE:
 * ----------------------------------
 * 1. Open Keychain Access → Certificate Assistant
 * 2. Request a certificate → Generate CSR (certificate signing request)
 * 3. Upload CSR to Apple Developer Account
 * 4. Download certificate (.cer)
 * 5. Install → adds certificate + private key to Keychain
 *
 * NOTE:
 * - The **private key must be backed up** (CI/CD requires exporting .p12).
 * - Losing private key = must revoke certificate → breaks existing profiles.
 */

/**
 * ============================================================
 * 🔹 APP IDs (Identifiers)
 * ============================================================
 *
 * App ID format:
 *    com.company.myapp
 *
 * TYPES:
 * 1) Explicit App ID → one specific app only
 *    e.g., com.avi.financeapp
 *
 * 2) Wildcard App ID → Debug/testing only
 *    e.g., com.avi.*
 *
 * CAPABILITIES BOUND TO APP IDs:
 * - Push Notifications
 * - Sign In with Apple
 * - App Groups
 * - Keychain Sharing
 * - In-app Purchase
 * - Background Modes
 *
 * Activating a capability → updates App ID + requires new provisioning profile.
 */

/**
 * ============================================================
 * 🔹 PROVISIONING PROFILES
 * ============================================================
 *
 * Profiles **bind**:
 *    Certificate + App ID + Devices + Capabilities
 *
 * TYPES:
 * ----------------------------------
 * 1) **iOS Development Profile**
 *    - Required for debug builds
 *    - Includes device UDIDs
 *
 * 2) **Ad Hoc Profile**
 *    - Distribution outside App Store
 *    - Limited to registered devices (up to 100)
 *
 * 3) **App Store Profile**
 *    - Used for App Store builds
 *    - NO devices included
 *
 * 4) **Enterprise Profile (MDM apps)**
 *    - Internal distribution for orgs (no store)
 *
 * HOW IT WORKS:
 * - Xcode selects profile based on:
 *    bundleIdentifier + certificate type
 *
 * - React Native build system uses Xcode config:
 *    Signing → Automatically manage signing (recommended)
 */

/**
 * ============================================================
 * 🔹 DEVICE REGISTRATION (For Development Builds)
 * ============================================================
 *
 * For Debug builds → device UDID must be registered.
 *
 * Steps:
 * 1. Plug device → Finder → Copy UDID
 * 2. Add to Apple Developer → Devices
 * 3. Regenerate development provisioning profile
 *
 * CI/CD TIP:
 * - Use `eas device:create` (Expo) or `fastlane register_device` for automation.
 */

/**
 * ============================================================
 * 🔹 APP STORE CONNECT WORKFLOWS
 * ============================================================
 *
 * Once the App Store profile is ready:
 *
 * STEP 1 — Create App Entry
 * -------------------------
 * - App Store Connect → "My Apps" → New App
 * - Enter:
 *    • Name
 *    • SKU
 *    • Bundle ID (must match Provisioning Profile)
 *    • Platform: iOS
 *
 * STEP 2 — Upload Build
 * -------------------------
 * - Upload via:
 *    • Xcode Archive → Distribute → App Store Connect
 *    • fastlane deliver
 *    • EAS Submit (Expo)
 *
 * STEP 3 — App Metadata
 * -------------------------
 * Required info:
 * - App description
 * - Screenshots (iPhone 6.7", 6.1", iPad)
 * - Keywords
 * - Support URL
 * - Privacy policy URL
 *
 * STEP 4 — App Review Settings
 * -------------------------
 * - App Privacy (Data usage types)
 * - Tracking Transparency settings
 * - Age Rating
 * - Pricing
 *
 * STEP 5 — Submit for Review
 * -------------------------
 * - Manual or auto-release
 * - Standard review takes 24–72 hours
 *
 * After approval → live on App Store 🎉
 */

/**
 * ============================================================
 * 🔹 AUTOMATED SIGNING (Recommended)
 * ============================================================
 *
 * OPTION A → Xcode Automatic Signing
 * - Easiest for solo developers or small teams
 * - Xcode manages certificates + profiles automatically
 *
 * OPTION B → fastlane match (Team Oriented)
 * - Syncs provisioning profiles & certificates across team
 * - Stores encrypted files in Git
 *
 * OPTION C → EAS Build (Expo)
 * - Server-side signing
 * - No need for local certificates
 */

/**
 * ============================================================
 * 🔹 REACT NATIVE NEW ARCHITECTURE NOTES (Fabric / TurboModules)
 * ============================================================
 *
 * - New Arch uses:
 *    • iOS frameworks
 *    • C++ codegen modules
 *    • Hermes engine by default
 *
 * Provisioning differences:
 * - All Xcode targets (including Fabric + Bridgeless targets) must be signed.
 * - Custom TurboModule native frameworks must be included in the provisioning profile.
 * - For enterprise apps → must include new extension entitlements if using:
 *      • Background modes
 *      • Live Activities
 *      • Push Notifications
 *
 * Build Settings:
 * - Enable “Generate Debug Symbols” for crash logs (dSYM)
 * - Add entitlements for:
 *      → Keychain Sharing
 *      → App Groups
 *      → Push Notifications
 */

/**
 * ============================================================
 * 🔹 CICD WORKFLOW (fastlane Example)
 * ============================================================
 */
//
// fastlane gym \
//   --scheme "MyApp" \
//   --archive_path ./build/MyApp.xcarchive \
//   --export_method app-store \
//   --export_options_plist ExportOptions.plist
//
// fastlane deliver --submit_for_review
//
// - Best for large teams + automated pipelines.
//

/**
 * ============================================================
 * 🔹 TROUBLESHOOTING
 * ============================================================
 *
 * ❌ Error: "No provisioning profile found"
 * → The profile does not match bundle ID or certificate type.
 *
 * ❌ Error: "Code signing is required"
 * → Certificate private key missing → reinstall .p12 file.
 *
 * ❌ App rejected for Missing Privacy Details
 * → Complete App Privacy Questionnaire in App Store Connect.
 *
 * ❌ Device cannot install debug build
 * → Device UDID missing in profile → add + regenerate.
 *
 * ❌ Push Notifications not working
 * → Add Push capability to App ID → regenerate provisioning profile.
 */

/**
 * ============================================================
 * 🔹 INTERVIEW QUICK ANSWERS
 * ============================================================
 *
 * Q: What is the difference between a certificate and a provisioning profile?
 * A: Certificate = WHO can build; Profile = WHICH device & WHICH app.
 *
 * Q: Why does iOS require signing?
 * A: To protect users & validate developer identity.
 *
 * Q: What is an App Store provisioning profile?
 * A: A profile used specifically for uploading builds to the App Store.
 *
 * Q: Why do we need an App ID?
 * A: It defines app features/capabilities and links them to provisioning profiles.
 *
 * Q: What is the simplest workflow?
 * A: Use Xcode’s automatic signing + App Store Connect upload.
 *
 * ============================================================
 */
