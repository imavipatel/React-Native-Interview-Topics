/**************************************************************
 * 📘 Permission Handling Best Practices (React Native)
 **************************************************************/

/********************************************
 * 🟢 Why Permissions Matter?
 ********************************************/
/**
 * - Mobile apps often need access to **sensitive data/features**:
 *   📷 Camera, 📍 Location, 🎤 Microphone, 📁 Storage, etc.
 *
 * - Improper permission handling leads to:
 *   ❌ App Store / Play Store rejection
 *   ❌ Privacy/security risks
 *   ❌ Bad user experience
 *
 * ✅ Best practice: Request only the permissions you need,
 *   explain clearly to users, and handle denials gracefully.
 */

/********************************************
 * 🔧 Handling Permissions in React Native
 ********************************************/
/**
 * - React Native itself doesn’t provide full permission handling.
 * - Commonly used library: `react-native-permissions`
 *
 * Install:
 *   npm install react-native-permissions
 *
 * Usage:
 *   import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
 *
 * Example: Request Camera Permission
 *   async function requestCameraPermission() {
 *     const result = await request(
 *       Platform.OS === "ios"
 *         ? PERMISSIONS.IOS.CAMERA
 *         : PERMISSIONS.ANDROID.CAMERA
 *     );
 *
 *     if (result === RESULTS.GRANTED) {
 *       console.log("Camera permission granted");
 *     } else {
 *       console.log("Camera permission denied");
 *     }
 *   }
 */

/********************************************
 * 🛡️ Best Practices for Permission Handling
 ********************************************/
/**
 * 1️⃣ Ask only when needed
 * - Don’t request all permissions on app launch.
 * - Request **just-in-time** (e.g., ask for Camera permission only
 *   when user clicks "Take Photo").
 *
 * 2️⃣ Provide context before asking
 * - Show a custom UI/explanation BEFORE the OS popup.
 * - Example: "We need camera access to let you scan QR codes."
 *
 * 3️⃣ Handle Denials Gracefully
 * - If denied, show fallback UI (e.g., allow manual file upload).
 * - Avoid app crashes due to missing permission.
 *
 * 4️⃣ Check Permission before Requesting
 * - Use `check()` to see if already granted/denied.
 *
 * 5️⃣ Permanent Denials (Blocked)
 * - On Android: "Don’t ask again" option
 * - On iOS: User must go to **Settings** to re-enable.
 *   → Provide a button: "Open Settings" (using `Linking.openSettings()`).
 *
 * 6️⃣ Different Platforms, Different Permissions
 * - Android: Permissions grouped (Normal vs Dangerous).
 *   → Dangerous (camera, location, contacts) need runtime request.
 * - iOS: Must declare in `Info.plist` (otherwise app crashes).
 *   Example: `NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`
 *
 * 7️⃣ Test All Scenarios
 * - First-time ask
 * - User denies once
 * - User selects "Don’t ask again" (Android)
 * - Background permissions (location in background)
 */

/********************************************
 * 📱 Platform-Specific Details
 ********************************************/
/**
 * 🔹 iOS:
 * - Always add **usage descriptions** in `Info.plist`.
 *   Example:
 *   <key>NSCameraUsageDescription</key>
 *   <string>This app needs camera access to scan QR codes</string>
 *
 * - iOS prompts only **once per permission**.
 *   After denial, must open Settings to allow.
 *
 * 🔹 Android:
 * - Declare permissions in `AndroidManifest.xml`.
 * - Dangerous permissions must be requested at runtime.
 * - Android 11+ → Scoped storage (restricts file system access).
 * - Android 13+ → Separate permission for **notifications**.
 */

/********************************************
 * 🔍 Example: Location Permission (Cross-platform)
 ********************************************/
/**
 * import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
 * import { Platform } from "react-native";
 *
 * async function requestLocationPermission() {
 *   const permission =
 *     Platform.OS === "ios"
 *       ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
 *       : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
 *
 *   const result = await request(permission);
 *
 *   if (result === RESULTS.GRANTED) {
 *     console.log("Location granted ✅");
 *   } else if (result === RESULTS.BLOCKED) {
 *     console.log("Permission blocked 🚫. Please enable in settings.");
 *   } else {
 *     console.log("Location denied ❌");
 *   }
 * }
 */

/********************************************
 * ❓ Q&A for Interviews
 ********************************************/
/**
 * Q1: Why shouldn’t we request all permissions at app startup?
 *    → Creates bad UX, users may deny everything, leading to app rejection.
 *
 * Q2: What happens if you forget Info.plist keys on iOS?
 *    → App will **crash immediately** when requesting that permission.
 *
 * Q3: How to handle "Don’t ask again" on Android?
 *    → Use `RESULTS.BLOCKED`, then guide user to Settings screen.
 *
 * Q4: What is the difference between Normal and Dangerous permissions on Android?
 *    → Normal (e.g., Internet) auto-granted. Dangerous (e.g., Camera, Location) require runtime request.
 *
 * Q5: How to handle permissions for background location tracking?
 *    → Use `ACCESS_BACKGROUND_LOCATION` (Android 10+), must justify in Play Store policy.
 */
