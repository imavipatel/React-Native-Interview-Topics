/**************************************************************
 * 📘 Crash & RUM (Real User Monitoring) – Crashlytics, Sentry
 **************************************************************/

/********************************************
 * 🟢 Why Crash/RUM Monitoring is Important?
 ********************************************/
/**
 * - In production apps, crashes & performance issues affect UX.
 * - Developers cannot reproduce every issue on local devices.
 * - Crash/RUM monitoring tools help by:
 *   ✅ Capturing crashes & exceptions (native + JS)
 *   ✅ Collecting logs, device info, stack traces
 *   ✅ Tracking performance (app start, slow renders, network latency)
 *   ✅ Monitoring real user behavior → session tracking, navigation flows
 *   ✅ Helping fix issues faster & improve app stability
 */

/********************************************
 * 🔹 Firebase Crashlytics (Crash Reporting)
 ********************************************/
/**
 * - Crashlytics is Firebase’s crash reporting tool.
 * - Focused on **stability monitoring**:
 *   - Captures native (iOS/Android) crashes automatically
 *   - Provides stack traces with line numbers (if dSYM/ProGuard mappings uploaded)
 *   - Groups crashes by issue (frequency, affected devices, OS versions)
 *   - Alerts when a new crash occurs
 *
 * ✅ Setup in React Native:
 *   1. Install `@react-native-firebase/app` and `@react-native-firebase/crashlytics`
 *   2. Initialize Firebase in app
 *   3. Use crashlytics().log() or crashlytics().recordError() for custom events
 *
 * Example:
 *   import crashlytics from '@react-native-firebase/crashlytics';
 *
 *   function riskyOperation() {
 *     try {
 *       // some code that may fail
 *     } catch (err) {
 *       crashlytics().recordError(err);
 *     }
 *   }
 *
 * ✅ Best for:
 *   - Detecting **native crashes** (Java/Kotlin, Obj-C/Swift)
 *   - Tracking stability KPIs (crash-free users %, ANR rates)
 *   - Release monitoring
 */

/********************************************
 * 🔹 Sentry (Crash + RUM + Performance Monitoring)
 ********************************************/
/**
 * - Sentry is broader: **crash reporting + performance + RUM**.
 *
 * 🔥 Features:
 *   - Captures both **JS errors** (React, RN) and **native crashes**
 *   - Breadcrumbs → logs events leading up to the crash
 *   - Performance monitoring:
 *     → App startup time
 *     → Navigation transitions
 *     → Slow network/API calls
 *   - Real User Monitoring (RUM):
 *     → Session replay (optional, privacy sensitive)
 *     → Tracks what users actually experience in real-time
 *
 * ✅ Setup in React Native:
 *   import * as Sentry from "@sentry/react-native";
 *
 *   Sentry.init({
 *     dsn: "YOUR_SENTRY_DSN_HERE",
 *     tracesSampleRate: 1.0, // performance monitoring
 *   });
 *
 * Example (manual error capture):
 *   try {
 *     throw new Error("Something broke!");
 *   } catch (err) {
 *     Sentry.captureException(err);
 *   }
 *
 * ✅ Best for:
 *   - Tracking both JS + Native crashes
 *   - End-to-end performance monitoring
 *   - Real User Monitoring (user sessions, network latency, slow UI)
 */

/********************************************
 * 🔍 Crashlytics vs Sentry – Quick Comparison
 ********************************************/
/**
 * 🔹 Crashlytics:
 *   - ✅ Strong for native crash reporting
 *   - ✅ Easy Firebase ecosystem integration
 *   - ❌ Limited in JS error handling
 *   - ❌ No full RUM or performance tracing
 *
 * 🔹 Sentry:
 *   - ✅ Cross-platform (JS + Native + Backend)
 *   - ✅ Rich performance monitoring & RUM
 *   - ✅ Captures breadcrumbs (events before crash)
 *   - ❌ Slightly heavier setup, paid plans for advanced features
 *
 * 👉 Best Practice:
 *   - Use **Crashlytics** for deep native crash stability.
 *   - Use **Sentry** if you also need JS error tracking + performance + RUM.
 */

/********************************************
 * ⚡ Best Practices for Crash/RUM Monitoring
 ********************************************/
/**
 * 1️⃣ Always upload ProGuard mapping (Android) & dSYM (iOS)
 *     → Without it, stack traces are unreadable.
 *
 * 2️⃣ Use custom logs (breadcrumbs) for context:
 *     - Example: "User tapped checkout button"
 *     - Helps reproduce crashes in real world.
 *
 * 3️⃣ Monitor crash-free users % as a key metric.
 *
 * 4️⃣ Handle non-fatal errors too:
 *     - Use recordError() / captureException() for handled failures.
 *
 * 5️⃣ Respect user privacy:
 *     - Avoid logging sensitive data (PII, passwords, tokens).
 *
 * 6️⃣ Use alerts & dashboards:
 *     - Configure email/Slack alerts for new crash spikes.
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: What’s the difference between Crashlytics and Sentry?
 *   → Crashlytics = Crash-focused (native stability)
 *   → Sentry = Crashes + JS errors + Performance + RUM
 *
 * Q2: How do you debug crashes in release builds?
 *   → Upload ProGuard (Android) & dSYM (iOS) mapping files
 *
 * Q3: What are breadcrumbs in Sentry?
 *   → Logs of key actions/events before crash (e.g., API call, navigation).
 *
 * Q4: How does RUM help developers?
 *   → Shows what real users experience (lag, failed requests, navigation slowness).
 */
