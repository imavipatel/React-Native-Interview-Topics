/**
 * react-native-native-api-integration-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "How to call native APIs from React Native — Android & iOS"
 *
 * - Plain-language overview (old Bridge + new JSI/TurboModules + Native UI Components)
 * - When to write a native module vs native UI component
 * - Step-by-step implementation examples:
 *     • Android (Kotlin) — Native Module + Promise + EventEmitter + ViewManager
 *     • iOS (Swift) — Native Module + Callback/Promise + EventEmitter + ViewManager
 * - TurboModule / JSI overview and example pointers (conceptual)
 * - Packaging, registration, permissions, threading, lifecycle, testing, debugging
 * - Security & versioning best practices
 * - Interview Q&A + cheat-sheet
 *
 * Copy/paste into docs or keep as single-source-of-truth for native integrations.
 */

/* ===========================================================================
📌 0. BIG PICTURE — plain-language
===============================================================================
React Native runs JS code and talks to native platform code (Android/iOS). There
are two ways to access native APIs:

1) Classic Bridge (React Native Bridge)
   - JS calls native module methods via serialized bridge (async)
   - Native modules and UI view managers are registered and invoked from JS

2) New (Modern) Architecture: JSI + TurboModules + Fabric
   - JSI allows JS to hold references to native/C++ host objects (no JSON serialization)
   - TurboModules expose faster native APIs (sync or async) via JSI
   - Fabric affects native UI components mounting
   - New path gives lower latency, sync access when safe

When to implement:
  • Use Native Module for platform features (sensors, platform APIs, complex native logic).
  • Use Native UI Component (ViewManager) when you need a custom native view (map, video player, native widget).
  • Prefer existing community modules if available.
*/

/* ===========================================================================
📌 1. ARCHITECTURE SUMMARY
===============================================================================
- JS <-> Bridge (old): serialized messages (async), good for many use cases.
- JS <-> JSI/TurboModules (new): direct/native-backed objects, lower overhead, can be synchronous.
- UI components: ViewManager (old) vs Fabric ViewManager (new) — Fabric improves mounting & layout.
*/

/* ===========================================================================
📌 2. WHEN TO WRITE NATIVE CODE (practical)
===============================================================================
Write native module when:
  - You need device features not exposed by RN (biometrics, NFC, advanced file APIs)
  - High-performance native libraries (custom rendering, codecs)
  - Native system integrations (background services)

Write native UI component when:
  - You need custom native view with platform-specific behavior (native chart, map, video)
  - You want native performance for rendering complex visuals

Prefer:
  - Community libraries first (react-native-device-info, react-native-camera, etc.)
  - If writing native, keep JS API simple and testable
*/

/* ===========================================================================
📌 3. CLASSIC NATIVE MODULE: ANDROID (KOTLIN) — Example: BatteryModule
===============================================================================
Goal: Create a module `BatteryModule` with method `getBatteryLevel()` that
returns Promise<number>, and emits "BatteryLevelChanged" events.

Files:
  - android/app/src/main/java/com/yourapp/BatteryModule.kt
  - android/app/src/main/java/com/yourapp/BatteryPackage.kt
  - register package in MainApplication.kt

--- BatteryModule.kt ---
package com.yourapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class BatteryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  private val receiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
      val level = intent?.getIntExtra("level", -1) ?: -1
      sendBatteryEvent(level)
    }
  }

  override fun getName(): String = "BatteryModule"

  override fun initialize() {
    super.initialize()
    val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
    reactApplicationContext.registerReceiver(receiver, filter)
  }

  override fun onCatalystInstanceDestroy() {
    try {
      reactApplicationContext.unregisterReceiver(receiver)
    } catch (e: Exception) { /* ignore  }
    super.onCatalystInstanceDestroy()
  }

  private fun sendBatteryEvent(level: Int) {
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("BatteryLevelChanged", level)
  }

  @ReactMethod
  fun getBatteryLevel(promise: Promise) {
    try {
      val intent = reactApplicationContext.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
      val level = intent?.getIntExtra("level", -1) ?: -1
      promise.resolve(level)
    } catch (e: Exception) {
      promise.reject("ERR_BATTERY", e)
    }
  }
}

--- BatteryPackage.kt ---
package com.yourapp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class BatteryPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(BatteryModule(reactContext))
  }
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}

--- Register in MainApplication.kt ---
packages.add(BatteryPackage())

Notes:
- Use Promise (resolve/reject) for async results.
- Use DeviceEventEmitter in JS to listen to events.
- Unregister receivers in onCatalystInstanceDestroy to avoid leaks.
*/

