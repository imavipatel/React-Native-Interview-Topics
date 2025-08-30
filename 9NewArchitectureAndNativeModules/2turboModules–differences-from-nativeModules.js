/********************************************
 * 📘 TurboModules – Differences from NativeModules
 ********************************************/

/**
 * 🟢 THEORY:
 * - TurboModules are part of React Native’s **New Architecture**.
 * - They replace the old NativeModules system with a faster,
 *   more efficient, and type-safe mechanism.
 * - TurboModules use **JSI (JavaScript Interface)** under the hood.
 * - This allows direct synchronous communication between JavaScript and native code
 *   without going through the old bridge.
 */

/**
 * 🔹 NativeModules (Old System):
 * - Communication happens over the Bridge using async batched JSON messages.
 * - Slower because it requires serialization/deserialization.
 * - No strong typing – prone to runtime errors.
 * - Cannot easily call native functions synchronously.
 * - Example:
 */
import { NativeModules } from "react-native";
// const { CalendarModule } = NativeModules;
CalendarModule.createCalendarEvent("Meeting", "Office"); // old way

/**
 * 🔹 TurboModules (New System):
 * - Based on **JSI** → No bridge overhead, faster calls.
 * - Supports **codegen** → auto-generates TypeScript/Flow type-safe bindings.
 * - Lazy loading of native modules → only loads when needed (reduces startup time).
 * - Can support **synchronous functions** (not possible in NativeModules).
 * - Works seamlessly with **Fabric Renderer**.
 *
 * Example (TurboModule with codegen – simplified):
 *
 * 1. Define your spec (TypeScript or Flow):
 */
/*
export interface Spec extends TurboModule {
  createCalendarEvent(name: string, location: string): Promise<void>;
}
*/

/**
 * 2. Expose it in native (Android/iOS):
 * - Uses codegen to auto-generate native bindings.
 *
 * 3. Use in JS:
 */
import { TurboModuleRegistry } from "react-native";
const CalendarModule = TurboModuleRegistry.get < Spec > "CalendarModule";
CalendarModule?.createCalendarEvent("Meeting", "Office");

/**
 * 🔹 Key Differences: TurboModules vs NativeModules
 *
 * | Feature                | NativeModules (Old)                | TurboModules (New)                         |
 * |------------------------|-------------------------------------|--------------------------------------------|
 * | Communication          | Bridge (async JSON messages)       | JSI (direct sync calls)                    |
 * | Performance            | Slower, high overhead              | Much faster (no JSON serialization)        |
 * | Type Safety            | Weak (manual definitions)          | Strong (auto-generated via codegen)        |
 * | Synchronous Calls      | ❌ Not supported                    | ✅ Supported (direct native <-> JS calls)  |
 * | Lazy Loading           | ❌ All modules load at startup      | ✅ Modules load only when first accessed   |
 * | Integration            | Old Fabric-incompatible            | Works with Fabric Renderer                 |
 * | Memory Usage           | Higher (modules preloaded)         | Lower (modules load on demand)             |
 * | New Architecture Ready | ❌ Legacy                          | ✅ Foundation of new RN architecture       |
 */

/**
 * 🔹 Benefits of TurboModules:
 * 1. 🚀 Faster execution (no bridge bottleneck).
 * 2. 📉 Reduced app startup time (lazy loading).
 * 3. ✅ Type-safe and less error-prone (thanks to codegen).
 * 4. 🔄 Supports synchronous calls when needed.
 * 5. 🧩 Essential for the new RN architecture (Fabric + JSI).
 */

/**
 * ❓ Q&A for Interviews:
 *
 * Q: Why were TurboModules introduced?
 * A: To remove the bottleneck of the old bridge, improve performance,
 *    and provide type safety with codegen.
 *
 * Q: How do TurboModules achieve better performance?
 * A: By using JSI for direct communication instead of serializing
 *    and sending data via the bridge.
 *
 * Q: Do TurboModules support synchronous functions?
 * A: Yes, unlike NativeModules which only supported async.
 *
 * Q: What role does codegen play in TurboModules?
 * A: Codegen auto-generates native bindings and ensures type safety,
 *    reducing manual boilerplate and runtime errors.
 */

/********************************************
 * 📱 Full Example – TurboModule Implementation
 ********************************************/

/**
 * ✅ Step 1: Define TurboModule spec in TypeScript
 * (React Native codegen will use this file)
 */
/*
import type { TurboModule } from "react-native/Libraries/TurboModule/RCTExport";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  createCalendarEvent(name: string, location: string): Promise<string>;
  getSystemVersion(): string; // example of sync method
}
*/

export default TurboModuleRegistry.get < Spec > "CalendarModule";

/**
 * ✅ Step 2: Android Implementation (Kotlin)
 */
/*
package com.myapp

import com.facebook.react.bridge.Promise
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = CalendarModule.NAME)
class CalendarModule(reactContext: ReactApplicationContext) :
    NativeCalendarSpec(reactContext), TurboModule {

    companion object {
        const val NAME = "CalendarModule"
    }

    @ReactMethod
    override fun createCalendarEvent(name: String, location: String, promise: Promise) {
        // Example logic
        val eventId = "event123"
        promise.resolve("Created Event: $name at $location (id: $eventId)")
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    override fun getSystemVersion(): String {
        return android.os.Build.VERSION.RELEASE ?: "Unknown"
    }
}
*/

/**
 * ✅ Step 3: iOS Implementation (Swift)
 */
/*
import Foundation

@objc(CalendarModule)
class CalendarModule: NSObject {
  @objc
  func createCalendarEvent(_ name: String, location: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let eventId = "event123"
    resolve("Created Event: \(name) at \(location) (id: \(eventId))")
  }

  @objc
  func getSystemVersion() -> String {
    return UIDevice.current.systemVersion
  }
}
*/

/**
 * ✅ Step 4: Use in JavaScript
 */
import CalendarModule from "./NativeCalendarModule";

async function testTurboModule() {
  const result = await CalendarModule.createCalendarEvent(
    "Team Meeting",
    "Zoom"
  );
  console.log(result); // Created Event: Team Meeting at Zoom (id: event123)

  const version = CalendarModule.getSystemVersion();
  console.log("System Version:", version); // e.g., Android 13 / iOS 16
}
testTurboModule();
/**
 * This example demonstrates a complete flow of defining,
 * implementing, and using a TurboModule in React Native.
 * TurboModules provide significant performance and usability
 * improvements over the old NativeModules system.
 */
