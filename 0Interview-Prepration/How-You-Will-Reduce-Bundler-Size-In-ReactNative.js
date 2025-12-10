/**
 * react-native-reduce-bundle-size-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 * "How to reduce JavaScript bundle size in React Native"
 *
 * Very simple language. Everything is practical and copy-paste ready.
 *
 * Covers:
 * - Quick summary of why bundle size matters
 * - Simple checklist (fast wins)
 * - Detailed techniques (Hermes, inlineRequires, RAM bundles, ProGuard/R8, tree-shaking)
 * - Metro, Android, iOS config snippets you can use
 * - Asset & dependency tips
 * - Tools to measure bundle size
 * - Final checklist + Interview Q&A
 *
 * Keep this file in your notes. Use it as a reference while shrinking your app.
 */

/* ===========================================================================
📌 0. WHY REDUCE BUNDLE SIZE? (simple)
===============================================================================
Smaller bundle → app starts faster, uses less memory, downloads faster for users.
Mobile networks and devices are not always fast. Reducing JS + assets helps user experience.
*/

/* ===========================================================================
📌 1. QUICK WINS (do these first)
===============================================================================
✔ Enable Hermes JS engine (faster startup & smaller JS on Android + iOS)  
✔ Remove unused libraries (big win) — check node_modules for large packages  
✔ Use vector icons / SVGs instead of many PNGs  
✔ Optimize images (compress, use correct sizes / webp)  
✔ Make sure production build (minified, no dev tools) is used for release
*/

/* ===========================================================================
📌 2. HERMES (recommended)
===============================================================================
Hermes is a JavaScript engine optimized for React Native. It often reduces app size
and improves startup.

Enable Hermes (React Native CLI):

Android (android/app/build.gradle)
  // inside defaultConfig or project-level settings, ensure hermesEnabled true in gradle.properties or in app build config
  project.ext.react = [
    enableHermes: true  // clean & rebuild after change
  ]

iOS:
- In Podfile, set :hermes_enabled => true (React Native docs show exact setup).
- Run `pod install` and rebuild.

Notes:
- Hermes bytecode can be precompiled to reduce runtime work.
- Test thoroughly — sometimes small behavior differences occur (rare).
*/

/* ===========================================================================
📌 3. INLINE REQUIRES (big runtime win)
===============================================================================
What: Delay loading a module until it's actually needed. This reduces startup cost.

Enable in Metro config:
*/

/// metro.config.js
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      // IMPORTANT: keep this on for faster startup
      inlineRequires: true,
    },
  };
})();

/*
Notes:
- inlineRequires makes app load faster by not executing unused modules at startup.
- It can sometimes break code that expects side-effects at module load time — test well.
*/

/* ===========================================================================
📌 4. RAM BUNDLES / STARTUP SPLITTING (advanced)
===============================================================================
What: Split bundle into many small modules so startup loads small part only.

Enable RAM bundles in Metro:
*/

/// metro.config.js (RAM bundle example)
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    // Enable RAM bundle output
    ramBundle: true,
  },
};

/*
Notes:
- RAM bundles can improve startup for very large apps.
- Not all libraries behave well; test both platforms.
- RAM bundles change how you debug (source maps different).
*/

/* ===========================================================================
📌 5. CODE-SPLITTING & LAZY LOAD (JS level)
===============================================================================
What: Load big features only when user opens them.

Use React.lazy or dynamic import:
*/

const ChatScreen = React.lazy(() => import("./features/chat/ChatScreen"));

// in render:
<Suspense fallback={<Loading />}>
  <ChatScreen />
</Suspense>;

/*
Notes:
- React.lazy works for code-splitting parts of JS. Metro supports dynamic import.
- Combine with inlineRequires / RAM bundles for better effect.
- Use lazy-loading for heavy screens (maps, video, reports).
*/

