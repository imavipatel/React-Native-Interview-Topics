/********************************************************************
 * 📦 Android Build Types & Distribution (Debug, Release, Signing, ABI / App Bundle splits)
 * -------------------------------------------------------------------------
 * JS-Style Notes (New-Arch friendly) — everything you need to know for Android builds
 ********************************************************************/

/**
 * ============================================================
 * 🔹 OVERVIEW
 * ============================================================
 *
 * - Android build pipeline produces either APK(s) or AAB (Android App Bundle).
 * - Typical build types:
 *    • debug  — for local dev (debuggable, not optimized).
 *    • release — for publishing (minified, optimized, signed).
 * - Key distribution concepts:
 *    → Signing Configs (keystore, key alias)
 *    → ProGuard / R8 (minify + obfuscate)
 *    → ABI splits (reduce binary size per CPU architecture)
 *    → App Bundle (AAB) — recommended: Play Store serves optimized APKs
 *
 * - New-Arch (TurboModules/Fabric) → ensure native libs included correctly per ABI & bundle config.
 */

/**
 * ============================================================
 * 🔹 BUILD TYPES (android/app/build.gradle)
 * ============================================================
 *
 * - buildTypes define how the APK/AAB is built (flags, signing, optimization).
 * - Typical minimal config:
 */
//
// android {
//   buildTypes {
//     debug {
//       applicationIdSuffix ".debug"
//       versionNameSuffix "-dev"
//       debuggable true
//       minifyEnabled false
//     }
//     release {
//       debuggable false
//       minifyEnabled true          // enable R8/ProGuard
//       shrinkResources true        // remove unused resources
//       proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
//       signingConfig signingConfigs.release
//     }
//   }
// }
//
/**
 * - use minifyEnabled + shrinkResources for release to reduce size.
 * - Keep a proguard-rules.pro to keep native module/etc. required classes.
 * - test debug & release thoroughly (release can break reflection / codegen).
 */

/**
 * ============================================================
 * 🔹 SIGNING CONFIGS (keystore, upload key)
 * ============================================================
 *
 * - Signing is mandatory for Android apps (all APKs/AABs must be signed).
 * - Two common flows:
 *   1) Sign the release artifact with your **upload key** and let Play re-sign (Play App Signing).
 *   2) Sign directly with app signing key (less common now).
 *
 * - Example signing config (gradle) and secure storage pattern:
 */
//
// android {
//   signingConfigs {
//     release {
//       keyAlias keystoreProperties['keyAlias']
//       keyPassword keystoreProperties['keyPassword']
//       storeFile file(keystoreProperties['storeFile'])
//       storePassword keystoreProperties['storePassword']
//     }
//   }
// }
//
/**
 * - Often keep secrets in a `keystore.properties` file (not committed) and load in build.gradle:
 *    def keystoreProperties = new Properties()
 *    keystoreProperties.load(new FileInputStream(rootProject.file("keystore.properties")))
 *
 * - Key generation (local): use keytool
 *   keytool -genkeypair -v -keystore release.keystore -alias mykey -keyalg RSA -keysize 2048 -validity 10000
 *
 * - Signing APK (old flow):
 *   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release.keystore app-release-unsigned.apk mykey
 *   zipalign -v -p 4 app-release-unsigned.apk app-release-unsigned-aligned.apk
 *   apksigner sign --ks release.keystore --out app-release-signed.apk app-release-unsigned-aligned.apk
 *
 * - For AAB: you upload the signed AAB to Play Console (signed with upload key); Play handles distribution signing.
 *
 * - **Best practice**: back up keystore + upload key securely (lost key = cannot update app on Play).
 */

