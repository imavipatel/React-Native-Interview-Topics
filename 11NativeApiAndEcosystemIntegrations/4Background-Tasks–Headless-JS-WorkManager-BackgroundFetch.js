/********************************************************************
 * ⚙️ Background Tasks in React Native
 * ---------------------------------------------------------------
 * Background tasks allow apps to run code even when the app is not
 * in the foreground. This is useful for syncing data, location tracking,
 * scheduled jobs, or handling events like push notifications.
 *
 * React Native provides several ways to handle background work:
 *   1️⃣ Headless JS (Android only)
 *   2️⃣ WorkManager (Android job scheduler)
 *   3️⃣ BackgroundFetch (cross-platform)
 ********************************************************************/

/********************************************
 * 🔹 1. Headless JS (Android only)
 ********************************************/
/**
 * - Allows running JavaScript tasks in the background even when app is killed.
 * - Useful for:
 *   ✅ Handling push notifications
 *   ✅ Running periodic jobs (sync, cleanup)
 *   ✅ Processing background messages
 *
 * Example:
 * index.js
 * import { AppRegistry } from "react-native";
 * import App from "./App";
 *
 * // Background Task
 * const MyHeadlessTask = async (taskData) => {
 *   console.log("Headless JS Task running:", taskData);
 *   // perform background work here
 * };
 *
 * AppRegistry.registerHeadlessTask("MyHeadlessTask", () => MyHeadlessTask);
 *
 * ✅ Limitations:
 *   - Android only.
 *   - Tasks must finish quickly, or Android will kill it.
 *   - Not suitable for long-running background services.
 */

/********************************************
 * 🔹 2. WorkManager (Android only)
 ********************************************/
/**
 * - A **background job scheduler** from Android Jetpack.
 * - Guarantees task execution even if the app is killed or device restarts.
 * - Best for:
 *   ✅ Periodic sync jobs
 *   ✅ Deferred tasks (uploads, logging, retries)
 *
 * 📦 Library: react-native-work-manager
 *
 * Example:
 * import WorkManager from "react-native-work-manager";
 *
 * // Schedule a background task
 * WorkManager.startTask("syncTask", { interval: 15 }); // every 15 minutes
 *
 * WorkManager.addListener("syncTask", () => {
 *   console.log("Background sync running...");
 * });
 *
 * ✅ Advantages:
 *   - Reliable across device reboots.
 *   - Uses system-managed constraints (network, charging, idle state).
 *
 * ✅ Limitations:
 *   - Android only.
 *   - Not for precise timing (system decides when to run).
 */

/********************************************
 * 🔹 3. BackgroundFetch (iOS + Android)
 ********************************************/
/**
 * - Provides **cross-platform background task scheduling**.
 * - Works on both iOS & Android.
 * - Useful for:
 *   ✅ Periodic background sync
 *   ✅ Fetching remote updates
 *   ✅ Location tracking jobs
 *
 * 📦 Library: react-native-background-fetch
 *
 * Example:
 * import BackgroundFetch from "react-native-background-fetch";
 *
 * // Configure
 * BackgroundFetch.configure(
 *   { minimumFetchInterval: 15 }, // every 15 mins
 *   async (taskId) => {
 *     console.log("[BackgroundFetch] taskId:", taskId);
 *     // Perform background task here
 *     BackgroundFetch.finish(taskId);
 *   },
 *   (error) => {
 *     console.log("[BackgroundFetch] Failed to start:", error);
 *   }
 * );
 *
 * ✅ iOS Behavior:
 *   - Background fetch is triggered by system (not exact timing).
 *   - Limited execution time (~30 sec).
 *
 * ✅ Android Behavior:
 *   - Uses JobScheduler/AlarmManager under the hood.
 */

/********************************************
 * 🔹 iOS vs Android Background Execution
 ********************************************/
/**
 * ✅ iOS:
 *   - Background tasks are heavily restricted.
 *   - Apps can request specific background modes:
 *     → location, VOIP, background fetch, audio playback.
 *   - System decides when to wake app (not guaranteed).
 *
 * ✅ Android:
 *   - More flexible with Headless JS, Services, and WorkManager.
 *   - Can schedule tasks reliably with WorkManager.
 */

/********************************************
 * 🔹 Best Practices for Background Tasks
 ********************************************/
/**
 * ✅ Keep background tasks lightweight (battery/network friendly).
 * ✅ Always call finish(taskId) to signal completion (BackgroundFetch).
 * ✅ Use WorkManager for guaranteed execution on Android.
 * ✅ For iOS, rely on BackgroundFetch (system-controlled).
 * ✅ Avoid infinite loops (may drain battery, system kills task).
 * ✅ Combine with local notifications to alert user after background work.
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: What is the difference between Headless JS and WorkManager?
 *   → Headless JS is a way to run JS tasks when the app is killed,
 *     but it’s short-lived and Android-only.
 *     WorkManager is a native Android scheduler that guarantees execution,
 *     even across reboots, and works better for periodic sync.
 *
 * Q2: How does BackgroundFetch work on iOS?
 *   → It relies on the system’s background fetch mechanism.
 *     iOS decides when to wake the app (usually every few hours),
 *     not precise, but good for periodic updates.
 *
 * Q3: Which background solution is cross-platform?
 *   → react-native-background-fetch works on both iOS & Android.
 *
 * Q4: Can we run long background services in React Native?
 *   → Not directly. iOS is restrictive, Android supports services,
 *     but RN relies on system-managed schedulers.
 */