/* ===========================================================================
📌 4. CLASSIC NATIVE MODULE: iOS (SWIFT) — Example: BatteryModule
===============================================================================
Goal: Same API as Android — getBatteryLevel() -> Promise and event emitter.

Files:
  - ios/YourApp/BatteryModule.swift
  - ios/YourApp/BatteryModuleBridge.m (if bridging to Obj-C required)
  - Register in RCTBridge

--- BatteryModule.swift ---
import Foundation
import UIKit

@objc(BatteryModule)
class BatteryModule: RCTEventEmitter {
  override init() {
    super.init()
    UIDevice.current.isBatteryMonitoringEnabled = true
    NotificationCenter.default.addObserver(self,
                                           selector: #selector(batteryChanged),
                                           name: UIDevice.batteryLevelDidChangeNotification,
                                           object: nil)
  }

  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc
  func getBatteryLevel(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let level = Int(UIDevice.current.batteryLevel * 100)
    if level >= 0 {
      resolve(level)
    } else {
      reject("ERR_BATTERY", "Battery level unavailable", nil)
    }
  }

  @objc
  func batteryChanged() {
    let level = Int(UIDevice.current.batteryLevel * 100)
    sendEvent(withName: "BatteryLevelChanged", body: level)
  }

  override func supportedEvents() -> [String]! {
    return ["BatteryLevelChanged"]
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }
}

--- Expose to React ---
If using Swift, ensure bridging header or use the RCT_EXPORT_METHOD macros in an ObjC wrapper if needed.
*/

/* ===========================================================================
📌 5. JS SIDE (USING THE MODULES)
===============================================================================
import { NativeModules, NativeEventEmitter } from 'react-native';

const { BatteryModule } = NativeModules;
const batteryEmitter = new NativeEventEmitter(BatteryModule);

export async function getBatteryLevel() {
  try {
    const level = await BatteryModule.getBatteryLevel();
    return level; // number
  } catch (e) {
    console.warn('battery error', e);
    return null;
  }
}

export function subscribeBattery(cb) {
  const sub = batteryEmitter.addListener('BatteryLevelChanged', cb);
  return () => sub.remove();
}
*/

/* ===========================================================================
📌 6. NATIVE UI COMPONENT (ViewManager) — Android (Kotlin) & iOS (Swift)
===============================================================================
Use when creating a custom native view (e.g., MapView). Outline:

Android (Kotlin) — MyCustomViewManager
- Extend SimpleViewManager<View> or ViewGroupManager
- Override getName(), createViewInstance(), addExportedCustomDirectEventTypeConstants (for events), and export props via @ReactProp

iOS (Swift) — RCTViewManager subclass
- Override view() -> UIView, constantsToExport, and use RCT_EXPORT_VIEW_PROPERTY in ObjC wrapper or use @objc props in Swift + bridging.

Example (Android snippet):

class MyTextViewManager: SimpleViewManager<TextView>() {
  override fun getName(): String = "RNMyTextView"

  override fun createViewInstance(reactContext: ThemedReactContext): TextView {
    return TextView(reactContext)
  }

  @ReactProp(name = "title")
  fun setTitle(view: TextView, title: String?) {
    view.text = title ?: ""
  }
}

Register with package and then in JS:

import { requireNativeComponent } from 'react-native';
const RNMyTextView = requireNativeComponent('RNMyTextView');

// use in JSX
<RNMyTextView title="Hello" style={{ width: 200, height: 40 }} />

Notes:
- For Fabric use new ViewManager APIs (C++/Turbo) — community libs document migration steps.
*/

/* ===========================================================================
📌 7. PROMISES, CALLBACKS & EVENTS — API patterns
===============================================================================
JS FACING API patterns (choose one or combine):

1) Promise-based (preferred for single-call async):
  await NativeModule.doWork(params)

2) Callback-based (legacy):
  NativeModule.doWork(params, (err, result) => {})

3) EventEmitter (for streaming events):
  const emitter = new NativeEventEmitter(NativeModule);
  const sub = emitter.addListener('Event', handler);

4) Direct synchronous methods (only with TurboModules / JSI — be careful)
  const x = NativeModule.syncMethod(args);

Design tips:
- Keep API surface small and high-level
- Prefer Promise for clarity
- For continuous updates/events, use event emitter
- Avoid blocking JS thread — run heavy work on background/native threads
*/

/* ===========================================================================
📌 8. TURBOMODULES & JSI (modern approach) — conceptual summary
===============================================================================
- TurboModules: define native module in Java/ObjC/C++ and expose via JSI for faster calls.
- JSI: lets JS access native host objects, call functions, and hold references — removes serialization cost.
- When to use: performance-critical hot paths (real-time audio, synchronous reads, animation helpers).
- Implementation requires native code in C++ (or using helper codegen) and build change + enable new architecture.
- For new projects prefer TurboModule (if you need sync native access), otherwise the bridge model is fine.
*/

/* ===========================================================================
📌 9. THREADING & LIFECYCLE (important)
===============================================================================
- JS runs on JS thread; never block it.
- Native module should:
  • perform heavy work on background threads (AsyncTask, Executors, DispatchQueue)
  • return results via Promise/Callback once done
  • post UI updates on main/UI thread when modifying views
- Clean up resources on module destroy (unregister listeners, stop services).
- For Android services, consider binding/unbinding during app lifecycle.
*/

