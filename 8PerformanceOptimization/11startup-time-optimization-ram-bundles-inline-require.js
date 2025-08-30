/* =============================================================================
📘 Startup Time Optimization – RAM Bundles & Inline Requires in React Native
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- Startup time = how fast the app loads from cold start (when app is opened fresh).
- React Native apps can feel slow if too many JS modules are loaded at once.
- Two main techniques to optimize startup time:
  ✅ RAM Bundles
  ✅ Inline Requires
*/

/* =============================================================================
🔹 1. RAM Bundles
-----------------------------------------------------------------------------
- RAM = Random Access Modules.
- Instead of loading the whole JS bundle at once,
  it splits code into many small modules.
- Modules are loaded "on demand" when first needed → reduces initial load time.
- Great for apps with many features but not all used at startup.

✅ Benefits:
- Faster cold start (load only required modules).
- Reduces memory pressure at launch.
- Optimized for large apps with many dependencies.

⚠️ Downsides:
- Slightly slower when loading new modules for the first time.
- More complex debugging setup.

🔹 How to enable RAM bundles:
- In metro.config.js:

*/
module.exports = {
  transformer: {
    ramBundle: true, // enables RAM bundle
  },
};
/*
- Then build the app. Metro will create "indexed RAM bundle".
*/

/* =============================================================================
🔹 2. Inline Requires
-----------------------------------------------------------------------------
- By default, React Native loads all `require/import` statements at startup.
- "Inline requires" delays loading of a module until it's actually used.
- Example:
   ❌ Without inline require → entire file loaded at startup.
   ✅ With inline require → file loaded only when function/component is called.

✅ Benefits:
- Smaller JS execution at startup.
- Faster time-to-interactive for first screen.

⚠️ Downsides:
- Small delay when module is used for the first time.
- Works best when used with RAM bundles.

🔹 Example:
*/

// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // enable inline requires
      },
    }),
  },
};

/*
Example Explanation:
- `inlineRequires: true` means RN won’t load every module on startup.
- Instead, it loads modules only when they are needed.
*/

/* =============================================================================
🔹 Combined Strategy – RAM Bundles + Inline Requires
-----------------------------------------------------------------------------
- RAM Bundles reduce initial bundle size (split into modules).
- Inline Requires delay execution of modules until needed.
- Together → huge improvement in cold start performance.
*/

/* =============================================================================
🔹 Best Practices for Startup Time Optimization
-----------------------------------------------------------------------------
✅ Enable `inlineRequires` in metro config for faster startup.
✅ Use `RAM bundles` for large production apps with many screens/features.
✅ Avoid importing heavy libraries (e.g., moment.js, lodash) at the top level.
✅ Prefetch critical assets/screens while showing splash screen.
✅ Use lazy loading (`React.lazy`, `Suspense`) for screens not needed immediately.
✅ Profile startup performance using tools like `Systrace` and `Flipper`.
*/

/* =============================================================================
🔹 Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: What are RAM Bundles?
   → They split the JS bundle into smaller modules that load on demand.

Q2: What is inline requires in React Native?
   → A technique that delays loading of modules until they are actually needed.

Q3: Which one should you use for startup optimization?
   → Both. Inline Requires improves JS execution, RAM bundles optimize memory.

Q4: Any trade-offs?
   → First-time access of modules may cause a small delay.
      Debugging RAM bundles is harder.
*/

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- RAM Bundles → Split JS bundle into small modules, load on demand.
- Inline Requires → Load JS modules only when used.
- Together, they reduce **cold start time** and make apps feel much faster.
============================================================================= */
