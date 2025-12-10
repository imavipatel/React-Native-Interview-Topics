/********************************************************************
 * 🔧 Resolving Build Failures & Native Dependency Issues
 * ------------------------------------------------------------------
 * JS-Style Notes — Detailed Troubleshooting Guide (New Architecture Ready)
 *
 * Covers:
 *  - Common Android / iOS build failures
 *  - Native dependency issues (Gradle, CocoaPods, NDK, linking)
 *  - TurboModules / Codegen / JSI specific problems
 *  - Quick diagnostics, commands, fixes, CI tips, and checklist
 ********************************************************************/

/* ============================================================
 * 🔹 OVERVIEW — FIRST RULES
 * ============================================================
 * - Read the build error **top-to-bottom** (first error often causes the rest).
 * - Reproduce locally before touching CI.
 * - Clean caches & rebuild (many issues are caching-related).
 * - When in doubt, run a minimal native build (no JS bundling) to isolate native vs JS.
 */

/* ============================================================
 * 🔹 COMMON LOCAL FIXES (Try in this order)
 * ============================================================
 *
 * 1) Clear Metro & Gradle & CocoaPods caches:
 *    - kill metro, clear watchman, restart machine if needed
 *
 *  Android:
 *      cd android
 *      ./gradlew clean
 *      rm -rf ~/.gradle/caches/
 *      rm -rf ~/.gradle/daemon/
 *      rm -rf android/.gradle
 *
 *  iOS:
 *      cd ios
 *      rm -rf Pods Podfile.lock
 *      pod install --repo-update
 *      xcodebuild clean
 *
 *  JS:
 *      yarn cache clean
 *      rm -rf node_modules
 *      yarn install
 *
 * 2) Rebuild:
 *    - Android: cd android && ./gradlew assembleDebug --stacktrace
 *    - iOS: open Xcode workspace and build, or xcodebuild -workspace MyApp.xcworkspace -scheme MyApp -configuration Debug build
 *
 * 3) Inspect native logs (see Logging section below).
 */

/* ============================================================
 * 🔹 ANDROID — COMMON ERRORS & RESOLUTIONS
 * ============================================================
 *
 * 1) Gradle / Dependency Resolution Errors
 *    Symptoms:
 *      - Could not resolve com.xyz:lib:version
 *      - Failed to find: com.android.support...
 *    Fixes:
 *      - Check repositories in android/build.gradle (mavenCentral(), google()).
 *      - Ensure correct dependency versions (AndroidX vs Support libs).
 *      - Run ./gradlew --refresh-dependencies
 *
 * 2) Duplicate classes / Multiple dex errors
 *    Symptoms:
 *      - com.android.dex.DexIndexOverflowException: Multiple dex files define L...
 *    Fixes:
 *      - Enable multidex:
 *         defaultConfig { multiDexEnabled true }
 *         dependencies { implementation 'com.android.support:multidex:1.0.3' }
 *      - Remove conflicting transitive dependencies (use implementation vs api).
 *      - Use dependencyInsight to find conflicts:
 *         ./gradlew :app:dependencyInsight --configuration compileClasspath --dependency <package>
 *
 * 3) ProGuard / R8 stripping required classes
 *    Symptoms:
 *      - ClassNotFoundException or NoSuchMethodError in release only
 *    Fixes:
 *      - Add keep rules in proguard-rules.pro for Reflective/Codegen classes:
 *         -keep class com.facebook.react.** { *; }
 *         -keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
 *         -keep class *Native*Module* { *; }
 *      - Rebuild with debug symbols & test release locally.
 *
 * 4) NDK / .so missing for ABI
 *    Symptoms:
 *      - java.lang.UnsatisfiedLinkError: dalvik.system.PathClassLoader...
 *    Fixes:
 *      - Ensure native libs built for target ABIs (armeabi-v7a, arm64-v8a).
 *      - Check android/app/src/main/jniLibs contains correct .so folders.
 *      - If using AAB, ensure Play will split correctly or add abiFilters in defaultConfig ndk { abiFilters ... }.
 *
 * 5) KAPT / Annotation Processor errors (Room, Dagger)
 *    Symptoms:
 *      - error: cannot find symbol generated class...
 *    Fixes:
 *      - Clean build, ensure annotation processor dependencies present.
 *      - Increase Java heap if needed (org.gradle.jvmargs = -Xmx2048m).
 *
 * 6) Gradle Plugin mismatch or Android Gradle Plugin incompatible
 *    Symptoms:
 *      - Plugin requires a newer Gradle / JDK
 *    Fixes:
 *      - Check Gradle wrapper (gradle/wrapper/gradle-wrapper.properties) and AGP version in build.gradle.
 *      - Align JDK version (use Java 11 for newer AGP).
 *
 * 7) Hermes / JSI issues
 *    Symptoms:
 *      - Crashes with 'JSI' errors or undefined HostObjects in release
 *    Fixes:
 *      - Ensure Hermes is enabled consistently and built in CI.
 *      - If precompiling Hermes bytecode, ensure runtime versions match client runtime.
 *      - Rebuild native modules with Hermes enabled; check native libs linked.
 *
 * 8) TurboModules / Codegen missing generated files
 *    Symptoms:
 *      - Cannot find symbol NativeMyModuleSpec or Codegen generated headers
 *    Fixes:
 *      - Run codegen step before native build:
 *         yarn codegen
 *      - Ensure generated files are included in Xcode/Gradle project (check paths).
 *      - Add codegen output directory to settings.gradle / Xcode project group.
 */

