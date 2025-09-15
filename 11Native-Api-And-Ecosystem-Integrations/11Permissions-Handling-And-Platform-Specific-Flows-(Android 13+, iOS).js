/********************************************************************
 * 📱 Permissions Handling in React Native
 * ---------------------------------------------------------------
 * React Native apps often need **runtime permissions** for:
 *  - Camera, Microphone
 *  - Location (foreground, background)
 *  - Notifications
 *  - Storage & Media access
 *  - Bluetooth, NFC, Sensors
 *
 * Since **Android 6+ (API 23)** and **iOS 10+**, permissions are
 * requested at runtime (not just declared in manifest/plist).
 *
 * ⚠️ Permissions handling differs between Android & iOS,
 * and Android 13+ introduced **new granular permissions**.
 ********************************************************************/

/********************************************
 * 🔹 1. Declaring Permissions
 ********************************************/
// ✅ Android (AndroidManifest.xml)
/*
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
*/

// ✅ iOS (Info.plist)
/*
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan QR codes</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs your location for maps</string>
*/

/********************************************
 * 🔹 2. Checking & Requesting Permissions
 ********************************************/
// Using react-native-permissions (recommended library)

import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

async function requestCameraPermission() {
  const result = await request(
    Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    })
  );

  if (result === RESULTS.GRANTED) {
    console.log("✅ Camera permission granted");
  } else {
    console.log("❌ Camera permission denied or blocked");
  }
}

/********************************************
 * 🔹 3. Android 13+ Permission Changes
 ********************************************/
/**
 * ✅ New granular permissions:
 * - Notifications → POST_NOTIFICATIONS
 * - Media → READ_MEDIA_IMAGES, READ_MEDIA_VIDEO, READ_MEDIA_AUDIO
 * - Bluetooth → BLUETOOTH_SCAN, BLUETOOTH_CONNECT, BLUETOOTH_ADVERTISE
 *
 * ✅ Storage (deprecated):
 * - WRITE_EXTERNAL_STORAGE / READ_EXTERNAL_STORAGE → replaced by new scoped storage rules.
 *
 * ✅ Foreground & Background Location:
 * - ACCESS_FINE_LOCATION (precise)
 * - ACCESS_COARSE_LOCATION (approximate)
 * - ACCESS_BACKGROUND_LOCATION (for background tracking, e.g., delivery apps).
 *
 * ⚠️ Important:
 * - Background location must be requested in 2 steps:
 *    1. Request foreground (fine/coarse).
 *    2. Then request background permission separately.
 */

/********************************************
 * 🔹 4. iOS Permission Flows
 ********************************************/
/**
 * iOS requires **Info.plist usage descriptions** for every permission.
 * Missing description = app rejection on App Store.
 *
 * Common ones:
 *  - NSCameraUsageDescription
 *  - NSMicrophoneUsageDescription
 *  - NSLocationWhenInUseUsageDescription
 *  - NSLocationAlwaysUsageDescription
 *  - NSPhotoLibraryUsageDescription
 *  - NSBluetoothAlwaysUsageDescription
 *
 * ✅ Flow:
 * - First request → system prompt.
 * - If user denies → app cannot re-prompt (only system settings).
 *
 * Example: Notifications (iOS 10+):
 *   UNUserNotificationCenter.requestAuthorization(options: [.alert, .sound, .badge])
 */

/********************************************
 * 🔹 5. Best Practices
 ********************************************/
/**
 * - Ask permission **just-in-time** (when feature is used),
 *   not at app launch → improves acceptance rate.
 *
 * - Explain *why* permission is needed (custom prompt before system dialog).
 *
 * - Handle all states: granted, denied, blocked.
 *
 * - Direct user to **App Settings** if permission is permanently denied:
 */
import { openSettings } from "react-native-permissions";

async function openAppSettings() {
  await openSettings();
}

/********************************************
 * 🔹 6. Example – Location Permissions Flow
 ********************************************/
async function requestLocationPermission() {
  const result = await request(
    Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    })
  );

  if (result === RESULTS.GRANTED) {
    console.log("✅ Location granted");
  } else if (result === RESULTS.BLOCKED) {
    console.log("⚠️ Permission blocked, redirecting to settings");
    openSettings();
  } else {
    console.log("❌ Location denied");
  }
}

/********************************************
 * 🔹 7. Interview Prep – Q&A
 ********************************************/
/**
 * Q1: What changed in Android 13+ permissions?
 *  → Notifications, Bluetooth, and Media access split into granular permissions.
 *
 * Q2: What happens if Info.plist usage description is missing?
 *  → App Store rejection or runtime crash when requesting.
 *
 * Q3: Can you re-prompt permissions on iOS if user denied once?
 *  → No, only user can re-enable via Settings.
 *
 * Q4: What is the difference between ACCESS_FINE_LOCATION and COARSE?
 *  → Fine = GPS accuracy, Coarse = Wi-Fi/cell tower (approx).
 *
 * Q5: Best time to ask for permissions?
 *  → Just before feature use (not at app launch).
 */