/* ===========================================================================
📌 6. REMOVE UNUSED CODE (tree-shaking & dead-code)
===============================================================================
Tips:
- Use ES module imports (import x from 'lib') not require() if possible — bundlers tree-shake ES modules.
- Avoid importing entire libraries when you need only one function:
    // Bad
    import _ from 'lodash';
    // Good
    import debounce from 'lodash/debounce';
- Remove dev-only code using __DEV__ checks:
    if (__DEV__) { /* debug only  }

- Use tools to find unused code (bundle analyzers below).
*/

/* ===========================================================================
📌 7. ANDROID: ProGuard / R8 & resource shrinking
===============================================================================
These shrink Java/Kotlin native code and native libs, not JS. But they reduce APK size.

Enable R8 (usually default for RN) and shrink resources (app-level build.gradle):

android/app/build.gradle (release block)
android {
  buildTypes {
    release {
      // ProGuard/R8
      minifyEnabled true
      shrinkResources true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}

/* proguard-rules.pro (example - allow RN stuff, but remove unused)
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
/* Add rules for any native libraries you need to keep */
/* Test release build after enabling */

/* ===========================================================================
📌 8. iOS: Bitcode & App Thinning / Asset Catalog
===============================================================================
- Use app thinning and asset catalogs to optimize sizes (Xcode handles this).
- Use xcasset catalogs for images so App Store serves optimized assets per device.
- Strip debug symbols on release builds (Xcode settings).
*/

/* ===========================================================================
📌 9. CLEAN UP DEPENDENCIES (big wins)
===============================================================================
Steps:
1) Run `npx react-native-community/cli info` and inspect node_modules sizes.
2) Use `npm ls <package>` to see who uses a package.
3) Remove unused packages (yarn remove package).
4) Replace heavy libs with lighter alternatives (moment -> dayjs, lodash -> individual functions).
5) Avoid two different libs that do same job (e.g., two navigation libs).
6) Use platform-only libraries only where needed (don't install large native libs unless used).
*/

/* ===========================================================================
📌 10. OPTIMIZE ASSETS (images, fonts)
===============================================================================
Images:
  - Compress images (tools: imagemin, Squoosh, ImageOptim)
  - Use webp where supported (Android)
  - Resize server-side to multiple sizes and load correct size
  - Avoid bundling many large images in JS; load from CDN when possible

Fonts:
  - Only include fonts you use
  - Subset fonts if possible

Vector icons:
  - Use react-native-vector-icons or SVGs where possible instead of many PNGs
*/

/* ===========================================================================
📌 11. AVOID LARGE STATIC JSON OR DATA IN CODE
===============================================================================
- Do NOT include big JSON files inside JS bundle.
- If you need large static data, host it remotely and fetch at runtime or keep in assets and load as needed.
*/

/* ===========================================================================
📌 12. REMOVE DEV TOOLS & FLIPPER IN PRODUCTION
===============================================================================
- Flipper and many debugging tools add size. Make sure they are disabled in release.
- Guard dev-only imports with __DEV__.

Example:
if (__DEV__) {
  require('react-devtools-core');
}

/* ===========================================================================
📌 13. MEASURE BUNDLE SIZE (tools)
===============================================================================
1) metro-bundle-visualizer (visualize what packages contribute)
   - Example: `npx react-native-bundle-visualizer` (community packages exist)

2) source-map-explorer (work with production bundle)
   - Generate bundle and source map:
       react-native bundle --platform android --dev false --entry-file index.js --bundle-output out/index.android.bundle --sourcemap-output out/index.android.map
   - Run source-map-explorer on the bundle and map (node tool)

3) `react-native-bundle-visualizer` or `why-did-you-render` for runtime issues

Use these to find the biggest modules and optimize them first.
*/

/* ===========================================================================
📌 14. METRO MINIFIER & TERSER
===============================================================================
Metro uses a JS minifier for production. Tweak minifier options if needed.

Example (metro.config.js) to use terser with custom options (advanced):
*/