/* ============================================================
 * 🔹 IOS — COMMON ERRORS & RESOLUTIONS
 * ============================================================
 *
 * 1) CocoaPods / Pod install failures
 *    Symptoms:
 *      - pod install fails, missing spec/version, incompatible platform
 *    Fixes:
 *      - pod repo update / pod install --repo-update
 *      - Ensure platform :ios, '12.0' or target matches pod requirements in Podfile
 *      - Clean ~/Library/Caches/CocoaPods and Podfile.lock
 *
 * 2) Linking errors (Undefined symbols for architecture x86_64 / arm64)
 *    Symptoms:
 *      - Undefined symbols for architecture 'arm64' (linker errors)
 *    Fixes:
 *      - Check that the library/framework is added to Link Binary With Libraries
 *      - Verify Build Phases copy frameworks / run script executed
 *      - Ensure architectures supported in Build Settings (VALID_ARCHS / EXCLUDED_ARCHS)
 *
 * 3) 'No provision profile' or code signing errors in CI
 *    Symptoms:
 *      - "No profiles matching 'com.example' were found"
 *    Fixes:
 *      - Ensure correct provisioning profile & certificate are installed on CI agent
 *      - Use fastlane match or EAS credentials management
 *
 * 4) Swift/ObjC bridging header or header search paths
 *    Symptoms:
 *      - 'file not found' for generated header from codegen
 *    Fixes:
 *      - Add codegen output path to HEADER_SEARCH_PATHS or configure modulemap
 *      - Ensure .mm/.m files included in correct target
 *
 * 5) Bitcode / dSYM problems
 *    Symptoms:
 *      - Crash reports not symbolicated
 *    Fixes:
 *      - Upload dSYMs to Sentry/Crashlytics; ensure BITCODE settings consistent (Bitcode deprecated for new apps)
 *
 * 6) TurboModules / Codegen missing (iOS)
 *    Symptoms:
 *      - 'NativeMyModuleSpec.h' not found
 *    Fixes:
 *      - Run codegen and ensure generated ObjC++ headers are copied into ios project
 *      - Add script phase to run codegen in CI before pod install if needed
 */

/* ============================================================
 * 🔹 NEW ARCH (TurboModules / Fabric / JSI) SPECIFIC ISSUES
 * ============================================================
 *
 * 1) Missing Codegen outputs
 *    - Always run yarn codegen (or relevant script) in CI & locally before native build.
 *    - Include generated files in version control if your workflow requires it (or generate during CI).
 *
 * 2) HostObject lifetime crashes / memory issues
 *    - Check native HostObject implementations for proper lifetime management.
 *    - Avoid long-lived global HostObjects that reference JS objects without release.
 *
 * 3) Fabric components not registered
 *    - Ensure Fabric components are registered in the view manager factory for iOS & Android.
 *    - Rebuild both native and JS after migrating a component to Fabric.
 *
 * 4) JSI native API mismatches
 *    - Ensure C++ headers/signatures match generated bindings.
 *    - Clean and fully rebuild native modules when C++ interfaces change.
 */

/* ============================================================
 * 🔹 LOGGING & DIAGNOSTICS (HOW TO READ LOGS)
 * ============================================================
 *
 * ANDROID:
 *  - Use Gradle with stacktrace:
 *      ./gradlew assembleDebug --stacktrace --info
 *  - Inspect device logs:
 *      adb logcat *:S ReactNative:V ReactNativeJS:V chromium:V
 *  - Capture crash with logcat and tombstones (native crashes)
 *
 * IOS:
 *  - Build in Xcode → read build output (Report navigator)
 *  - Run xcodebuild with -showBuildSettings and -workspace flags
 *  - Device logs via Console.app or:
 *      idevicesyslog (libimobiledevice) or macOS Console for device logs
 *
 * GENERAL:
 *  - Check first error line (often the root cause)
 *  - For linker issues, search for "undefined symbol" or "ld: symbol(s) not found"
 *  - For dependency resolution, search for "Could not resolve"
 *  - Use grep to find where class/package is referenced across node_modules
 */

/* ============================================================
 * 🔹 CI-SPECIFIC TROUBLESHOOTES
 * ============================================================
 *
 * 1) Environment mismatch (local vs CI)
 *    - Ensure CI uses same Node, Java, Gradle, Xcode versions
 *    - Pin versions in CI or use toolchains (asdf, sdkman)
 *
 * 2) Missing secrets (keystore / p12)
 *    - CI failing due to missing signing files → ensure secrets injected & paths correct
 *
 * 3) Cache issues
 *    - CI caches stale node_modules or pods → invalidate cache after dependency upgrades
 *
 * 4) Long-running race conditions (pod install vs codegen)
 *    - Ensure codegen runs before pod install if pods reference generated headers
 */

