/**
 * ==============================================================
 * 📘 React Native Notes – Motivation for New Architecture
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why a New Architecture?
 * - The Old Bridge (JSON + Batched Queues) had key issues:
 *    ❌ JSON Serialization overhead (slow, costly)
 *    ❌ Asynchronous-only communication (no sync calls possible)
 *    ❌ No Type Safety (runtime errors, difficult debugging)
 *    ❌ Performance bottlenecks with large UI updates
 * - To solve these, RN team introduced a **New Architecture**
 * (JSI + TurboModules + Fabric).
 *
 * --------------------------------------------------------------
 * 🔹 Type Safety
 * - Old Bridge: JS & Native didn’t share type info → runtime errors.
 * - New Arch: Uses **Codegen** (auto-generated bindings) to enforce:
 *    ✅ Compile-time type checks
 *    ✅ Safer JS ↔ Native communication
 *    ✅ Fewer runtime crashes
 * - Example:
 *    If JS expects `string` but Native sends `number`, Codegen fails build.
 *
 * --------------------------------------------------------------
 * 🔹 Synchronous Calls
 * - Old Bridge: All calls were async (via batched queues).
 *    → Couldn’t fetch data instantly (e.g., screen dimensions).
 * - New Arch: With **JSI**, JS can call Native methods **directly**:
 *    ✅ Sync calls supported
 *    ✅ Useful for quick data fetch (layout, device info)
 * - Example: `Dimensions.get("window")` can be sync.
 *
 * --------------------------------------------------------------
 * 🔹 Performance
 * - Old Bridge:
 *    * Serialization + batching slowed UI
 *    * High latency under heavy interactions (FlatList scroll)
 * - New Arch:
 *    ✅ No JSON serialization (direct function calls via JSI)
 *    ✅ Less thread hopping
 *    ✅ Faster UI updates with Fabric renderer
 *    ✅ Lower memory usage
 *
 * --------------------------------------------------------------
 * 🔹 Key Takeaway
 * - Old Bridge = safe but slow (async + JSON bottleneck).
 * - New Architecture = fast, type-safe, supports sync calls.
 * - Enables React Native to handle **complex, high-performance apps**
 *   without lag or runtime surprises.
 *
 * ==============================================================
 */

//
// 🔹 Example 1: Old Bridge vs New Architecture
//
/**
 * Old Bridge → Async only
 */
NativeModules.DeviceInfo.getInfo((info) => {
  console.log("Device:", info);
});

/**
 * New Arch (with JSI) → Sync possible
 */
const deviceName = NativeModules.DeviceInfo.getInfoSync();
console.log("Device:", deviceName);

//
// 🔹 Example 2: Type Safety with Codegen
//
/**
 * Old Bridge → Runtime error only
 * JS: NativeModule.add("a", "b"); // runtime crash
 *
 * New Arch → Compile-time error
 * Codegen enforces correct types
 */

//
// 🔹 Example 3: Performance Difference
//
/**
 * Old Bridge
 * - Scroll FlatList → 1000 update messages → JSON serialization → lag.
 *
 * New Architecture
 * - Direct function calls (no JSON) → smoother scrolling.
 */

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What problems in the Old Bridge motivated the New Architecture?
 *    → JSON serialization overhead, async-only communication,
 *      no type safety, poor performance with heavy UI updates.
 *
 * Q2: How does the New Architecture improve type safety?
 *    → By using **Codegen** to generate bindings with type definitions,
 *      catching mismatches at compile time.
 *
 * Q3: Why are synchronous calls important?
 *    → Some APIs (like device info, layout measurements) need instant
 *      values. Async-only was too slow for these cases.
 *
 * Q4: How does JSI improve performance?
 *    → Removes JSON serialization, allows direct C++ function calls
 *      between JS and Native, reducing latency + overhead.
 *
 * Q5: What is the biggest benefit of the New Architecture overall?
 *    → Faster, type-safe, and flexible communication between JS
 *      and Native → enabling React Native to scale for complex apps.
 *
 * ==============================================================
 */
