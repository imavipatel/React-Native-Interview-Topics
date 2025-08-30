/**
 * =============================================================================
 * 📘 Hermes Engine vs JavaScriptCore (JSC)
 * =============================================================================
 *
 * 🟢 Introduction
 * -----------------------------------------------------------------------------
 * - React Native apps run JavaScript code inside a **JavaScript engine**.
 * - Two main engines:
 *   1. **JSC (JavaScriptCore)** → Default engine in iOS, originally used in RN.
 *   2. **Hermes** → A lightweight, optimized JavaScript engine by Meta
 *      designed specifically for React Native.
 *
 * =============================================================================
 * 🔹 JavaScriptCore (JSC)
 * -----------------------------------------------------------------------------
 * - Default JS engine for React Native (before Hermes).
 * - Comes built-in with iOS.
 * - Android bundles JSC separately → increases app size.
 *
 * ✅ Features:
 * - Compiles JavaScript **just-in-time (JIT)** at runtime.
 * - No precompiled bytecode → parsing & compilation happen on device.
 * - Larger startup time because JS code must be parsed & compiled at app launch.
 *
 * ✅ Limitations:
 * - Higher memory usage.
 * - Slower startup (cold start issue).
 * - Limited optimizations for low-end devices.
 *
 * =============================================================================
 * 🔹 Hermes Engine
 * -----------------------------------------------------------------------------
 * - Lightweight JavaScript engine built by Meta for **React Native apps**.
 * - Focus: **performance on mobile devices**.
 * - Ships with React Native (especially Android).
 *
 * ✅ Key Features:
 * 1. **Ahead-of-Time (AOT) Compilation**
 *    - JS code is precompiled into **bytecode** at build time.
 *    - Bytecode is loaded directly at runtime → faster startup.
 *
 * 2. **Smaller Memory Usage**
 *    - Optimized garbage collector.
 *    - Better suited for low-end Android devices.
 *
 * 3. **Deterministic Garbage Collection**
 *    - Reduces "jank" during animations.
 *
 * 4. **Improved Debugging**
 *    - Supports Chrome DevTools debugging.
 *    - Has its own profiler.
 *
 * ✅ Benefits:
 * - 🚀 Faster app startup.
 * - 📉 Lower memory consumption.
 * - 🔋 Better performance on low-end Android devices.
 *
 * =============================================================================
 * 🔹 Bytecode vs JSC Execution
 * -----------------------------------------------------------------------------
 *
 * 1. **JSC Workflow**
 *    - App bundles raw **JavaScript** code.
 *    - At runtime:
 *        ➝ Parse JS
 *        ➝ Compile (JIT)
 *        ➝ Execute
 *    - ❌ Slower startup because parsing/compiling happen on device.
 *
 * 2. **Hermes Workflow**
 *    - App bundles **bytecode** (precompiled at build time).
 *    - At runtime:
 *        ➝ Load bytecode
 *        ➝ Execute directly
 *    - ✅ Faster startup, less CPU usage.
 *
 * =============================================================================
 * 🔹 Example (Build with Hermes)
 * -----------------------------------------------------------------------------
 * In `android/app/build.gradle`:
 *
 * project.ext.react = [
 *   enableHermes: true,  // 👈 Enable Hermes
 * ]
 *
 * Then rebuild app → Hermes will compile JS into bytecode.
 *
 * =============================================================================
 * 🔹 Comparison Table
 * -----------------------------------------------------------------------------
 *
 * | Feature                 | JSC (JavaScriptCore)        | Hermes Engine              |
 * |--------------------------|-----------------------------|----------------------------|
 * | Startup time             | Slower (parsing + JIT)      | Faster (bytecode prebuilt) |
 * | Memory usage             | Higher                      | Lower                      |
 * | Garbage collection       | Non-deterministic           | Deterministic              |
 * | App size (Android)       | Bigger (bundles JSC)        | Smaller (optimized)        |
 * | Performance (low-end)    | Poor                        | Optimized                  |
 * | Debugging support        | Chrome DevTools             | Chrome DevTools + Profiler |
 *
 * =============================================================================
 * 🔹 Q&A (Interview Style)
 * -----------------------------------------------------------------------------
 * Q1: Why is Hermes faster at startup than JSC?
 *   → Because Hermes uses **precompiled bytecode** instead of parsing JS at runtime.
 *
 * Q2: Does Hermes improve runtime execution speed?
 *   → It mainly improves **startup performance** and **memory usage**. Runtime
 *     speed is comparable but more stable due to optimized GC.
 *
 * Q3: Do we need Hermes on iOS?
 *   → iOS already uses system JSC. Hermes is optional but supported for consistency.
 *
 * Q4: What’s the main tradeoff of Hermes?
 *   → Slightly larger build time & APK size increase (due to bytecode files).
 *
 * =============================================================================
 * ✅ Final Takeaway
 * -----------------------------------------------------------------------------
 * - Hermes is **optimized for React Native** → reduces startup time & memory.
 * - Bytecode execution = no runtime parsing/compiling → better user experience.
 * - Recommended for **Android apps**, especially targeting low-end devices.
 * =============================================================================
 */
