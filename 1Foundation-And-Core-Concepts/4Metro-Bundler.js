/**
 * ==============================================================
 * 📘 React Native Notes – Metro Bundler
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is Metro?
 * - Metro is the **JavaScript bundler** used in React Native.
 * - Similar to Webpack/Vite but optimized for mobile apps.
 * - Converts all JS/TS/JSX files into one optimized bundle that
 *   can run inside the **JavaScript thread** of React Native.
 *
 * --------------------------------------------------------------
 * 🔹 Why Metro?
 * - React Native needs a fast bundler because apps reload often
 *   during development.
 * - Metro provides:
 *    ✅ Fast Refresh (instant reload during development)
 *    ✅ Efficient dependency graph handling
 *    ✅ Optimized bundling for mobile devices
 *    ✅ Built-in transformations (Babel + JSX)
 *
 * --------------------------------------------------------------
 * 🔹 How Metro Works (Step by Step)
 * 1) **Entry Point**
 *    - Metro starts with an entry file (default: `index.js`).
 *
 * 2) **Dependency Graph**
 *    - It scans all imports (`import` / `require`) to build a graph.
 *
 * 3) **Transformation**
 *    - Uses Babel to transform modern JS/JSX/TS → plain JS.
 *    - Supports React Native-specific features (e.g., JSX → createElement).
 *
 * 4) **Bundling**
 *    - Metro combines all transformed files into a single JS bundle.
 *    - Bundle is optimized with minification + tree shaking.
 *
 * 5) **Serving the Bundle**
 *    - During development, Metro serves the bundle via a local dev server.
 *    - On production build, the bundle is packaged inside the app.
 *
 * --------------------------------------------------------------
 * 🔹 Features of Metro
 * - **Incremental Builds** → Rebuilds only changed files for speed.
 * - **Hot Reloading / Fast Refresh** → Updates app instantly.
 * - **Hermes Support** → Works with Hermes JS engine for faster execution.
 * - **Asset Handling** → Can bundle images, fonts, JSON, etc.
 * - **Platform Extensions** → Supports `index.ios.js`, `index.android.js`.
 *
 * --------------------------------------------------------------
 * 🔹 Metro vs Webpack
 * - Webpack: General-purpose bundler (web, node, etc.).
 * - Metro: Specialized for React Native, focused on speed + mobile.
 *
 * ==============================================================
 */

//
// 🔹 Example 1: Default Metro Config (metro.config.js)
//
/**
 * const { getDefaultConfig } = require("metro-config");
 *
 * module.exports = (async () => {
 *   const {
 *     resolver: { sourceExts, assetExts }
 *   } = await getDefaultConfig();
 *   return {
 *     transformer: {
 *       babelTransformerPath: require.resolve("react-native-svg-transformer")
 *     },
 *     resolver: {
 *       assetExts: assetExts.filter(ext => ext !== "svg"),
 *       sourceExts: [...sourceExts, "svg"]
 *     }
 *   };
 * })();
 *
 * ✅ Customizing Metro allows handling of special file types (e.g., SVG).
 */

//
// 🔹 Example 2: Starting Metro
//
/**
 * Run the bundler manually:
 *   npx react-native start
 *
 * This runs Metro on localhost:8081 and serves bundles to emulator/device.
 */

//
// 🔹 Example 3: Production Bundle
//
/**
 * Bundle for production (Android):
 *   npx react-native bundle --platform android \
 *     --dev false --entry-file index.js \
 *     --bundle-output android/app/src/main/assets/index.android.bundle \
 *     --assets-dest android/app/src/main/res
 *
 * This generates a minified JS bundle included inside APK.
 */

//
// 🔹 Example 4: Fast Refresh
//
/**
 * Metro watches files → on change → re-bundles changed module only.
 * App reloads instantly without rebuilding whole app.
 */

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is Metro Bundler?
 *    → A JavaScript bundler for React Native that converts all
 *      JS/TS/JSX into a single optimized bundle for mobile.
 *
 * Q2: How does Metro work internally?
 *    → Entry point → dependency graph → transform (Babel) → bundle →
 *      serve to emulator/device.
 *
 * Q3: Difference between Metro and Webpack?
 *    → Metro = optimized for React Native (fast refresh, mobile).
 *      Webpack = general-purpose bundler (web, node).
 *
 * Q4: What is Fast Refresh?
 *    → Metro re-bundles only modified files and updates app instantly,
 *      keeping app state intact (better than full reload).
 *
 * Q5: How are production bundles generated?
 *    → Using `react-native bundle` command, Metro creates a minified
 *      bundle and includes it inside the app package (APK/IPA).
 *
 * Q6: Why do we need Metro if we already have Hermes?
 *    → Metro bundles + transforms JS. Hermes is the JS engine that
 *      executes the bundle. They work together.
 *
 * ==============================================================
 */
