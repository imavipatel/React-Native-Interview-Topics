/********************************************
 * 📘 TurboModule Registry & Lazy Loading
 ********************************************/

/**
 * 🟢 THEORY:
 * - TurboModules are the new way of writing Native Modules in React Native’s
 *   new architecture (JSI + Fabric).
 * - Instead of eagerly loading ALL native modules at app startup (old Bridge style),
 *   TurboModules use a **Registry** and **Lazy Loading**.
 *
 * 🔹 TurboModule Registry
 * - A central place that keeps track of available TurboModules.
 * - When JS requests a module (`NativeModules.MyModule`), the runtime checks
 *   the Registry and loads it if available.
 * - Modules are not instantiated unless they’re needed → saves startup time.
 *
 * 🔹 Lazy Loading
 * - Native module code is **loaded only when first accessed**, not at app startup.
 * - Example: If you never use `CameraModule`, it never loads → smaller memory usage.
 * - Improves **startup time** and **reduces memory footprint**.
 */

/**
 * 🔹 Example – How Lazy Loading Works
 *
 * // In JS (React Native)
 * import { NativeModules } from 'react-native';
 *
 * // Module is NOT loaded yet
 * console.log("App started");
 *
 * // When you access it → loads from TurboModule registry
 * const result = NativeModules.MyTurboModule.someMethod();
 * console.log(result);
 *
 * ✅ Here, MyTurboModule loads only at first access.
 */

/**
 * 🔹 TurboModule Registry Internals
 * - On the native side, a `TurboModuleRegistry` exists.
 * - It maps JS module names → C++/Java/ObjC TurboModule providers.
 * - At runtime, when JS requests a module, Registry:
 *   1. Checks if it exists.
 *   2. If found, instantiates & returns it.
 *   3. If not found, returns `null`.
 */

/**
 * 🔹 Example – Registering a TurboModule (Android, Java + C++)
 *
 * // Java side – MyModuleSpec.java
 * package com.example;
 * import com.facebook.react.turbomodule.core.interfaces.TurboModule;
 *
 * public interface MyModuleSpec extends TurboModule {
 *   String helloWorld();
 * }
 *
 * // Java implementation – MyModule.java
 * package com.example;
 *
 * public class MyModule extends NativeMyModuleSpec {
 *   public MyModule(ReactApplicationContext reactContext) {
 *     super(reactContext);
 *   }
 *
 *   @Override
 *   public String helloWorld() {
 *     return "Hello from TurboModule!";
 *   }
 * }
 *
 * // Register module provider (TurboModuleRegistry)
 * @Override
 * public TurboModule getModule(String name, ReactApplicationContext context) {
 *   if (name.equals("MyTurboModule")) {
 *     return new MyModule(context);
 *   }
 *   return null;
 * }
 *
 * ✅ JS Usage:
 * import { NativeModules } from "react-native";
 * console.log(NativeModules.MyTurboModule.helloWorld());
 * // "Hello from TurboModule!"
 */

/**
 * 🔹 Benefits of TurboModule Lazy Loading
 * ✅ Faster startup → modules load only when used.
 * ✅ Less memory usage at launch.
 * ✅ Better performance for apps with many native modules.
 * ✅ Works well with Codegen (type-safe bindings).
 */

/**
 * 🔹 Comparison – Old Bridge vs TurboModule Registry
 *
 * | Feature                 | Old Bridge (NativeModules)       | TurboModules (Registry + Lazy Load) |
 * |--------------------------|----------------------------------|-------------------------------------|
 * | Loading strategy         | Eager (all at startup)           | Lazy (on-demand)                    |
 * | Performance cost         | High startup overhead            | Low startup cost                    |
 * | Serialization            | JSON serialization (slow)        | JSI direct calls (fast)             |
 * | Type Safety              | Manual (error-prone)             | Codegen (automatic TS/Flow support) |
 * | Memory usage             | Higher (all modules loaded)      | Lower (load when accessed)          |
 */

/**
 * 🔹 Interview Q&A
 *
 * Q: What is the TurboModule Registry?
 * A: A central system in React Native that manages TurboModules, ensuring they
 *    are created and accessed only when needed.
 *
 * Q: How does Lazy Loading improve performance?
 * A: By delaying the loading of modules until they’re first accessed, reducing
 *    app startup time and memory usage.
 *
 * Q: What happens if a requested TurboModule isn’t registered?
 * A: The Registry returns `null`, and JS should handle it gracefully.
 *
 * Q: How is this different from the old Bridge approach?
 * A: Old Bridge eagerly loaded all modules at startup with JSON serialization,
 *    whereas TurboModules are lazy-loaded and use JSI for fast direct calls.
 */
