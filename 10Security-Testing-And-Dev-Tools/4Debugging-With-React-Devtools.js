/******************************************************
 * 📘 Debugging with React DevTools, Chrome, Hermes Inspector
 ******************************************************/

/********************************************
 * 🟢 Debugging in React Native
 ********************************************/
/**
 * Debugging is essential to understand:
 * - What your app is doing.
 * - Why it’s failing or running slowly.
 * - How state/props are flowing in components.
 *
 * React Native supports multiple debugging tools:
 *   1. React DevTools
 *   2. Chrome Debugger
 *   3. Hermes Inspector
 *
 * Each has its own purpose and strengths.
 */

/********************************************
 * ⚛️ 1. React DevTools
 ********************************************/
/**
 * - Official tool for debugging React apps (web + React Native).
 * - Lets you **inspect component tree** and **analyze re-renders**.
 *
 * 🔹 Features:
 *   ✅ View component hierarchy in real-time.
 *   ✅ Inspect props, state, and context of each component.
 *   ✅ Highlight updates → see what re-rendered and why.
 *   ✅ Check performance by profiling re-renders.
 *
 * 🔹 Setup:
 *   - For RN 0.62+ → Flipper includes React DevTools by default.
 *   - Alternatively, install `react-devtools` globally:
 *       npm install -g react-devtools
 *       react-devtools
 *   - Then connect it with your app (metro bundler must be running).
 *
 * 🔹 Example Debug:
 *   - If a button isn’t working → open React DevTools → inspect button component → check if `onPress` prop exists.
 */

/********************************************
 * 🌐 2. Chrome Debugger
 ********************************************/
/**
 * - Chrome Debugger lets you **run JS code in Chrome V8 engine**
 *   (instead of the device JS engine).
 * - Useful for:
 *   ✅ Setting breakpoints in code.
 *   ✅ Using console.log, network tab, call stack.
 *   ✅ Debugging asynchronous code (Promises, async/await).
 *
 * 🔹 How it works:
 *   - App’s JS thread is redirected to Chrome’s V8 engine.
 *   - Runs remotely → slower than real device execution.
 *
 * 🔹 Setup:
 *   1. Run app in dev mode.
 *   2. Open Developer Menu → Select **“Debug JS Remotely”**.
 *   3. Chrome opens `http://localhost:8081/debugger-ui`.
 *
 * 🔹 Downsides:
 *   - Doesn’t use Hermes/JSC engine → runs code differently.
 *   - Performance profiling may not match real device behavior.
 */

/********************************************
 * ⚡ 3. Hermes Inspector
 ********************************************/
/**
 * - Hermes is a lightweight JS engine optimized for React Native.
 * - Provides its own **debugging and profiling tools**.
 * - Works directly with Hermes bytecode (not Chrome’s V8).
 *
 * 🔹 Features:
 *   ✅ Step-through debugging (breakpoints, watch variables).
 *   ✅ Inspect Hermes-specific bytecode execution.
 *   ✅ Better performance profiling (closer to real device).
 *   ✅ Can connect via Chrome DevTools protocol.
 *
 * 🔹 Setup:
 *   - Enable Hermes in `android/app/build.gradle` or iOS Podfile.
 *   - Run app on device/emulator.
 *   - Open Flipper → Enable **Hermes Debugger plugin**.
 *   - You can also use Chrome DevTools with Hermes protocol.
 *
 * 🔹 Example Debug:
 *   - If JSON parsing is slow, Hermes Inspector shows where time is being spent inside Hermes runtime.
 */

/********************************************
 * ⚖️ Comparison
 ********************************************/
/**
 * | Tool              | Purpose                                  | Pros                                | Cons                              |
 * |-------------------|------------------------------------------|-------------------------------------|-----------------------------------|
 * | React DevTools    | Inspect components, props, state         | Easy, visual, great for React logic | No native-level debugging         |
 * | Chrome Debugger   | Debug JS with breakpoints, console, etc. | Familiar (Chrome tools), easy setup | Runs JS remotely (slower, not Hermes) |
 * | Hermes Inspector  | Debug Hermes runtime & performance       | Accurate profiling, real engine     | Setup needed, more advanced usage |
 */

/********************************************
 * ✅ Best Practices
 ********************************************/
/**
 * - Use **React DevTools** for UI/logic bugs.
 * - Use **Chrome Debugger** for async/network debugging.
 * - Use **Hermes Inspector** for performance and engine-level debugging.
 *
 * Together, these tools cover:
 *   🔹 Component state/prop issues
 *   🔹 API/network bugs
 *   🔹 Performance bottlenecks
 */
