/**
 * react-native-bundling-and-metro-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 * "How React Native bundles the app and how Metro (the bundler) works"
 *
 * Very simple language. Nothing removed — everything explained step-by-step.
 *
 * Contents:
 *  - What bundling means for React Native
 *  - The Metro server (dev mode) and what it does
 *  - How Metro creates a bundle (transform -> dependency graph -> serialize)
 *  - Dev features: HMR, Fast Refresh, source maps
 *  - Production bundling (release app) and differences
 *  - Assets handling (images, fonts)
 *  - Hermes & precompiled bytecode
 *  - Metro config examples and common options
 *  - Troubleshooting & tips
 *  - Commands you will run (copy-paste)
 *  - Interview Q&A + cheat-sheet
 *
 * Read it slowly — it's written for beginners.
 */

/* ===========================================================================
📌 0. WHAT IS "BUNDLING" IN REACT NATIVE? (simple)
===============================================================================
- Bundling means taking all your JavaScript files (and their imports) and
  combining them into one or more files that the app can load at runtime.
- React Native apps run JS inside a JS engine (Hermes, JSC).
- The bundle is the JS code the engine executes on device.
- On device we also need assets (images, fonts). The bundler collects them and
  gives the app the correct paths/metadata.
*/

/* ===========================================================================
📌 1. TWO PHASES: DEVELOPMENT vs PRODUCTION (big picture)
===============================================================================
DEV (Metro server + bundler in dev mode):
  - You run `npx react-native start` or run app from IDE.
  - Metro starts a dev server on your computer (usually localhost:8081).
  - The app (simulator/device) requests JS from Metro. Metro transforms files
    on the fly and serves them.
  - Benefits: fast iteration, Hot Reload / Fast Refresh, source maps, debugger.

PROD (pack the bundle into the app):
  - For release builds, Metro creates a minified bundle file (index.android.bundle / index.ios.bundle).
  - The bundle is embedded inside the APK/AAB or the IPA (or packaged as Hermes bytecode).
  - No dev server required on device; app uses the bundled JS at startup.
  - Bundle is optimized: minified, maybe precompiled (Hermes), no dev code.
*/

/* ===========================================================================
📌 2. METRO SERVER — WHAT IS IT? (simple)
===============================================================================
- Metro is the JavaScript bundler used by React Native.
- It has 3 main jobs:
  1. Parse your files and find every import/require (dependency graph).
  2. Transform modern JS/TS/JSX to plain JS that the engine understands (Babel).
  3. Package/serialize the result into one file (or RAM bundle / multiple files).
- Metro also serves static assets (images) and source maps in dev.
- It runs as a local HTTP server during development and responds to bundle requests.
*/

/* ===========================================================================
📌 3. HOW METRO BUILDS A BUNDLE (step-by-step, simple)
===============================================================================
High level flow when Metro bundles JS:

1) ENTRY FILE
   - Metro starts from an entry file (usually index.js).
   - This is the root of the app.

2) PARSE & DEPENDENCY GRAPH
   - Metro reads the file and finds imports/requires.
   - For each import, Metro reads that file and finds its imports.
   - This continues until all reachable files are discovered.
   - The result is a directed graph of modules (dependency graph).

3) TRANSFORM (BABEL)
   - Each source file is transformed:
     • JSX -> JS
     • TypeScript -> JS (if TS support)
     • New syntax converted to supported syntax
   - Plugins like react-refresh are applied in dev.

4) OPTIMIZE & TRANSFORM OPTIONS
   - inlineRequires: option to make some requires lazy (help startup)
   - minifier: for production Metro runs a minifier (uglify/terser) to shrink code

5) SERIALIZE (PACKAGE)
   - Metro takes transformed modules and packs them into a single JS file format
     the native runtime can load. The Metro "wrapper" maps module ids to code.
   - For RAM bundles, Metro creates many small modules that the app loads on demand.

6) ASSETS & MANIFEST
   - Metro collects images/fonts required by JS.
   - It assigns them numeric IDs and produces a manifest so `require('./img.png')`
     returns the right resource info on native side.

7) OUTPUT
   - Dev: Metro serves JS over HTTP each time the app requests it.
   - Prod: Metro writes one (or more) files to disk for embedding into the binary.
*/