/// metro.config.js (terser example)
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const config = await getDefaultConfig();
  return {
    ...config,
    transformer: {
      ...config.transformer,
      minifierPath: "metro-minify-terser",
      minifierConfig: {
        keep_classnames: false,
        keep_fnames: false,
        mangle: { toplevel: true },
        output: { ascii_only: true, comments: false },
      },
    },
  };
})();

/* ===========================================================================
📌 15. SPLIT NATIVE-ONLY CODE FROM JS (avoid bundling native binaries in JS)
===============================================================================
- Put native heavy code (e.g., big SDKs) as native-only and call via native module.
- Do not import heavy web SDKs into RN JS bundle (they may bring many polyfills).
*/

/* ===========================================================================
📌 16. LAZY LOAD LARGE LIBS (maps, charts, pdf)
===============================================================================
Load them only when user opens that screen:

// inside screen mount
useEffect(() => {
  (async () => {
    const { default: PDF } = await import('react-native-pdf');
    setPdfModule(() => PDF);
  })();
}, []);

/* ===========================================================================
📌 17. BUNDLE SPLITTING STRATEGY (practical)
===============================================================================
- Keep core app (login, home) small
- Lazy-load heavy features (reports, admin screens)
- Use RAM bundles and inlineRequires on startup
- Measure frequently and avoid premature optimization
*/

/* ===========================================================================
📌 18. EXTRA: Precompile Hermes bytecode (speed + size)
===============================================================================
- For Hermes, you can precompile JS to Hermes bytecode during build.
- This reduces runtime bytes parsed and may reduce app start cost.
- Setup differs by RN version — check RN Hermes docs for exact steps.
*/

/* ===========================================================================
📌 19. EXAMPLE RELEASE BUILD COMMANDS (reminder)
===============================================================================
Android (assembleRelease):
  cd android && ./gradlew assembleRelease

iOS (archive):
  open ios/MyApp.xcworkspace and Archive via Xcode or use xcodebuild in CI.

Make sure RELEASE build settings:
  - Minify / ProGuard enabled
  - Hermes enabled if chosen
  - Dev support disabled (debug/* removed)
*/

/* ===========================================================================
📌 20. FINAL CHECKLIST (do in this order)
===============================================================================
1) Enable Hermes (test)  
2) Turn on inlineRequires in metro.config.js  
3) Remove unused libs & replace heavy libs with lighter ones  
4) Lazy-load heavy screens with React.lazy / dynamic import  
5) Optimize images and fonts (compress + webp)  
6) Enable ProGuard/R8 & shrinkResources (Android)  
7) Use Xcode app thinning and strip debug symbols (iOS)  
8) Disable Flipper & dev tools in release builds  
9) Use bundle analyzer (source-map-explorer) to find large modules  
10) Consider RAM bundles if app still slow at startup

Repeat: measure → change → measure again.
*/

/* ===========================================================================
📌 21. INTERVIEW Q&A (simple)
===============================================================================
Q1: What is Hermes and why use it?
A: Hermes is a JS engine optimized for RN. It often reduces app size and improves startup.

Q2: What does inlineRequires do?
A: It delays loading modules until needed, making app start faster.

Q3: What is a RAM bundle?
A: It is a bundle split format that loads modules on demand (good for big apps).

Q4: How do you find biggest files in bundle?
A: Use source-map-explorer or metro bundle visualizer on the production bundle + map.

Q5: Should I remove images from bundle?
A: Yes — compress them, use correct sizes, or load from CDN when possible.

Q6: Is ProGuard for JS?
A: No — ProGuard/R8 shrinks native Java/Kotlin code and native libraries for Android.
*/

/* ===========================================================================
📌 22. WANT EXTRAS?
===============================================================================
I can produce (beginner-friendly, single-file JS Notes):
  ✅ A starter metro.config.js with inlineRequires + terser + RAM bundle examples
  ✅ A safe step-by-step migration guide: enable Hermes + test common issues
  ✅ A bundle analysis script & how to interpret results with examples
  ✅ A CI config snippet that builds release bundles and runs bundle analyzer automatically

Tell me which one and I will provide it in the same simple style.
*/
