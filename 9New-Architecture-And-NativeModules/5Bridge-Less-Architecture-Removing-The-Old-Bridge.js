/********************************************
 * 📘 Bridgeless Architecture – Removing the Old Bridge in React Native
 ********************************************/

/**
 * 🟢 THEORY:
 * - Traditional React Native (before New Architecture) used a **Bridge**:
 *    JS Thread ↔ Bridge (async, batched JSON messages) ↔ Native Threads
 *
 * - **Problem with Bridge**:
 *   1. Slow: JSON serialization/deserialization overhead.
 *   2. Async only: No synchronous calls → caused lag in gestures, animations.
 *   3. Bottleneck: Every message passes through a single Bridge channel.
 *   4. Debugging difficulty: Errors surfaced late.
 *
 * - **Bridgeless Architecture**:
 *   🚀 Introduced with **JSI + TurboModules + Fabric**.
 *   🚀 Removes the old Bridge completely.
 *   🚀 Allows **direct function calls** from JS → Native (via JSI).
 *   🚀 Provides **synchronous & asynchronous APIs**.
 *   🚀 Reduces overhead → smoother animations, better startup time.
 *
 * - In short:
 *   JS → JSI (JavaScript Interface) → Direct Native Method Call
 */

/**
 * 🔹 Old Architecture (with Bridge)
 *
 * JS (React) Thread
 *    ↓ batched JSON messages
 *    Bridge (Async)
 *    ↓
 * Native (Java/ObjC) Thread
 *
 * - Each call = JSON → serialize → send → deserialize → execute → return.
 * - Adds latency + blocks UI updates.
 */

/**
 * 🔹 New Bridgeless Architecture
 *
 * JS (React) Thread
 *    ↓ (direct JSI binding)
 * C++ Core (TurboModules + Fabric)
 *    ↓
 * Native (Java/ObjC/Swift/Kotlin)
 *
 * - No JSON serialization.
 * - No message queue.
 * - Function calls are direct (JSI objects, pointers).
 * - Native → JS calls are also possible (better 2-way sync).
 */

/**
 * 🔹 Example with TurboModule (Bridgeless)
 *
 * // MyModuleSpec.js
 * import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
 * import * as TurboModuleRegistry from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
 *
 * export interface Spec extends TurboModule {
 *   +multiply: (a: number, b: number) => number;
 * }
 *
 * export default (TurboModuleRegistry.getEnforcing<Spec>('MyModule'): Spec);
 *
 * // JS Usage
 * import MyModule from './MyModuleSpec';
 * console.log(MyModule.multiply(3, 4)); // 12
 *
 * ⚡ Here:
 * - No Bridge involved.
 * - JS calls native C++/Java/ObjC function directly using JSI.
 */

/**
 * 🔹 Benefits of Bridgeless Architecture
 *
 * ✅ Performance: Faster than old bridge (no JSON).
 * ✅ Sync calls: Can perform blocking/synchronous operations (e.g., measure layout).
 * ✅ Memory efficiency: No extra serialization buffers.
 * ✅ Better DevX: Type-safety + auto-generated bindings with Codegen.
 * ✅ Smoother UI: Animations, gestures → run closer to native performance.
 * ✅ Modern foundation: Works with Fabric Renderer + TurboModules + Codegen.
 */

/**
 * 🔹 Challenges & Migration
 * - Legacy apps using NativeModules with the old bridge → need migration to TurboModules.
 * - Some 3rd-party libs still depend on the old Bridge.
 * - Gradual migration path:
 *   1. Enable New Architecture (`Fabric + TurboModules`).
 *   2. Convert modules to Codegen/TurboModule.
 *   3. Eventually remove the bridge.
 */

/**
 * 🔹 Comparison Table
 *
 * | Feature                | Old Bridge Architecture          | Bridgeless (New Arch)           |
 * |-------------------------|----------------------------------|---------------------------------|
 * | Communication method    | JSON serialization over Bridge   | Direct C++ JSI calls            |
 * | Sync support            | ❌ Async only                   | ✅ Both Sync & Async            |
 * | Performance             | Slower, adds latency             | Faster, almost native           |
 * | Type safety             | ❌ Runtime only                 | ✅ Compile-time via Codegen     |
 * | Animations              | Often janky                     | Smooth (near-native)            |
 * | Dev Experience          | More boilerplate                | Auto-generated, type-safe       |
 */

/**
 * 🔹 Interview Q&A
 *
 * Q: What is Bridgeless Architecture in React Native?
 * A: It's the removal of the old Bridge system, replacing it with JSI + TurboModules + Fabric, enabling direct communication between JS and Native without JSON serialization.
 *
 * Q: Why was the old Bridge removed?
 * A: Because it caused performance bottlenecks due to JSON serialization, async-only communication, and batching delays.
 *
 * Q: How does Bridgeless improve performance?
 * A: By using JSI for direct native calls, eliminating JSON overhead, and supporting sync + async methods.
 *
 * Q: What are the building blocks of Bridgeless React Native?
 * A: JSI (JavaScript Interface), TurboModules, Fabric Renderer, and Codegen.
 */
