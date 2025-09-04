/********************************************
 * 📘 Direct JSI Calls – C++ HostObjects
 ********************************************/

/**
 * 🟢 THEORY:
 * - JSI (JavaScript Interface) lets JS talk directly with C++ objects.
 * - Normally, JS ↔ Native communication used the old Bridge (slow, async).
 * - With **HostObjects**, you can expose native C++ objects directly into JS.
 *
 * 🔹 What is a HostObject?
 * - A C++ class implementing `facebook::jsi::HostObject`.
 * - It behaves like a JS object, but methods/properties are backed by C++.
 * - Example: Exposing `getDeviceName()` from C++ → JS directly.
 *
 * 🔹 Why use HostObjects?
 * 1. Super fast – no JSON serialization like the Bridge.
 * 2. Direct function/property access from JS.
 * 3. Good for performance-critical modules (crypto, image processing, etc.).
 * 4. Memory shared directly (zero-copy possible).
 */

/**
 * 🔹 Example – Creating a HostObject
 *
 * // MyHostObject.h
 * #include <jsi/jsi.h>
 * using namespace facebook;
 *
 * class MyHostObject : public jsi::HostObject {
 * public:
 *   // Properties exposed to JS
 *   jsi::Value get(jsi::Runtime& rt, const jsi::PropNameID& name) override {
 *     auto propName = name.utf8(rt);
 *     if (propName == "deviceName") {
 *       return jsi::String::createFromUtf8(rt, "Pixel_8_Pro");
 *     }
 *     return jsi::Value::undefined();
 *   }
 *
 *   // Optional: handle property setting
 *   void set(jsi::Runtime& rt, const jsi::PropNameID& name, const jsi::Value& value) override {
 *     // e.g. update C++ variable from JS
 *   }
 * };
 *
 * // Installing into JS runtime
 * void installMyHostObject(jsi::Runtime& rt) {
 *   auto hostObj = std::make_shared<MyHostObject>();
 *   auto obj = jsi::Object::createFromHostObject(rt, hostObj);
 *   rt.global().setProperty(rt, "MyNative", std::move(obj));
 * }
 *
 * ✅ Now from JavaScript:
 * console.log(MyNative.deviceName); // "Pixel_8_Pro"
 */

/**
 * 🔹 Example – Exposing Methods
 *
 * class MyHostObject : public jsi::HostObject {
 * public:
 *   jsi::Value get(jsi::Runtime& rt, const jsi::PropNameID& name) override {
 *     auto propName = name.utf8(rt);
 *     if (propName == "add") {
 *       return jsi::Function::createFromHostFunction(
 *         rt,
 *         name,
 *         2, // arguments
 *         [](jsi::Runtime& rt, const jsi::Value&, const jsi::Value* args, size_t count) -> jsi::Value {
 *           int a = args[0].asNumber();
 *           int b = args[1].asNumber();
 *           return jsi::Value(a + b);
 *         }
 *       );
 *     }
 *     return jsi::Value::undefined();
 *   }
 * };
 *
 * ✅ Now from JavaScript:
 * console.log(MyNative.add(10, 20)); // 30
 */

/**
 * 🔹 Benefits of HostObjects:
 * ✅ Direct sync access to native data.
 * ✅ No Bridge / no JSON serialization.
 * ✅ Great for CPU-heavy or performance-critical tasks.
 * ✅ Memory sharing between JS & native.
 * ✅ Can expose both properties & functions.
 */

/**
 * 🔹 Use Cases:
 * - Crypto & hashing functions (fast execution in C++).
 * - Real-time features (AR/VR, sensors, gestures).
 * - Native libraries integration (C++ SDKs).
 * - Zero-copy data sharing (e.g., passing image/video buffer directly).
 */

/**
 * 🔹 Comparison Table
 *
 * | Approach            | Communication Path            | Speed        | Use Case                        |
 * |----------------------|--------------------------------|--------------|---------------------------------|
 * | Legacy Bridge        | JS → JSON → Bridge → Native   | Slow (async) | UI updates, basic native calls  |
 * | TurboModules         | JS → JSI → C++ → NativeModule | Fast         | Modern native modules           |
 * | HostObjects (JSI)    | JS ↔ C++ directly             | Fastest (sync)| Expose native logic as objects  |
 */

/**
 * 🔹 Interview Q&A
 *
 * Q: What is a HostObject in JSI?
 * A: A C++ class that looks like a JS object when exposed, allowing JS to access native properties/methods directly.
 *
 * Q: Why is it faster than the Bridge?
 * A: Because it skips JSON serialization and async batching. Calls are direct C++ → JS function/property lookups.
 *
 * Q: Example use case for HostObjects?
 * A: Exposing a native crypto library (e.g., SHA256) directly to JS without Bridge overhead.
 *
 * Q: How is it different from TurboModules?
 * A: TurboModules wrap functions in a JSI-compatible way for modularity. HostObjects directly expose C++ objects into JS.
 */
