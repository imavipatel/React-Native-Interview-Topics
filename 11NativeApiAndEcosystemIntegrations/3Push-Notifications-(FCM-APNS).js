/********************************************************************
 * 🔔 Push Notifications in React Native
 * ---------------------------------------------------------------
 * Notifications are a critical part of mobile apps for user engagement.
 * React Native apps typically support:
 *   - Push Notifications (remote): FCM (Android), APNS (iOS)
 *   - Local Notifications: Triggered within the app (alarms, reminders)
 *   - Scheduled Notifications: Delayed/local notifications at a specific time
 ********************************************************************/

/********************************************
 * 🔹 Remote Push Notifications (FCM & APNS)
 ********************************************/
/**
 * - FCM (Firebase Cloud Messaging) → Android & iOS
 * - APNS (Apple Push Notification Service) → iOS only
 *
 * 📦 Popular Libraries:
 *   ✅ react-native-push-notification (basic, supports local + scheduled)
 *   ✅ @react-native-firebase/messaging (powerful, integrates with Firebase)
 *   ✅ Notifee (paid features, advanced notifications)
 *
 * 🛠 Setup:
 *   - Android:
 *     1. Add Firebase project → Download google-services.json
 *     2. Add to android/app/
 *     3. Add Gradle config
 *
 *   - iOS:
 *     1. Enable Push Notifications capability
 *     2. Create APNS key in Apple Developer Account
 *     3. Add GoogleService-Info.plist if using Firebase
 *
 * ✅ Example (Firebase Messaging):
 * import messaging from "@react-native-firebase/messaging";
 *
 * // Request permission
 * await messaging().requestPermission();
 *
 * // Get device token
 * const token = await messaging().getToken();
 * console.log("FCM Token:", token);
 *
 * // Listen for foreground messages
 * messaging().onMessage(async remoteMessage => {
 *   console.log("Foreground Notification:", remoteMessage);
 * });
 *
 * // Background / Quit state handler (in index.js)
 * messaging().setBackgroundMessageHandler(async remoteMessage => {
 *   console.log("Background Notification:", remoteMessage);
 * });
 */

/********************************************
 * 🔹 Local Notifications
 ********************************************/
/**
 * - Triggered by the app itself (doesn’t require server).
 * - Useful for:
 *   ✅ Reminders (Todo apps, Medicine reminders)
 *   ✅ Alerts (Download complete, Alarm)
 *   ✅ In-app events
 *
 * 📦 Library: react-native-push-notification
 *
 * Example:
 * import PushNotification from "react-native-push-notification";
 *
 * PushNotification.localNotification({
 *   channelId: "default-channel-id",
 *   title: "Hello",
 *   message: "This is a local notification",
 * });
 *
 * ✅ On Android, you must create a channel before sending notifications:
 * PushNotification.createChannel(
 *   {
 *     channelId: "default-channel-id",
 *     channelName: "Default Channel",
 *   },
 *   (created) => console.log(`Channel created: ${created}`)
 * );
 */

/********************************************
 * 🔹 Scheduled Notifications
 ********************************************/
/**
 * - Fire notifications at a specific time.
 * - Use Cases:
 *   ✅ Daily reminders (Workout at 8 AM)
 *   ✅ Meeting alerts
 *   ✅ Periodic updates
 *
 * Example:
 * PushNotification.localNotificationSchedule({
 *   channelId: "default-channel-id",
 *   title: "Reminder",
 *   message: "Your workout starts now!",
 *   date: new Date(Date.now() + 60 * 1000), // 1 min later
 *   allowWhileIdle: true,
 *   repeatType: "day", // daily repeat
 * });
 */

/********************************************
 * 🔹 iOS vs Android Notification Differences
 ********************************************/
/**
 * ✅ iOS:
 *   - Requires explicit user permission
 *   - Uses APNS under the hood (FCM integrates with APNS)
 *   - Limited background notification features (silent pushes)
 *
 * ✅ Android:
 *   - Works with FCM directly
 *   - Requires Notification Channels (Android 8+)
 *   - Can display notifications even if app is killed
 */

/********************************************
 * 🔹 Best Practices
 ********************************************/
/**
 * ✅ Always request permission at runtime (iOS & Android 13+).
 * ✅ Use channels on Android for categorizing notifications.
 * ✅ Handle foreground vs background notifications differently.
 * ✅ Avoid spamming users → Use meaningful pushes only.
 * ✅ Encrypt sensitive data (don’t send tokens in notification payload).
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: What is the difference between FCM & APNS?
 *   → FCM is Google’s service for push notifications (works cross-platform).
 *     APNS is Apple’s push service (iOS only). FCM uses APNS internally for iOS.
 *
 * Q2: How do local notifications differ from push?
 *   → Local notifications are triggered by the app (no internet/server needed),
 *     Push notifications come from a server (via FCM/APNS).
 *
 * Q3: How do you handle scheduled notifications?
 *   → Use local notification scheduling (react-native-push-notification) with a date/time.
 *
 * Q4: How do you handle notifications in the background?
 *   → Use setBackgroundMessageHandler in Firebase messaging (Android + iOS).
 *
 * Q5: Why are notification channels important in Android?
 *   → From Android 8+, notifications must belong to a channel for importance, sound, vibration settings.
 */