/* ===========================================================================
📌 10. PERMISSIONS & PLATFORM NOTES
===============================================================================
- Request runtime permissions on Android (dangerous perms) before using native APIs.
- iOS requires Info.plist keys for privacy-sensitive APIs (NSCameraUsageDescription etc.)
- Validate and handle permission-denied cases gracefully on JS side.
*/

/* ===========================================================================
📌 11. PACKAGING, BUILD & REGISTRATION
===============================================================================
Android:
  - Add package to MainApplication packages list OR use auto-linking (RN >= 0.60) with proper gradle config.
  - Update AndroidManifest for permissions and services.
iOS:
  - Add native files to Xcode project or use CocoaPods.
  - Expose Swift classes to ObjC via bridging header if necessary.
  - Register module automatically via RCT_EXPORT_MODULE / autolinking or manual bridge file.

Testing:
  - Unit test native module logic on native side when possible.
  - On JS side use a mock native module in Jest (jest.mock('NativeModules', ...)).
  - Use E2E (Detox) for integration tests that exercise native functionality.
*/

/* ===========================================================================
📌 12. DEBUGGING TIPS
===============================================================================
- Android Logcat + adb logcat for native logs.
- iOS Console / Xcode logs for Swift/ObjC logs.
- Use console.log in JS and native logs to correlate calls.
- Use Flipper + React DevTools; many native modules add Flipper plugins.
- If native module not found: check registration (package added, autolinking), names (getName()) and redeploy native build (native changes require rebuild).
*/

/* ===========================================================================
📌 13. SECURITY & MAINTENANCE (best practices)
===============================================================================
- Validate inputs on native side (avoid accepting arbitrary JS objects without checks).
- Avoid storing secrets in plain text inside native module; use secure storage and platform-keystore.
- Keep native API surface minimal and documented.
- Add telemetry/logging (redacted) for native errors; handle exceptions to avoid app crash.
- Maintain ABI/JS API compatibility: bump versions if breaking changes; add deprecation notices.
*/

/* ===========================================================================
📌 14. EXAMPLE: MOCKED JS TEST (Jest) for Native Module
===============================================================================
/* jest setup */
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  RN.NativeModules.BatteryModule = {
    getBatteryLevel: jest.fn(() => Promise.resolve(85)),
  };
  RN.NativeEventEmitter = function () {
    return { addListener: jest.fn(() => ({ remove: jest.fn() })) };
  };
  return RN;
});

/* test 
import { getBatteryLevel } from './battery.js'; // from earlier JS example
test('battery level', async () => {
  const level = await getBatteryLevel();
  expect(level).toBe(85);
});
*/

/* ===========================================================================
📌 15. MIGRATION NOTES (old bridge -> TurboModules/Fabric)
===============================================================================
- Migration steps:
  1) Identify performance-critical modules (high-call-rate).
  2) Port to TurboModule via JSI if synchronous/native access required.
  3) Update build to enable new architecture (RN config).
  4) Test thoroughly on both Android/iOS (especially threading & lifecycle).
- For UI components: migrate ViewManager implementations to Fabric-compatible APIs.
*/

/* ===========================================================================
📌 16. INTERVIEW Q&A (important)
===============================================================================
Q1: How do you call native code from React Native?
A: Via Native Modules (Bridge) or TurboModules/JSI (modern). Use ViewManagers for native UI components.

Q2: How do you return async results to JS?
A: Use Promise (recommended) or callbacks. For streaming/continuous updates use EventEmitter.

Q3: When should work run on native threads?
A: Heavy CPU or blocking IO must run on background threads; UI updates on main thread.

Q4: How to handle permissions?
A: Request at runtime (Android) and declare usage keys (iOS Info.plist); handle denial flows.

Q5: How to debug native module not found?
A: Rebuild native app, ensure package registered or autolinking present, check getName() matches requireNativeComponent/NativeModules key.

Q6: Why use TurboModules / JSI?
A: Lower latency, direct host object access, ability to expose synchronous functions safely — used for performance-critical paths.
*/

/* ===========================================================================
📌 17. QUICK CHEAT-SHEET (copyable)
===============================================================================
- Use community modules when possible.
- Choose Native Module for APIs, ViewManager for custom views.
- Expose Promise-based methods and emit events via DeviceEventEmitter/NativeEventEmitter.
- Do heavy work on native background threads.
- Unregister listeners in destroy/unmount to avoid leaks.
- Secure inputs & follow platform permission practices.
- For performance-critical, migrate to TurboModules/JSI and Fabric for UI.
*/

/* ===========================================================================
📌 18. WANT NEXT?
===============================================================================
I can provide (single-file JS Notes):
  ✅ Full step-by-step TurboModule example (conceptual C++ + Kotlin/Swift glue)
  ✅ Native UI component full example (map/video) with props/events + Fabric notes
  ✅ Fast checklist for publishing native modules as NPM packages (autolinking + podspec + gradle)
  ✅ Security checklist for native modules (input validation + keystore usage)

Tell me which and I’ll return it in this same JS Notes format.
*/