/* ===========================================================================
📌 4. BUNDLE FORMATS (what Metro can make)
===============================================================================
- Single bundle: one JS file (classic). Good and simple.
- RAM bundle: bundle split into modules in a special format; loads modules on demand.
- Hermes bytecode bundle: JS compiled to Hermes bytecode ahead-of-time (AOT).
- Each format affects startup time, size, and memory usage.
*/

/* ===========================================================================
📌 5. DEV FEATURES: FAST REFRESH, HMR, SOURCE MAPS
===============================================================================
Fast Refresh / HMR:
  - Metro supports Fast Refresh (auto updating changed components without full reload).
  - This keeps component state often intact and is fast for dev.

Source Maps:
  - Metro generates source maps so stack traces & debugger show original files/lines.
  - Useful for debugging during development.

Dev tools:
  - Metro integrates with Flipper, React DevTools, Chrome debugger, Hermes debugger.
*/

/* ===========================================================================
📌 6. PRODUCTION BUNDLING — WHAT CHANGES
===============================================================================
Differences from dev bundle:
  - Minified code (smaller size).
  - No dev-only helpers (no __DEV__ debugging code).
  - May be precompiled for Hermes (bytecode).
  - Assets paths are embedded so app can load images offline.
  - No fast refresh or dev server required.

Typical command (Android release bundle example):
  cd android
  ./gradlew assembleRelease
This triggers the RN gradle plugin to run Metro and embed a production bundle.
You can also manually create a bundle:
  npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
*/

/* ===========================================================================
📌 7. ASSETS (images, fonts) — how Metro handles them
===============================================================================
- When you do `require('./logo.png')`, Metro:
  1) copies the image to the app assets folder (in build step)
  2) returns a numeric asset ID and a small object describing size & scale
- Native code (Image component) uses that ID to load correct image resource.
- For remote images, you use uri: 'https://...' (not bundled).
- Fonts: usually linked via native project (or using react-native link / autolinking)
- Avoid bundling many huge images in the JS bundle; use proper sizes and compression.
*/

/* ===========================================================================
📌 8. INLINE REQUIRES & LAZY LOADING (why they help)
===============================================================================
- inlineRequires delays evaluating a module until it's first required.
- This reduces the amount of work done during app cold start.
- Enable it in metro.config.js:
    transformer: { getTransformOptions: async () => ({ transform: { inlineRequires: true } }) }
- Use dynamic import / React.lazy to lazy-load heavy screens.
- Together they shrink startup time (not necessarily final bundle bytes).
*/

/* ===========================================================================
📌 9. HERMES: A SPECIAL CASE
===============================================================================
- Hermes is a JS engine that can run precompiled bytecode.
- Precompiling (AOT) converts JS to Hermes bytecode at build time.
- Benefit: faster startup and sometimes smaller on-disk size.
- To use Hermes:
  • enable Hermes in Android / iOS build config
  • optionally enable Hermes bytecode precompilation during build
- The exact steps depend on RN version and build system (Gradle / Xcode).
*/

/* ===========================================================================
📌 10. METRO CONFIG — SIMPLE EXAMPLE & COMMON OPTIONS
===============================================================================
Create metro.config.js at project root to customize Metro.

Basic example:
*/
//// metro.config.js
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      // enable inline requires for faster cold start
      getTransformOptions: async () => ({
        transform: { experimentalImportSupport: false, inlineRequires: true },
      }),
      // For advanced use: custom minifier or babel transform
    },
    resolver: {
      ...defaultConfig.resolver,
      // extraNodeModules: { /* alias libs */ },
      // sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
    },
    watchFolders: [
      /* add extra folders if you have monorepo */
    ],
  };
})();

/*
 Common options:
  - transform.module: custom transformer (Babel/TS)
  - resolver.sourceExts: add 'cjs', 'mjs' if needed
  - serializer: customize bundle output (ramBundle, modules)
  - server: change port, enhance middleware
*/

/* ===========================================================================
📌 11. BUILD COMMANDS YOU WILL RUN (copy-paste)
===============================================================================
Start Metro (dev):
  npx react-native start
Start Metro + run Android emulator:
  npx react-native run-android
Start Metro + run iOS simulator:
  npx react-native run-ios

Create production bundle manually (Android example):
  npx react-native bundle --entry-file index.js --platform android --dev false --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res/

Create production bundle manually (iOS example):
  npx react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ./ios/main.jsbundle --assets-dest ./ios

Gradle / Xcode builds usually call Metro automatically for you during assemble/archive.
*/

