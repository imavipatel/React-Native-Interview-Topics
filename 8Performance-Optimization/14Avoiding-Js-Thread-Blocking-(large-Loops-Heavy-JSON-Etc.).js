/* =============================================================================
📘 Avoiding JS Thread Blocking in React Native
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- React Native uses a **single JS thread** (like the browser main thread).
- If heavy work is done (loops, big JSON parsing, complex calculations),
  the JS thread **blocks** → UI freezes, animations stutter, taps lag.
- Goal: Keep the JS thread light and delegate heavy tasks elsewhere.
*/

/* =============================================================================
🔹 1. What Causes JS Thread Blocking?
-----------------------------------------------------------------------------
❌ Large synchronous loops
   → Example: running a for-loop with millions of iterations.

❌ Heavy JSON parsing / stringifying
   → Example: Parsing large API responses without optimization.

❌ Complex calculations on JS side
   → Example: Cryptography, sorting huge datasets.

❌ Multiple expensive re-renders
   → Caused by unoptimized state updates.

❌ Blocking timers
   → setTimeout / setInterval with heavy logic inside.

❌ Large image / data processing in JS
   → e.g., manipulating raw base64 images in JS.
*/

/* =============================================================================
🔹 2. Why is This a Problem?
-----------------------------------------------------------------------------
- RN UI rendering depends on JS thread communication with the native side.
- If JS thread is blocked:
  - UI freezes (no frame updates).
  - Animations become janky.
  - User interactions (touch, scroll) feel delayed.
  - "App not responding" warnings (especially on Android).
*/

/* =============================================================================
🔹 3. Techniques to Avoid Blocking
-----------------------------------------------------------------------------
✅ Break large loops into smaller chunks
   - Use setTimeout / requestIdleCallback / InteractionManager to schedule
     chunks instead of blocking at once.

📌 Example – Breaking Large Loop
---------------------------------
function heavyLoop() {
  let i = 0;
  function processChunk() {
    const end = Math.min(i + 1000, 1000000);
    while (i < end) {
      // do work
      i++;
    }
    if (i < 1000000) {
      setTimeout(processChunk, 0); // schedule next chunk
    }
  }
  processChunk();
}

✅ Offload heavy work to Background Threads
   - Use libraries like **react-native-worker-threads** or **react-native-multithreading**.
   - For JSON or computation-heavy tasks.

✅ Use InteractionManager
   - Defer non-urgent work until after UI interactions/animations complete.

📌 Example – Using InteractionManager
---------------------------------
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  // Heavy work that won’t block animations
});

✅ Optimize JSON parsing
   - If data is huge, consider **streaming JSON parsers**.
   - Break down parsing into smaller chunks.

✅ Avoid large inline computations in render()
   - Pre-calculate values outside render.
   - Memoize with useMemo / useCallback.

✅ Use Native Modules for heavy tasks
   - Offload CPU-intensive tasks to native (C++/Java/Kotlin/Swift).
   - Example: image processing, encryption.

✅ Debounce / throttle frequent operations
   - Prevents excessive function calls from overwhelming JS thread.
   - Use lodash.debounce or lodash.throttle.
*/

/* =============================================================================
🔹 4. Example – JSON Parsing without Blocking
-----------------------------------------------------------------------------
async function parseLargeJSON(data) {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      const result = JSON.parse(data); // heavy task
      resolve(result);
    });
  });
}
*/

/* =============================================================================
🔹 5. Best Practices
-----------------------------------------------------------------------------
✅ Keep your render functions pure & fast.
✅ Avoid synchronous long loops – always break work into chunks.
✅ Use FlatList / VirtualizedList for rendering large data sets.
✅ Prefer Background threads for CPU-heavy logic.
✅ Use Hermes engine – faster JSON.parse, smaller GC pauses.
✅ Profile performance with Flipper Perf Monitor.
*/

/* =============================================================================
🔹 6. Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: What happens if JS thread is blocked in React Native?
   → UI freezes, gestures lag, animations stutter.

Q2: How to avoid blocking when looping over large data?
   → Break loop into chunks using setTimeout / requestIdleCallback / InteractionManager.

Q3: When should we use InteractionManager?
   → For deferring heavy non-urgent tasks until after animations or transitions.

Q4: Can Hermes help with JS blocking?
   → Yes, Hermes improves JSON parsing & reduces GC pauses, but you still need
     to chunk tasks for very large data.
*/

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- Keep JS thread **free for UI work**.
- Break heavy tasks into smaller async chunks.
- Use background threads / native modules for CPU-intensive work.
- Monitor with Flipper to catch frame drops early.
============================================================================= */
