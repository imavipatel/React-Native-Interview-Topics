/********************************************************************
 * 🔗 Dynamic Links & Deep Linking in React Native
 * ---------------------------------------------------------------
 * Deep Linking allows apps to open specific screens via a URL.
 * Dynamic Links (Firebase) extend deep linking by handling cases
 * where the app is not installed (redirects to App Store/Play Store).
 *
 * Used for:
 *   ✅ Opening a product detail page directly
 *   ✅ Sharing referral/invite links
 *   ✅ Password reset / email verification links
 *   ✅ Marketing campaigns with install attribution
 ********************************************************************/

/********************************************
 * 🔹 1. Deep Linking (Basics)
 ********************************************/
/**
 * - A way to open your app with a custom URL scheme or universal link.
 * - Example:
 *   myapp://profile/123
 *   → Opens app at Profile screen with userId = 123
 *
 * Setup:
 * 1) Define scheme in app config (iOS & Android).
 * 2) Use React Navigation's linking config.
 *
 * Example:
 * const linking = {
 *   prefixes: ["myapp://", "https://myapp.com"],
 *   config: {
 *     screens: {
 *       Home: "home",
 *       Profile: "profile/:id", // matches myapp://profile/123
 *     },
 *   },
 * };
 *
 * export default function App() {
 *   return (
 *     <NavigationContainer linking={linking}>
 *       <Stack.Navigator>
 *         <Stack.Screen name="Home" component={HomeScreen} />
 *         <Stack.Screen name="Profile" component={ProfileScreen} />
 *       </Stack.Navigator>
 *     </NavigationContainer>
 *   );
 * }
 *
 * ✅ Works both for app-to-app navigation and from browser links.
 */

/********************************************
 * 🔹 2. Firebase Dynamic Links
 ********************************************/
/**
 * - A smarter version of deep links.
 * - If the app is not installed:
 *   → Redirects to App Store / Play Store.
 * - If the app is installed:
 *   → Opens the app directly at the intended screen.
 *
 * Example use case:
 * - Send referral link: https://myapp.page.link/invite?userId=123
 * - If user has app → opens directly in Profile screen.
 * - If not → opens store → installs → then redirects to Profile.
 *
 * Setup:
 * 📦 Library: @react-native-firebase/dynamic-links
 *
 * Example:
 * import dynamicLinks from "@react-native-firebase/dynamic-links";
 *
 * function App() {
 *   useEffect(() => {
 *     // When app is opened via dynamic link
 *     const unsubscribe = dynamicLinks().onLink((link) => {
 *       console.log("Dynamic Link received:", link.url);
 *       // Navigate accordingly
 *     });
 *
 *     // When app is cold-started by dynamic link
 *     dynamicLinks()
 *       .getInitialLink()
 *       .then((link) => {
 *         if (link) console.log("App opened by link:", link.url);
 *       });
 *
 *     return () => unsubscribe();
 *   }, []);
 * }
 */

/********************************************
 * 🔹 3. iOS & Android Setup
 ********************************************/
/**
 * ✅ iOS:
 *   - Add associated domains in Xcode:
 *     → applinks:myapp.page.link
 *   - Enable "Associated Domains" in Capabilities.
 *
 * ✅ Android:
 *   - Add intent filter in AndroidManifest.xml:
 *     <intent-filter android:label="myapp">
 *       <action android:name="android.intent.action.VIEW" />
 *       <category android:name="android.intent.category.DEFAULT" />
 *       <category android:name="android.intent.category.BROWSABLE" />
 *       <data android:scheme="https" android:host="myapp.page.link" />
 *     </intent-filter>
 */

/********************************************
 * 🔹 4. Handling Links in App
 ********************************************/
/**
 * - Use Linking API (built-in) or Firebase Dynamic Links.
 *
 * Example with Linking:
 * import { Linking } from "react-native";
 *
 * useEffect(() => {
 *   const handleUrl = (event) => {
 *     console.log("Opened with URL:", event.url);
 *   };
 *
 *   Linking.addEventListener("url", handleUrl);
 *
 *   // Check if app opened by link (cold start)
 *   Linking.getInitialURL().then((url) => {
 *     if (url) console.log("Initial URL:", url);
 *   });
 *
 *   return () => Linking.removeEventListener("url", handleUrl);
 * }, []);
 */

/********************************************
 * 🔹 5. Best Practices
 ********************************************/
/**
 * ✅ Use universal links (iOS) / app links (Android) instead of custom schemes
 *    → Prevents other apps from hijacking your scheme.
 *
 * ✅ Always validate parameters from links (security).
 *    → Example: profile/:id → ensure id exists and is safe.
 *
 * ✅ Combine with Firebase Dynamic Links for marketing/referrals.
 *
 * ✅ Use deep links for navigation within app, dynamic links for installs.
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: What is the difference between Deep Linking and Dynamic Links?
 *   → Deep Linking = opens app at specific screen via URL.
 *     Dynamic Links = smart deep links from Firebase,
 *     handle install flow + deferred deep linking.
 *
 * Q2: How do you configure deep linking in React Navigation?
 *   → Pass a `linking` config with prefixes & route mappings
 *     into <NavigationContainer>.
 *
 * Q3: What happens if app is not installed when opening a dynamic link?
 *   → User is redirected to Play Store/App Store, after install
 *     → app opens at intended screen.
 *
 * Q4: Can deep links work from push notifications?
 *   → Yes, include URL in notification payload and handle it with
 *     Linking or dynamicLinks().onLink.
 */