/* ===========================================================================
📌 12. TROUBLESHOOTING COMMON ISSUES (simple)
===============================================================================
1) Metro cache issues:
  - Symptoms: bundle served stale code
  - Fix: stop Metro, clear cache: `npx react-native start --reset-cache`

2) Module not found / duplicate module versions:
  - Check resolver and watchFolders
  - For monorepos, add project root to watchFolders and alias node_modules

3) Slow Metro start:
  - Use watchman (macOS) to speed file watching
  - Reduce number of watched files (exclude build directories)

4) Assets not found in release:
  - Ensure `--assets-dest` was used in manual bundle or gradle did asset copying
  - For fonts ensure linking or Pod includes them

5) Hermes-only errors after enabling Hermes:
  - Some libraries behave slightly different in Hermes; test carefully.
  - Check compiled bytecode or disable Hermes to compare.
*/

/* ===========================================================================
📌 13. PERFORMANCE TIPS (bundle & dev faster)
===============================================================================
- Use inlineRequires to reduce cold-start work
- Lazy-load heavy features with dynamic import / React.lazy
- Avoid large sync work during module initialization (move work to hooks or lazy code)
- Keep bundle small: remove unused deps, prefer small libs
- Use Hermes and precompile if appropriate
- For dev: enable fast refresh, not full reloads
- Use production bundle analyzer to find big modules
*/

/* ===========================================================================
📌 14. HOW OTA UPDATES (CodePush / EAS) RELATE TO BUNDLES
===============================================================================
- OTA systems deliver new JS bundles to running apps without store release.
- They replace the JS bundle file the app loads at runtime (if app supports it).
- You should ensure compatibility: an OTA bundle must be compatible with the native binary.
- Use version checks (minNativeVersion) so you don't install incompatible JS bundle.
*/

/* ===========================================================================
📌 15. DEBUGGING WITH SOURCE MAPS (steps)
===============================================================================
- Generate bundle with source map:
  npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output out/index.android.bundle --sourcemap-output out/index.android.map
- Use source map in Sentry or source-map-explorer to map minified stack traces to original code
- For dev, Metro serves source maps automatically to the debugger
*/

/* ===========================================================================
📌 16. INTERVIEW Q&A (simple answers)
===============================================================================
Q1: What is Metro?
A: Metro is the JavaScript bundler for React Native. It makes the JS bundle the app runs.

Q2: How does Metro find all files?
A: It builds a dependency graph starting from the entry file and follows imports/requires.

Q3: What is inlineRequires?
A: A Metro option that delays module execution until first import — helps app start faster.

Q4: What is Hermes and why use it?
A: Hermes is a JS engine tuned for RN. It can precompile JS to bytecode for faster startup and sometimes smaller size.

Q5: How do dev and production bundles differ?
A: Dev bundle is served by Metro with source maps and dev helpers (not minified). Production bundle is minified, optimized, and embedded in the binary.

Q6: What is a RAM bundle?
A: A bundle format that splits code into many small modules and loads them on demand — reduces startup work for very large apps.
*/

/* ===========================================================================
📌 17. QUICK CHEAT-SHEET (one-minute)
===============================================================================
- Dev: `npx react-native start` (Metro serves bundle live)
- Prod: bundle is generated and embedded in APK/IPA
- Metro flow: entry -> dependency graph -> transform -> serialize -> assets
- Use inlineRequires + lazy imports for faster cold start
- Use Hermes for AOT bytecode and startup speed
- Use `--reset-cache` when Metro behaves strangely
- Optimize bundle by removing large deps and lazy-loading heavy screens
*/

/* ===========================================================================
📌 18. WANT EXTRAS?
===============================================================================
I can produce (beginner friendly, single-file JS Notes):
  ✅ Example metro.config.js tuned for inlineRequires + RAM bundle + terser
  ✅ Step-by-step guide to enable Hermes + precompile bytecode in CI
  ✅ Bundle analysis example using source-map-explorer with sample output
  ✅ A short tutorial: convert an app to lazy-load a heavy feature (maps) and measure startup improvement

Tell me which one and I will produce it in the same easy style.
*/
