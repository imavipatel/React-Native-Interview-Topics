/********************************************
 * 📘 Memory Management for JSI Modules (HostObject Lifetime)
 ********************************************/

/**
 * 🟢 THEORY:
 * - In React Native New Architecture, JSI (JavaScript Interface) allows JS to call
 *   native C++ objects directly without serialization.
 * - `HostObject` is a special C++ object that can be exposed to JS runtime.
 * - Memory management is critical, since C++ and JS runtimes manage memory differently.
 *
 * 🔹 Key Challenge:
 *   - JS runtime (Hermes/JSC) uses **Garbage Collection (GC)**.
 *   - C++ objects rely on **manual memory management** (new/delete, smart pointers).
 *   - When a `HostObject` is exposed to JS, its **lifetime** must be managed correctly
 *     to avoid:
 *       1. Memory leaks (C++ object never freed).
 *       2. Dangling pointers (C++ object freed while JS still references it).
 *
 * ✅ Solution: Use `shared_ptr` or `unique_ptr` (smart pointers) to manage lifetime safely.
 */

/**
 * 🔹 HostObject Basics
 * - `HostObject` is a subclass of `jsi::HostObject`.
 * - You override `get`, `set`, and optionally `getPropertyNames`.
 * - When JS accesses properties/methods, these callbacks fire.
 */

/**
 * 🔹 Example – Creating a JSI HostObject
 *
 * #include <jsi/jsi.h>
 * using namespace facebook;
 *
 * class CounterHostObject : public jsi::HostObject {
 * private:
 *   int count;
 *
 * public:
 *   CounterHostObject() : count(0) {}
 *
 *   jsi::Value get(jsi::Runtime& rt, const jsi::PropNameID& name) override {
 *     auto propName = name.utf8(rt);
 *     if (propName == "increment") {
 *       // Return a JS function bound to increment logic
 *       return jsi::Function::createFromHostFunction(
 *         rt,
 *         name,
 *         0,
 *         [this](jsi::Runtime& rt, const jsi::Value&, const jsi::Value* args, size_t) -> jsi::Value {
 *           count++;
 *           return jsi::Value(count);
 *         }
 *       );
 *     }
 *     return jsi::Value::undefined();
 *   }
 * };
 *
 * // Register HostObject
 * void installCounter(jsi::Runtime& rt) {
 *   auto counter = std::make_shared<CounterHostObject>();
 *   rt.global().setProperty(rt, "Counter", jsi::Object::createFromHostObject(rt, counter));
 * }
 *
 * ✅ In JS:
 * console.log(Counter.increment()); // 1
 * console.log(Counter.increment()); // 2
 */

/**
 * 🔹 Memory Management
 *
 * - When `std::make_shared<HostObject>` is used:
 *   ✅ C++ `shared_ptr` ensures memory is freed once JS and C++ references are gone.
 *
 * - JSI runtime holds a reference (shared_ptr) to the HostObject.
 *   - As long as JS references exist (e.g., global.Counter), object stays alive.
 *   - When JS GC clears it and no native references exist → shared_ptr count drops to 0 → memory freed.
 *
 * - If you use `new` without smart pointers → you risk memory leaks or crashes.
 */

/**
 * 🔹 Best Practices
 * 1. Always wrap HostObjects with `std::shared_ptr` or `std::unique_ptr`.
 * 2. Avoid raw pointers (`new`/`delete`) since JS GC doesn’t know about them.
 * 3. Do not hold long-lived global raw references; rely on smart pointers.
 * 4. Be careful with circular references:
 *    - If HostObject holds a ref to JS object, and JS object holds HostObject → memory leak.
 * 5. Clean up native resources (file handles, sockets) in destructors.
 */

/**
 * 🔹 Example – Correct Lifetime Management
 *
 * void installModule(jsi::Runtime& rt) {
 *   auto myObj = std::make_shared<MyHostObject>();
 *   auto jsiObj = jsi::Object::createFromHostObject(rt, myObj);
 *   rt.global().setProperty(rt, "MyObj", std::move(jsiObj));
 * }
 *
 * // ✅ myObj is managed by shared_ptr, no leaks.
 */

/**
 * 🔹 Interview Q&A
 *
 * Q: How is memory for HostObjects managed in JSI?
 * A: Through `shared_ptr` ownership between JS runtime and native C++ code.
 *    Once all references (JS + C++) are gone, memory is freed automatically.
 *
 * Q: What happens if you use raw pointers for HostObjects?
 * A: It can lead to memory leaks (never freed) or crashes (freed too early).
 *
 * Q: Can HostObjects cause memory leaks?
 * A: Yes, if circular references exist or smart pointers are not used properly.
 *
 * Q: Why is smart pointer use critical in JSI?
 * A: Because JS GC doesn’t know about native memory; smart pointers bridge
 *    the lifecycle safely.
 */
