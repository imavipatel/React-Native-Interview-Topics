/********************************************
 * 📘 Codegen – Generating C++ Based Module Interfaces in React Native
 ********************************************/

/**
 * 🟢 THEORY:
 * - **Codegen** is part of React Native’s **New Architecture**.
 * - It **automatically generates type-safe, C++ bridge bindings** between JavaScript and Native code.
 * - Instead of manually writing NativeModules (Java, Obj-C/Swift), Codegen ensures:
 *    ✅ Strong type-safety
 *    ✅ Faster execution (via JSI)
 *    ✅ Less boilerplate
 *
 * 🔹 Why Codegen?
 * 1. In old RN (Paper + NativeModules):
 *    - Devs manually wrote bridging code (Java/Obj-C).
 *    - Errors were runtime only (no type-safety).
 *    - Boilerplate-heavy.
 *
 * 2. In New Architecture (Fabric + TurboModules):
 *    - Use **Codegen** to auto-generate **C++ bindings** from TypeScript/Flow definitions.
 *    - Ensures **compile-time safety**.
 *    - Provides **direct JSI access** → no JSON serialization over the bridge.
 *
 * 🔹 Workflow:
 *   TS/Flow Spec → Codegen → Auto-generated C++ + Java/ObjC bindings → Used in JS & Native.
 */

/**
 * 🔹 Example – Defining a Module Spec
 *
 * // MyModuleNativeSpec.js (Flow or TS spec file)
 * import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
 * import * as TurboModuleRegistry from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
 *
 * export interface Spec extends TurboModule {
 *   +addNumbers: (a: number, b: number) => number;
 * }
 *
 * export default (TurboModuleRegistry.getEnforcing<Spec>('MyModule'): Spec);
 *
 * ⚡ Here:
 * - We declare the method `addNumbers`
 * - Codegen will auto-generate the C++/native glue.
 */

/**
 * 🔹 What Codegen Produces:
 * - From the JS/TS spec → RN’s Codegen produces:
 *   1. **C++ interface** for TurboModule
 *   2. **Platform-specific bindings** (Java, Obj-C++)
 *   3. **Type-safe JS module** to call from React code
 *
 * This eliminates manual bridging!
 */

/**
 * 🔹 Example of Usage in JS
 *
 * import MyModule from './MyModuleNativeSpec';
 *
 * const result = MyModule.addNumbers(5, 10);
 * console.log(result); // 15
 *
 * - Under the hood:
 *   JS → JSI → C++ generated binding → Native method → return result
 */

/**
 * 🔹 Example of Generated C++ Interface (simplified)
 *
 * class MyModuleSpec : public facebook::react::TurboModule {
 *  public:
 *    MyModuleSpec(std::shared_ptr<CallInvoker> jsInvoker);
 *    virtual int addNumbers(int a, int b) = 0;
 * };
 *
 * - You as a dev only implement `addNumbers` in C++/Java/ObjC.
 * - JS calls are automatically bound.
 */

/**
 * 🔹 Benefits of Codegen:
 * - ✅ Type-safe: Compile-time type checking between JS & Native.
 * - ✅ No manual bridge: Auto-generates C++ interface & platform bindings.
 * - ✅ Faster: No JSON serialization/deserialization.
 * - ✅ Works with TurboModules + Fabric.
 * - ✅ Reduces boilerplate for native modules.
 */

/**
 * 🔹 Comparison (Old vs New)
 *
 * | Feature              | Old NativeModules (Bridge)     | New (TurboModules + Codegen) |
 * |-----------------------|---------------------------------|------------------------------|
 * | Type-safety          | ❌ Runtime only                | ✅ Compile-time enforced     |
 * | Performance          | Slower (JSON over Bridge)      | Faster (Direct JSI calls)   |
 * | Boilerplate          | High (manual bridging)         | Low (auto-gen bindings)     |
 * | Language Support     | Java/ObjC only                 | C++ core + Java/ObjC impl   |
 * | Error detection      | Late (runtime crash)           | Early (compile-time error)  |
 */

/**
 * 🔹 Interview Q&A
 *
 * Q: What is Codegen in React Native New Architecture?
 * A: A system that auto-generates type-safe C++ bindings between JS and native code using TypeScript/Flow definitions.
 *
 * Q: Why is Codegen needed?
 * A: To remove manual bridging, improve performance, enforce type-safety, and integrate seamlessly with TurboModules/Fabric.
 *
 * Q: How does Codegen improve performance?
 * A: It removes the bridge layer (JSON serialization) and uses direct JSI calls to native functions.
 *
 * Q: How do you define a native module in Codegen?
 * A: By writing a Flow/TypeScript spec file with method signatures, which Codegen uses to auto-generate bindings.
 */
