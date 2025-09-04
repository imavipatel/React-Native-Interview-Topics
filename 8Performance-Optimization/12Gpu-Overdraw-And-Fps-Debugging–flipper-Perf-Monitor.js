/* =============================================================================
📘 GPU Overdraw & FPS Debugging – Flipper Perf Monitor in React Native
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- Mobile apps need to maintain smooth 60 FPS (frames per second) for fluid UI.
- Two main performance problems in React Native rendering:
  1. GPU Overdraw → when the same pixel is drawn multiple times unnecessarily.
  2. Low FPS → caused by heavy JS thread work or UI thread congestion.

Flipper’s Performance Monitor helps developers **detect FPS drops** and
**analyze GPU overdraw issues** in real time.
*/

/* =============================================================================
🔹 1. GPU Overdraw
-----------------------------------------------------------------------------
- Definition:
   → Happens when the GPU draws the same pixel more than once in a frame.
   → Example: Rendering multiple nested Views with backgrounds → inner Views 
     overwrite pixels drawn by outer Views.

- Why it’s bad?
   ❌ Wastes GPU resources.
   ❌ Causes jank (laggy UI).
   ❌ Increases battery consumption.

- Common causes of overdraw:
  ✅ Too many nested Views.
  ✅ Multiple overlapping backgrounds.
  ✅ Unnecessary opacity or transparent layers.
  ✅ Large images placed behind other components.

- Debugging GPU Overdraw:
   - On Android → Developer Options → "Debug GPU Overdraw" (color overlay shows overdraw).
   - In Flipper → Performance Monitor plugin gives overdraw insights.

- Optimization strategies:
  ✅ Flatten View hierarchy (use fewer nested Views).
  ✅ Remove unnecessary backgrounds (transparent where possible).
  ✅ Use absolute positioning instead of nested containers.
  ✅ Optimize images (resize, compress).
*/

/* =============================================================================
🔹 2. FPS (Frames Per Second)
-----------------------------------------------------------------------------
- FPS measures how smoothly the app renders animations & UI updates.
- Goal: 60 FPS (frame every ~16ms).
- If FPS drops below 60 → app feels laggy or unresponsive.

- Types of FPS to monitor:
  ✅ UI FPS (how fast UI thread renders frames).
  ✅ JS FPS (how fast JS thread executes code).

- Causes of FPS drops:
  ❌ Heavy computations in JS thread (loops, JSON parsing).
  ❌ Too many re-renders (state changes, props drilling).
  ❌ Large images or unoptimized FlatLists.
  ❌ Blocking animations on the UI thread.

- Debugging FPS:
   - Flipper Perf Monitor shows **JS FPS** & **UI FPS** separately.
   - Low JS FPS = heavy JS logic.
   - Low UI FPS = layout/animation/rendering problem.
*/

/* =============================================================================
🔹 3. Flipper Performance Monitor
-----------------------------------------------------------------------------
- Flipper = React Native’s official debugging tool (by Meta).
- Perf Monitor Plugin in Flipper provides:
  ✅ Real-time FPS monitoring (JS & UI threads).
  ✅ Memory usage tracking.
  ✅ Overdraw analysis (via dev settings on Android).
  ✅ Helps identify re-render bottlenecks.

- Steps to use:
  1. Install Flipper on your desktop.
  2. Connect your RN app (ensure Flipper integration is enabled).
  3. Open "Performance" plugin.
  4. Monitor:
     - JS FPS
     - UI FPS
     - Memory usage
     - Frame drops
*/

/* =============================================================================
🔹 4. Best Practices for Optimizing Overdraw & FPS
-----------------------------------------------------------------------------
✅ Keep View hierarchy flat (avoid deeply nested Views).
✅ Remove unnecessary wrappers (use React.Fragment or <></> where possible).
✅ Use `shouldComponentUpdate`, `React.memo`, `useCallback` to reduce re-renders.
✅ Use `useNativeDriver: true` for animations (offload to UI thread).
✅ Optimize FlatList with `keyExtractor`, `getItemLayout`, `removeClippedSubviews`.
✅ Avoid heavy work on the JS thread (use WebWorkers, optimize loops).
✅ Optimize image sizes & caching.
✅ Test with Flipper Perf Monitor + Android GPU Debug tools.
*/

/* =============================================================================
🔹 Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: What is GPU Overdraw?
   → Drawing the same pixel multiple times before the final frame.

Q2: Why does GPU overdraw cause performance issues?
   → It makes the GPU do extra work, wasting battery and causing jank.

Q3: How to detect FPS problems in React Native?
   → Use Flipper Performance Monitor (shows JS FPS & UI FPS).

Q4: How to fix FPS drops?
   → Reduce re-renders, optimize lists, use native driver animations,
     and move heavy JS work off the main thread.
*/

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- GPU Overdraw = redundant pixel drawing → fix by flattening layouts.
- FPS debugging = check JS FPS vs UI FPS in Flipper.
- Flipper Performance Monitor = essential tool for diagnosing RN performance issues.
============================================================================= */