/* ============================================================
 * 🔹 COMMON ERROR MESSAGES & QUICK FIXES
 * ============================================================
 *
 * ERROR: "package ... is not a dependency of project :app"
 *  → Add dependency in settings.gradle / include project(':lib')
 *
 * ERROR: "ReactNativeHost.getPackages() missing" or duplicate packages
 *  → Remove manual MainPackage additions if autolinking used; avoid double registration
 *
 * ERROR: "gradle.properties must be UTF-8"
 *  → Ensure files have correct encoding; remove special chars
 *
 * ERROR: "Undefined symbol: _kSomeSymbol"
 *  → Missing framework in Link Binary With Libraries or missing -ObjC linker flag for categories; add -ObjC to Other Linker Flags
 *
 * ERROR: "DYLD_LIBRARY_PATH"/'Library not loaded' on iOS Simulator
 *  → Rebuild pods; ensure frameworks built for simulator arch (x86_64 / arm64-sim)
 *
 * ERROR: "react-native: command not found" in CI
 *  → Use npx react-native or ensure PATH includes node_modules/.bin in CI steps
 */

/* ============================================================
 * 🔹 DEBUGGING TACTICS (Advanced)
 * ============================================================
 *
 * 1) Binary search for failing commit:
 *    - If build broke after multiple commits, bisect to find commit that introduced regression.
 *
 * 2) Minimal reproduction:
 *    - Create a tiny native-only sample that reproduces the linker or codegen problem.
 *
 * 3) Inspect AAR / Podspec contents:
 *    - unzip AAR, inspect classes.jar for missing classes
 *    - open .framework to inspect exported headers
 *
 * 4) Use nm / readelf to inspect .so symbols and architectures
 *
 * 5) Compare working vs failing environment:
 *    - diff gradle.lock, Podfile.lock, node_modules versions, build-tools version
 */

/* ============================================================
 * 🔹 BEST PRACTICES TO AVOID FUTURE ISSUES
 * ============================================================
 *
 * - Automate codegen in pre-build step (local & CI): yarn codegen
 * - Pin dependency versions and lockfiles; update in controlled PRs
 * - Add smoke tests for debug & release builds in CI
 * - Keep a reproducible local dev environment (Docker for Linux builds / devcontainer)
 * - Document manual linking steps and include fast-check scripts to verify
 * - Use Fastlane / EAS to manage signing & provisioning consistently
 * - Keep ProGuard/R8 rules updated when adding libraries that use reflection
 * - Test ABI coverage: run on arm64 & armeabi-v7a devices/emulators
 *
 * Add a "release check" CI job:
 *  - run codegen
 *  - pod install --repo-update
 *  - ./gradlew assembleRelease
 *  - xcodebuild -workspace ... -scheme ... archive
 *
 * This catches most native problems early.
 */

/* ============================================================
 * 🔹 TROUBLESHOOTING CHECKLIST (Copyable)
 * ============================================================
 * 1. Reproduce locally. Run clean builds:
 *    - yarn install && yarn codegen && cd ios && pod install --repo-update && cd .. && cd android && ./gradlew clean assembleDebug --stacktrace
 * 2. If error persists:
 *    - Inspect first error line and stacktrace
 *    - Search project & node_modules for offending class / package
 *    - Run ./gradlew :app:dependencies to inspect dependency tree
 * 3. Fix common issues:
 *    - Add missing repo / dependency versions
 *    - Add ProGuard keep rules if class stripped
 *    - Ensure native libs built for all ABIs
 *    - Run yarn codegen and include generated files
 * 4. CI checks:
 *    - Ensure secrets available
 *    - Clear caches and rebuild
 * 5. If stuck:
 *    - Create minimal repro and ask teammate / library maintainer with logs + steps
 *
 * ============================================================
 * 🔹 QUICK Q&A (INTERVIEW READY)
 * ============================================================
 * Q: Why does release build fail but debug build passes?
 * A: Often due to minification (R8/ProGuard) stripping reflective classes, or different resource/shrinking behavior. Check ProGuard rules and test release locally.
 *
 * Q: What causes UnsatisfiedLinkError for a .so?
 * A: Missing native library for that ABI or wrong packaging (AAB/APK differences). Ensure .so is packaged for target ABI.
 *
 * Q: How to fix 'NativeMyModuleSpec' not found?
 * A: Run codegen and ensure generated headers/class files are included in native project and that codegen step runs prior to native build.
 *
 * Q: Steps to debug iOS linking issues?
 * A: Clean pods, pod install --repo-update, ensure frameworks added to Link Binary With Libraries, check Header Search Paths & Other Linker Flags (-ObjC).
 *
 * ============================================================
 */