/**
 * ============================================================
 * 🔹 APK vs AAB (App Bundle)
 * ============================================================
 *
 * APK:
 *  - Single binary containing all resources / ABIs (can be large).
 *  - You can distribute directly (sideloading).
 *
 * AAB (Android App Bundle):
 *  - Bundle containing all code & resources; Play generates optimized APKs per device (split by ABI, language, density).
 *  - Benefits:
 *     • Smaller installs for end-users
 *     • Supports dynamic feature modules
 *  - For testing locally: use bundletool to generate device-specific APKs:
 *      bundletool build-apks --bundle=app.aab --output=app.apks --mode=universal
 *      bundletool install-apks --apks=app.apks
 *
 * - Google Play: new apps are expected to be uploaded as AAB (Play then serves optimized APKs).
 */

/**
 * ============================================================
 * 🔹 ABI SPLITS & NATIVE LIBS
 * ============================================================
 *
 * Why ABI splits?
 *  - Native libraries (.so) exist per CPU ABI (armeabi-v7a, arm64-v8a, x86, x86_64).
 *  - Shipping all ABIs in single APK increases size.
 *
 * Two approaches:
 *  1) Use App Bundle — Play will split per ABI automatically (recommended).
 *  2) Create APK splits in Gradle (manual) — produce per-ABI APKs.
 *
 * Gradle example: APK splits (legacy)
 */
//
// android {
//   splits {
//     abi {
//       enable true
//       reset()
//       include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
//       universalApk false // false → don't produce the universal APK
//     }
//   }
// }
///
/**
 * - When using splits + flavors, you will get multiple APKs (careful with versionCode).
 * - If you ship multiple APKs on Play manually, ensure unique versionCode for each ABI (or prefer AAB).
 *
 * For native modules built with NDK, you can restrict ABIs at packaging:
 */
// android {
//   defaultConfig {
//     ndk {
//       abiFilters "arm64-v8a", "armeabi-v7a"  // limit supported ABIs
//     }
//   }
// }
///
/**
 * - New-Arch note: ensure native libraries for TurboModules / JSI are built for all ABIs you support.
 */

/**
 * ============================================================
 * 🔹 VERSION CODES & MULTIPLE APKS
 * ============================================================
 *
 * - When building multiple APKs (ABI or density splits), Play expects unique versionCode per APK.
 * - Gradle can auto-append ABI suffix to versionCode:
 */
//
// android {
//   defaultConfig {
//     versionCode 100
//   }
//   splits.abi. ... // as above
//   android.applicationVariants.all { variant ->
//     variant.outputs.each { output ->
//       def abi = output.getFilter(com.android.build.OutputFile.ABI)
//       if (abi != null) {
//         output.versionCodeOverride = defaultConfig.versionCode * 1000 + abiCodeMap[abi]
//       }
//     }
//   }
// }
///
/**
 * - Simpler: avoid manual APK splits and use AAB to let Play handle this.
 */

/**
 * ============================================================
 * 🔹 BUILD OPTIMIZATIONS (release)
 * ============================================================
 *
 * - minifyEnabled true  → enables R8 (shrink, obfuscate)
 * - shrinkResources true → remove unused resources (images, strings)
 * - proguardFiles(...)   → add rules to keep required classes (React Native / TurboModules)
 *
 * Example proguard rules to keep RN pieces:
 * -keep class com.facebook.react.** { *; }
 * -keep class com.facebook.jni.** { *; }
 * -keepclassmembers class * {
 *     @com.facebook.react.bridge.ReactMethod <methods>;
 * }
 *
 * - Upload mapping.txt (ProGuard/R8) to Play Console to deobfuscate stack traces.
 */

/**
 * ============================================================
 * 🔹 BUILD & RELEASE WORKFLOW (practical)
 * ============================================================
 *
 * 1) Prepare release keystore & add signingConfig to gradle.
 * 2) Set minifyEnabled true, add proguard-rules.pro, test release locally.
 * 3) Build bundle (preferred):
 *    ./gradlew bundleRelease         // produces app-release.aab
 * 4) (Optional) build APK for local testing:
 *    ./gradlew assembleRelease      // produces app-release.apk (universal, large)
 * 5) Test signed artifact on devices/emulators of different ABIs.
 * 6) Upload AAB to Google Play Console (use Play App Signing).
 * 7) Monitor crash reports & upload mapping files.
 */

