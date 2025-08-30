/********************************************
 * 📘 Threading in React Native
 * (JS Thread, Native UI Thread, JSI Thread Pool)
 ********************************************/

/**
 * 🟢 THEORY:
 * React Native apps run on **multiple threads** to handle rendering, JS execution,
 * and background/native tasks. Understanding threading is key for performance optimization.
 *
 * 🔹 Main Threads:
 *   1. **JS Thread** → Executes JavaScript code.
 *   2. **Native UI Thread** → Handles UI rendering, layout, gestures.
 *   3. **JSI Thread Pool (Background threads)** → Runs JSI work, TurboModules, and heavy tasks off JS thread.
 */

/**
 * 1️⃣ JavaScript (JS) Thread
 * - Single-threaded (like browser JS).
 * - Executes:
 *   - React reconciliation (Virtual DOM diffing).
 *   - Business logic.
 *   - API calls, state management.
 * - Blocking this thread = UI freeze (laggy app).
 *
 * Example of blocking JS thread:
 */
function badLoop() {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    // heavy loop
    sum += i;
  }
  console.log(sum); // Freezes UI until loop completes
}

/**
 * 2️⃣ Native UI Thread
 * - Runs on the platform's native UI system:
 *   - Android → Main Looper (UI Thread).
 *   - iOS → Main Dispatch Queue.
 * - Responsible for:
 *   - Drawing UI.
 *   - Handling gestures and animations.
 *   - Measuring layout.
 * - If overloaded → dropped frames (low FPS).
 *
 * Example: A heavy layout pass or too many re-renders
 * can block UI updates.
 */

/**
 * 3️⃣ JSI Thread Pool (Background Threads)
 * - Introduced with New Architecture (JSI).
 * - Pool of threads to offload heavy work from JS/UI.
 * - Used by:
 *   - TurboModules (native work).
 *   - Fabric Renderer (layout, Yoga calculations).
 *   - Background tasks like image processing, async storage.
 *
 * Benefit:
 * - Prevents blocking JS/UI threads → keeps app smooth.
 *
 * Example: Offloading work via JSI
 */
import { NativeModules } from "react-native";
const { HeavyComputationModule } = NativeModules;

// Native code runs in background JSI thread pool
HeavyComputationModule.calculatePrimes(50000).then((result) => {
  console.log("Result from native thread:", result);
});

/**
 * 🔹 Thread Communication
 * - Threads must coordinate:
 *   - JS → Native Bridge (old arch).
 *   - JS → JSI (direct calls, new arch).
 * - Use cases:
 *   - JS asks Native to render UI → Native UI thread executes.
 *   - JS calls TurboModule → Runs in JSI thread pool → returns result.
 */

/**
 * 🔹 Performance Best Practices
 * 1. ✅ Avoid blocking JS thread with heavy loops or large JSON parsing.
 * 2. ✅ Offload heavy tasks to JSI/native workers.
 * 3. ✅ Use `InteractionManager.runAfterInteractions` for deferred work.
 * 4. ✅ Use `useNativeDriver` for animations (runs on UI thread).
 * 5. ✅ Use libraries like Reanimated 2 → animations run on UI thread, not JS.
 */

/**
 * 🔹 Interview Q&A
 *
 * Q: What happens if the JS thread is blocked?
 * A: UI freezes (no state updates, no navigation, no animations).
 *
 * Q: What runs on the Native UI thread?
 * A: Rendering, gestures, animations, and layout measurement.
 *
 * Q: How does the JSI thread pool help performance?
 * A: It runs heavy work in background threads, freeing JS/UI threads.
 *
 * Q: Can UI thread and JS thread run in parallel?
 * A: Yes, they’re independent. But too much communication (Bridge overhead in old arch) can cause bottlenecks.
 *
 * Q: Which thread does Hermes/JSC execute JS code on?
 * A: JS Thread.
 *
 * Q: Why does Reanimated 2 improve performance?
 * A: It moves animation work from JS thread to Native UI thread via JSI.
 */
