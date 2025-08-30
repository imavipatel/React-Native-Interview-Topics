/**************************************
 * 📘 JSI (JavaScript Interface) Internals
 **************************************/

/**
 * 🟢 THEORY:
 * - JSI = JavaScript Interface, introduced in React Native’s New Architecture.
 * - It removes the need for JSON serialization and the old bridge, allowing direct C++ <-> JS communication.
 * - Provides a way for JavaScript to directly call into C++ functions and vice versa.
 * - Unlike the old bridge (asynchronous, batched), JSI allows **synchronous calls**, better performance, and type safety.
 * - It's the foundation for TurboModules & Fabric Renderer.
 */

/**
 * 🔹 Why JSI?
 * - Old Bridge Problem: Data was serialized into JSON and sent across threads -> slow & memory heavy.
 * - JSI Fix: Direct in-memory access with function pointers between JS and native.
 * - Gives freedom: You can build your own JavaScript runtime (like Hermes, V8).
 * - Makes features like React Native’s new Fabric renderer, TurboModules possible.
 */

/**
 * 🔹 How JSI Works:
 * - JS runtime (Hermes/V8/JSC) exposes JSI APIs.
 * - C++ layer registers native methods that JS can call directly.
 * - Example: JS `add(2, 3)` calls into a C++ function instantly without bridge serialization.
 * - All communication is synchronous and much faster.
 */

/**
 * 🔹 Example: Exposing a Native Function via JSI
 * (simplified pseudo-code)
 */

// C++ code registering function
/*
jsi::Function addFunction = jsi::Function::createFromHostFunction(
  runtime,
  jsi::PropNameID::forAscii(runtime, "add"),
  2,
  [](jsi::Runtime& rt, const jsi::Value&, const jsi::Value* args, size_t count) -> jsi::Value {
      int a = args[0].asNumber();
      int b = args[1].asNumber();
      return jsi::Value(a + b);
  }
);
*/

// Then JavaScript can directly call:
console.log(global.add(5, 3)); // 8

/**
 * 🔹 Benefits of JSI:
 * 1. 🚀 Performance – No JSON serialization, direct function calls.
 * 2. 🔄 Synchronous calls – Native & JS can talk instantly.
 * 3. 🧩 Flexibility – Works with different JS engines (Hermes, V8).
 * 4. ⚡ Enables TurboModules & Fabric – new fast rendering & native modules system.
 */

/**
 * ❓ Q&A for Interviews:
 * Q: How is JSI different from the old bridge?
 * A: Old bridge used JSON serialization + async queues (slow).
 *    JSI allows direct synchronous communication between JS & C++.
 *
 * Q: Why is JSI important for React Native’s New Architecture?
 * A: It enables TurboModules, Fabric Renderer, and better performance.
 *
 * Q: Can JSI work with any JavaScript engine?
 * A: Yes, as long as the engine implements JSI APIs (Hermes, V8, JSC).
 */

/**
 * 🔄 Comparison: Old Bridge vs JSI
 *
 * | Feature                  | Old Bridge                          | JSI                                   |
 * |--------------------------|--------------------------------------|---------------------------------------|
 * | Communication            | Async, batched JSON messages         | Direct sync calls between JS & C++    |
 * | Serialization            | JSON (expensive)                     | No serialization (in-memory access)   |
 * | Performance              | Slower, high latency                 | Much faster, low latency              |
 * | Type Safety              | Weak (JSON only)                     | Stronger (direct values & functions)  |
 * | Flexibility              | Tied to bridge architecture          | Works with any JS engine (Hermes, V8) |
 * | New Architecture support | ❌ (not compatible with TurboModules) | ✅ (foundation of TurboModules/Fabric) |
 */