/**
 * ============================================================
 * 🔹 SIGNING SCHEMES: v1 / v2 / v3 / v4
 * ============================================================
 *
 * - Android supports multiple APK signing schemes:
 *   • v1 (JAR signing) — legacy (Android 4.x)
 *   • v2 — APK Signature Scheme v2 (introduced Android 7.0) — signs whole APK (faster/safer)
 *   • v3 — adds rotation support (Android 9+)
 *   • v4 — incremental install (play-specific)
 *
 * - Tools (apksigner) default to supporting modern schemes (v2/v3). For AAB, Play resigns and uses appropriate scheme.
 *
 * Example apksigner:
 * apksigner sign --ks release.keystore --ks-pass pass:storepass --key-pass pass:keypass app.apk
 *
 * - Ensure you sign using apksigner from Android build tools (not jarsigner for modern schemes).
 */

/**
 * ============================================================
 * 🔹 FLAVORS, VARIANTS & BUILD TYPES (example)
 * ============================================================
 *
 * - productFlavors allow multiple builds from same code (free/pro, staging/prod).
 * - Combined with buildTypes → many build variants (flavorDebug, flavorRelease).
 *
 * Example:
 */
//
// android {
//   flavorDimensions "tier"
//   productFlavors {
//     free { dimension "tier"; applicationIdSuffix ".free" }
//     paid { dimension "tier"; applicationIdSuffix ".paid" }
//   }
//   buildTypes { debug {...} release {...} }
// }
//
/**
 * - Signing & proguard can be configured per flavor or variant.
 * - Keep credentials per environment out of source control (keystore.properties).
 */

/**
 * ============================================================
 * 🔹 PLAY STORE / RELEASE NOTES (practical tips)
 * ============================================================
 *
 * - Always test release on physical devices across ABIs & Android versions.
 * - Upload mapping (ProGuard) + native debug symbols (ndk symbol files) for native crash deobfuscation.
 * - Use Play App Signing: upload an **upload key** and let Google manage the **app signing key**.
 * - Maintain changelog & use staged rollouts to detect issues early.
 */

/**
 * ============================================================
 * 🔹 TROUBLESHOOTING CHECKLIST
 * ============================================================
 *
 * • Release build crashes but debug OK?
 *    → Likely proguard/R8 stripping something → add keep rules and test.
 * • Missing native library on some devices?
 *    → ABI packaging issue — ensure .so present for that ABI or restrict supported ABIs.
 * • App too large?
 *    → Use AAB (recommended) and enable code/resource shrinking, remove unused native libs, compress assets.
 * • Cannot update app on Play console?
 *    → Check signing key; must sign updates with same key (or use Play App Signing upload key flow).
 */

/**
 * ============================================================
 * 🔹 QUICK Q&A (INTERVIEW-READY)
 * ============================================================
 *
 * Q: Why prefer AAB over APK?
 * A: AAB lets Play produce device-optimized APKs (smaller installs, dynamic features).
 *
 * Q: What is minifyEnabled vs shrinkResources?
 * A: minifyEnabled runs R8 to shrink/obfuscate code. shrinkResources removes unused resources after code shrinking.
 *
 * Q: What is Play App Signing?
 * A: Google manages the final app signing key; you upload an 'upload key' signed bundle and Play signs the distributed APKs.
 *
 * Q: How to handle native libs for multiple ABIs?
 * A: Build native libs for all target ABIs, prefer AAB (Play will split), or use ABI splits with unique versionCode per APK.
 *
 * Q: How to generate keystore locally?
 * A: keytool -genkeypair -v -keystore release.keystore -alias mykey -keyalg RSA -keysize 2048 -validity 10000
 *
 * ============================================================
 */
