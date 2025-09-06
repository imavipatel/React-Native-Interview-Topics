/**************************************************************
 * 📘 Obfuscation – ProGuard Rules, JS Minification
 **************************************************************/

/********************************************
 * 🟢 What is Obfuscation?
 ********************************************/
/**
 * - Obfuscation = making source code **harder to read or reverse-engineer**.
 * - In mobile apps (React Native):
 *   🔹 Protects **business logic** & **API keys** from attackers.
 *   🔹 Slows down reverse engineering (but not 100% protection).
 *   🔹 Makes compiled code smaller in size (in some cases).
 *
 * ✅ Used to harden app security along with encryption & secure storage.
 */

/********************************************
 * 🔐 JS Minification & Obfuscation
 ********************************************/
/**
 * - Metro bundler (used in React Native) already does **JS minification**:
 *   → Removes whitespace, shortens variable names, strips comments.
 *
 * - To add **extra obfuscation**:
 *   - Use tools like `babel-plugin-transform-remove-console`, `javascript-obfuscator`.
 *
 * Example (Metro config for JS Obfuscation):
 *
 * // metro.config.js
 * const { getDefaultConfig } = require("metro-config");
 *
 * module.exports = (async () => {
 *   const defaultConfig = await getDefaultConfig();
 *   return {
 *     ...defaultConfig,
 *     transformer: {
 *       ...defaultConfig.transformer,
 *       minifierConfig: {
 *         mangle: {
 *           toplevel: true,
 *         },
 *         output: {
 *           comments: false,
 *         },
 *         compress: true,
 *       },
 *     },
 *   };
 * })();
 *
 * ✅ This makes JS bundle smaller + harder to read.
 */

/********************************************
 * 🔒 ProGuard (Android)
 ********************************************/
/**
 * - ProGuard is a tool for **shrinking, obfuscating, and optimizing Java/Kotlin bytecode**.
 * - Used on Android builds to:
 *   ✅ Remove unused code (shrinking).
 *   ✅ Rename classes/methods (obfuscation).
 *   ✅ Optimize bytecode.
 *
 * - Enabled in `android/app/build.gradle`:
 *   release {
 *     minifyEnabled enableProguardInReleaseBuilds
 *     proguardFiles getDefaultProguardFile("proguard-android.txt"),
 *                   "proguard-rules.pro"
 *   }
 *
 * - File: `android/app/proguard-rules.pro`
 *
 * Example rules:
 * # Keep React Native classes
 * -keep class com.facebook.react.** { *; }
 * -keep class com.facebook.hermes.** { *; }
 *
 * # Keep Native modules
 * -keep class com.myapp.native.** { *; }
 *
 * # Don’t remove annotated methods
 * -keepclassmembers class * {
 *   @com.facebook.react.bridge.ReactMethod <methods>;
 * }
 */

/********************************************
 * 🛠️ R8 (Replacement for ProGuard)
 ********************************************/
/**
 * - R8 = newer tool from Google (enabled by default in Android builds).
 * - Faster + better optimization than ProGuard.
 * - Uses the **same rules file** (`proguard-rules.pro`).
 *
 * ✅ If you enable ProGuard, R8 is automatically used in modern builds.
 */

/********************************************
 * 🛡️ Best Practices
 ********************************************/
/**
 * ✅ JS Side:
 * - Always minify & obfuscate production bundle.
 * - Remove console logs with `babel-plugin-transform-remove-console`.
 * - Avoid hardcoding secrets in JS code (use secure storage).
 *
 * ✅ Android Side:
 * - Enable R8/ProGuard for release builds.
 * - Carefully configure `proguard-rules.pro` to avoid stripping RN classes.
 * - Test release APK thoroughly (ProGuard may strip required code).
 *
 * ✅ iOS Side:
 * - iOS apps use LLVM optimizations (no ProGuard).
 * - Use Xcode build settings for dead code stripping + bitcode.
 */

/********************************************
 * 📊 Comparison
 ********************************************/
/**
 * 🔹 JS Minification:
 *    - Works on React Native JS bundle.
 *    - Makes JS unreadable but can still be decompiled.
 *    - Prevents casual code inspection.
 *
 * 🔹 ProGuard / R8:
 *    - Works on Android native (Java/Kotlin) bytecode.
 *    - Removes unused code + obfuscates class names.
 *    - Stronger protection for native modules.
 *
 * 🔹 Together:
 *    - JS minification + ProGuard = more secure Android apps.
 *    - Still combine with secure storage + SSL pinning + obfuscation tools.
 */
