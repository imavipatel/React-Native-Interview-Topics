// ===============================================
// WearOS / watchOS / tvOS & Foldable Adaptations
// ===============================================

// Why Important?
// - New device categories → different UX & platform APIs
// - Requires responsive layouts + platform APIs
// - Watch, TV, Foldables have custom input methods
// - React Native New Arch (TurboModules/Fabric) → improves performance

// ---------------- WEAROS ----------------
// - Android-based smartwatches
// - Use Jetpack Wear APIs for native integrations
// - Best for fitness, health, notifications
// - RN modules often wrap Wear APIs via TurboModules

// Key Considerations:
// ✅ Smaller screens → compact UI
// ✅ Gesture/voice-first interactions
// ✅ Background sensors (heart rate, steps)
// ✅ Battery-efficient background tasks
// ✅ Use Headless JS + WorkManager for sync
// ✅ Notification integration with FCM

/*
// Example (Fitness API integration)
import { TurboModuleRegistry } from "react-native";
export interface Spec extends TurboModule {
  getStepCount: () => number;
}
export default TurboModuleRegistry.getEnforcing < Spec > "WearModule";

*/

// ---------------- watchOS ----------------
// - Apple Watch apps run alongside iOS app
// - Communication via WatchConnectivity Framework
// - Modules must bridge via TurboModule/Swift
// - Uses WKInterfaceController (not UIKit)
// - Limited JS runtime (offloaded to iPhone)

// Key Considerations:
// ✅ Async data sync (health data, messages)
// ✅ Push notifications (APNS to WatchKit)
// ✅ UI built in WatchKit → RN mostly companion
// ✅ TurboModules expose shared data to RN app

// ---------------- tvOS ----------------
// - Apple TV (iOS-based platform)
// - RN supports tvOS with custom renderer
// - Remote input (D-pad, swipe, voice)
// - Layouts → big-screen optimized (10-foot UI)

// Key Considerations:
// ✅ Focus-based navigation (not touch)
// ✅ Large, high-contrast UI
// ✅ Video playback → AVFoundation / ExoPlayer
// ✅ DRM (FairPlay) supported via native SDKs
// ✅ Reanimated for smooth animations

// Example (Focus navigation handling)
<TouchableOpacity hasTVPreferredFocus={true} onPress={() => playVideo()} />;

// ---------------- Foldable Devices ----------------
// - Android 10+ introduced foldable APIs
// - Use Jetpack WindowManager to detect posture
// - RN TurboModules can wrap these APIs

// Key Considerations:
// ✅ Responsive layouts (split screen / unfolded mode)
// ✅ Multi-window → Activity lifecycle handling
// ✅ State persistence across folds
// ✅ Test on emulators + Samsung Fold devices

/*
// Example (Detecting fold state via TurboModule)
export interface Spec extends TurboModule {
  getFoldState: () => "FLAT" | "HALF_OPEN" | "CLOSED";
}
*/
// ---------------- Best Practices ----------------
// ✅ Always test layouts on emulator configs (watch, tv, foldable)
// ✅ Use responsive UI libs (react-native-responsive-ui)
// ✅ Offload heavy tasks to native modules for performance
// ✅ Sync health/media data with background services
// ✅ Keep battery efficiency in mind (especially WearOS)

// ===============================================
// 📌 Summary
// - WearOS → fitness, sensors, compact UI
// - watchOS → companion apps, WatchConnectivity
// - tvOS → focus navigation, big-screen UX
// - Foldables → responsive layouts, multi-window
// - New Arch (TurboModules/Fabric) → required for performant integrations
// ===============================================
