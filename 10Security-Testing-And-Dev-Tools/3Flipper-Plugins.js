/******************************************************
 * 📘 Flipper Plugins – Network, React DevTools, Layout Inspector
 ******************************************************/

/********************************************
 * 🟢 What is Flipper?
 ********************************************/
/**
 * - Flipper is a **debugging platform** for iOS & Android apps.
 * - Officially supported by Meta (used internally for RN development).
 * - Provides a **desktop app** (Mac/Win/Linux) where you can plug in:
 *   → React Native Debug Tools
 *   → Native Android/iOS Debug Tools
 * - Uses plugins to extend functionality (network inspector, logs, layout tools).
 */

/********************************************
 * 🌐 Flipper Network Plugin
 ********************************************/
/**
 * - Captures **all network requests** made by your React Native app.
 * - Works with `fetch`, `XMLHttpRequest`, and networking libraries like Axios.
 * - Lets you inspect:
 *   ✅ Request method (GET, POST, PUT, DELETE)
 *   ✅ URL & headers
 *   ✅ Request body (JSON, FormData, etc.)
 *   ✅ Response status, headers, body
 *   ✅ Timing (latency, duration)
 *
 * - Helps debug:
 *   - API failures
 *   - Incorrect headers/auth
 *   - Slow responses
 *
 * 🔹 Example workflow:
 *   1. Run RN app with Flipper enabled.
 *   2. Open **Network Plugin** in Flipper.
 *   3. See all API calls logged in real time.
 *
 * - Good replacement for tools like Postman/Charles Proxy during development.
 */

/********************************************
 * ⚛️ Flipper React DevTools Plugin
 ********************************************/
/**
 * - Embeds the official **React Developer Tools** inside Flipper.
 * - Lets you:
 *   ✅ Inspect component hierarchy (tree)
 *   ✅ View props & state of each component
 *   ✅ Check Context values
 *   ✅ See which component re-rendered and why
 *
 * - Useful for debugging:
 *   - Incorrect props being passed
 *   - State not updating properly
 *   - Unnecessary re-renders (performance debugging)
 *
 * 🔹 Example workflow:
 *   1. Open your RN app connected to Flipper.
 *   2. Navigate to **React DevTools tab**.
 *   3. Explore component tree → click components to inspect props/state.
 */

/********************************************
 * 📐 Flipper Layout Inspector Plugin
 ********************************************/
/**
 * - Lets you **visually inspect UI elements** in your app at runtime.
 * - Shows a hierarchy similar to Xcode's View Debugger or Android Studio's Layout Inspector.
 *
 * - Features:
 *   ✅ Inspect native UI hierarchy (View, Text, Image, etc.)
 *   ✅ See styling & layout attributes (width, height, margins, paddings)
 *   ✅ Highlight selected elements on the screen
 *   ✅ Debug misplaced or invisible UI components
 *
 * - Helps debug:
 *   - Incorrect Flexbox styles
 *   - Overlapping components
 *   - UI not rendering as expected across devices
 *
 * 🔹 Example workflow:
 *   1. Open app connected to Flipper.
 *   2. Open **Layout Inspector tab**.
 *   3. Select a UI element → highlights it in the running app.
 */

/********************************************
 * ⚖️ Summary
 ********************************************/
/**
 * - Flipper provides powerful plugins for **debugging RN apps in real time**.
 *
 * | Plugin           | Purpose                                   |
 * |------------------|-------------------------------------------|
 * | Network Plugin   | Inspect API requests/responses            |
 * | React DevTools   | Debug props, state, context, re-renders   |
 * | Layout Inspector | Debug UI hierarchy & styles visually      |
 *
 * ✅ Together, they help debug **network, logic, and UI** issues efficiently.
 */
