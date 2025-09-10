// ==================================================
// HANDLING PLATFORM API LEVEL DIFFERENCES – NEW ARCH
// ==================================================

// Why it matters?
// ------------------------------------
// - React Native apps run on multiple Android/iOS versions
// - APIs differ across API levels (deprecated, restricted, or added)
// - New Architecture (TurboModules + Fabric) still relies on underlying OS APIs
// - Ensuring backward compatibility avoids crashes on older devices

// =============================
// 1. ANDROID API LEVELS (21 → 33+)
// =============================

// Example: Android Permissions
// - API 23+ (Marshmallow) introduced runtime permissions
// - API 29 (Android 10): Scoped Storage
// - API 30 (Android 11): Background Location restrictions
// - API 31 (Android 12): BLUETOOTH_CONNECT / POST_NOTIFICATIONS
// - API 33 (Android 13): Nearby Wi-Fi, new photo/video pickers

/*
// Manifest Example:
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"
  android:required="false" />

// Runtime Check (Java/Kotlin):
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
  // Handle Android 12+ Bluetooth permission
} else {
  // Fallback for older versions
}

// TurboModule Example (MyModule.java):
public class MyModule extends NativeMyModuleSpec {
  @Override
  public String getDeviceInfo() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      return Build.MANUFACTURER + " " + Build.MODEL + " (Android 11+)";
    }
    return Build.MODEL;
  }
}

// =============================
// 2. iOS VERSIONS
// =============================
// - iOS 10+: UNUserNotificationCenter for push notifications
// - iOS 13+: Dark Mode APIs
// - iOS 14+: App Tracking Transparency (ATT)
// - iOS 15+: Background tasks API, Photo picker
// - iOS 16+: Some CoreTelephony entitlements required
// - iOS 17+: New push token handling changes

// Swift Example (Version Check):
if #available(iOS 14, *) {
  // Use modern API (e.g., PhotoPicker)
} else {
  // Fallback for older iOS
}

// TurboModule Example (MyModule.mm):
@implementation MyModule
- (NSString *)getSystemInfo {
  if (@available(iOS 15, *)) {
    return @"iOS 15+ device with new APIs";
  } else {
    return @"Legacy iOS device";
  }
}
@end

// Info.plist Example:
<key>NSPhotoLibraryUsageDescription</key>
<string>App requires access to photo library</string>
*/

// =============================
// 3. NEW ARCHITECTURE CONSIDERATIONS
// =============================
// - TurboModules & Fabric components should:
//   * Use #available (iOS) / Build.VERSION.SDK_INT (Android) checks
//   * Provide fallbacks for unsupported APIs
//   * Expose only safe APIs to JS layer
// - Codegen ensures type safety → avoid exposing unstable APIs

// =============================
// 4. BEST PRACTICES
// =============================
// ✅ Always wrap platform-specific code with version checks
// ✅ Document minimum supported SDKs (e.g., Android 21+, iOS 12+)
// ✅ Use Platform.OS & Platform.Version in JS for UI-level decisions
// ✅ Gracefully degrade features (e.g., disable camera filters on older versions)
// ✅ Test on real devices/emulators across versions
// ✅ Keep permissions & entitlements up-to-date

// =============================
// 5. JS EXAMPLE (Cross-Platform)
// =============================
import { Platform } from "react-native";

const isModernAndroid = Platform.OS === "android" && Platform.Version >= 31;
const isiOS15Plus =
  Platform.OS === "ios" && parseInt(Platform.Version, 10) >= 15;

if (isModernAndroid) {
  console.log("Running Android 12+ APIs");
} else if (isiOS15Plus) {
  console.log("Running iOS 15+ APIs");
} else {
  console.log("Fallback for older platforms");
}
