/**
 * react-native-firebase-crashlytics-dynamiclinks-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "Integrate Firebase Crashlytics + Dynamic Links in React Native
 *  for real-time crash monitoring, analytics, and engagement tracking"
 *
 * - Very simple language for beginners
 * - Full coverage: what each service does, setup (Firebase console),
 *   installation for React Native (Android + iOS), initialization, examples,
 *   custom keys & breadcrumbs, mapping symbol uploads, Dynamic Links creation & handling,
 *   testing, CI automation (Fastlane/GHA), privacy, troubleshooting, checklist, Q&A
 * - Everything in one file (single-file JS notes). Copy-paste into your notes repo.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Use Crashlytics to capture realtime crashes and errors, and Dynamic Links to
track deep-link engagement and deferred installs — both wired into Firebase Analytics.
*/

/* ===========================================================================
📌 1. WHAT THESE SERVICES DO (very simple)
===============================================================================
• Firebase Crashlytics
  - Real-time crash reporting for native + JS errors.
  - Shows stack traces, device state, custom keys, user identifiers, logs (breadcrumbs).
  - Helps prioritize and fix crashes quickly.

• Firebase Dynamic Links
  - Create links that survive install & open the correct place in app.
  - Used for referrals, marketing campaigns, onboarding, and deep linking.
  - Integrates with Analytics for conversion attribution.
*/

/* ===========================================================================
📌 2. HIGH-LEVEL FLOW (how they work together)
===============================================================================
- Crashlytics reports crashes (native or JS) to Firebase, visible in console → issue grouping.  
- Dynamic Links create tracked URLs; when user clicks, Firebase attributes the install or open to that link.  
- Analytics receives events from both and helps measure engagement and conversions.
*/

/* ===========================================================================
📌 3. BEFORE YOU START (prereqs)
===============================================================================
✔ Firebase project created (console.firebase.google.com)  
✔ Android app & iOS app registered in Firebase (correct package/bundle IDs)  
✔ Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)  
✔ React Native project set up (>= 0.60 auto-linking recommended)  
✔ Node, Yarn/NPM, and native toolchains (Android Studio, Xcode) available
*/

/* ===========================================================================
📌 4. INSTALLATION — PACKAGES (React Native)
===============================================================================
Recommended libs (well-supported):
  • @react-native-firebase/app
  • @react-native-firebase/crashlytics
  • @react-native-firebase/dynamic-links
  • @react-native-firebase/analytics (optional but recommended)

Install (yarn):
  yarn add @react-native-firebase/app @react-native-firebase/crashlytics @react-native-firebase/dynamic-links @react-native-firebase/analytics

Note: If using Expo Managed workflow, use Expo's Firebase integration or eject to bare workflow for full Crashlytics native support.
*/

/* ===========================================================================
📌 5. ANDROID SETUP (step-by-step)
===============================================================================
1) Place `android/app/google-services.json` in the Android app folder.

2) android/build.gradle (project-level)
   - Add Google services classpath (if not present):
     buildscript {
       dependencies {
         classpath 'com.google.gms:google-services:4.3.15' // example - use recommended version
       }
     }

3) android/app/build.gradle (app-level)
   - Apply plugin at bottom:
     apply plugin: 'com.google.gms.google-services'
   - Ensure minSdkVersion >= 21 for some Firebase features
   - Add Crashlytics plugin for native symbol uploads (if using native code):
     // in buildscript classpath:
     classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.6'
     // then apply plugin: 'com.google.firebase.crashlytics' in app module

4) ProGuard / R8 rules
   - Add recommended rules (Crashlytics may upload mapping automatically if configured).
   - Example (android/app/proguard-rules.pro):
     -keepattributes *Annotation*
     -keep public class * extends java.lang.Exception

5) Native symbol mapping (for NDK or Java stacktrace deobfuscation)
   - Configure crashlytics to upload mapping and native symbols on build (see plugin docs).
   - Fastlane or gradle tasks can upload symbols automatically (important to get readable stack traces).
*/

/* ===========================================================================
📌 6. iOS SETUP (step-by-step)
===============================================================================
1) Add `GoogleService-Info.plist` to the iOS runner app (Xcode) — make sure it's in the app target.

2) Pod install
   cd ios && pod install

3) Enable Crashlytics run script in Xcode build phases:
   - Add a "Run Script" build phase after "[CP] Embed Pods" with:
     "${PODS_ROOT}/FirebaseCrashlytics/run"
   - This uploads dSYMs for symbolication.

4) App Transport Security / URL schemes
   - For Dynamic Links, configure Associated Domains (see section on Dynamic Links).

5) Bitcode
   - If you use bitcode, ensure dSYM handling is correct; if using bitcode, the generated dSYMs may require extra steps.
*/

/* ===========================================================================
📌 7. BASIC INITIALIZATION (React Native code)
===============================================================================
- Initialize Firebase & configure Crashlytics behavior (disable in debug if desired)
*/
import { AppRegistry } from "react-native";
import firebase from "@react-native-firebase/app";
import crashlytics from "@react-native-firebase/crashlytics";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import analytics from "@react-native-firebase/analytics";
import App from "./App"; // your root component

// Optionally disable Crashlytics in dev builds
if (__DEV__) {
  crashlytics().setCrashlyticsCollectionEnabled(false);
} else {
  crashlytics().setCrashlyticsCollectionEnabled(true);
}

// Example: global JS error handler to report unhandled exceptions
if (!__DEV__) {
  const defaultHandler =
    ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    // Log to Crashlytics
    crashlytics().recordError(error); // records error object
    // optionally log fatal crash and force a native crash for grouping:
    if (isFatal) {
      crashlytics().crash(); // forces a native crash (use carefully)
    }
    // Call default handler afterwards so app behaves normally
    if (defaultHandler) defaultHandler(error, isFatal);
  });
}

AppRegistry.registerComponent("MyApp", () => App);

/* ===========================================================================
📌 8. CAPTURE CUSTOM KEYS, LOGS (breadcrumbs), AND USER INFO
===============================================================================
- Use custom keys & logs to enrich crash reports and help debugging.
- Examples:
*/
export function setCrashUser(id, email) {
  // set user identifier (helps trace user-specific crashes)
  crashlytics().setUserId(String(id));
  if (email) crashlytics().setAttribute("user_email", email);
}

export function addBreadcrumb(name, data = {}) {
  // Crashlytics offers logging
  crashlytics().log(`${name} - ${JSON.stringify(data)}`);
}

export async function recordHandledError(err, metadata = {}) {
  // record non-fatal exception
  crashlytics().recordError(err);
  // attach custom keys (attributes)
  Object.entries(metadata).forEach(([k, v]) =>
    crashlytics().setAttribute(k, String(v))
  );
}

/* Best practices:
 - Set userId on login & clear on logout
 - Add breadcrumbs for navigation, background tasks, network failures
 - Use attributes (small number) to avoid noise; Crashlytics has limits on attributes
*/

/* ===========================================================================
📌 9. REPORTING JS ERRORS & UNHANDLED PROMISES
===============================================================================
- Unhandled JS errors: see ErrorUtils global handler above.
- Unhandled promise rejections: patch globally (example)
*/
if (!__DEV__) {
  const trackingRejection = (event) => {
    if (event && event.reason) {
      crashlytics().recordError(event.reason);
    }
  };
  // For RN, you may need to hook into global handlers or runtime-specific events
  // (platforms differ). Test thoroughly.
}

/* ===========================================================================
📌 10. NATIVE CRASHES & SYMBOLICATION (why mapping matters)
===============================================================================
- Native crashes (Java/Kotlin / Objective-C / Swift / NDK) produce stack traces that need symbolication:
  - Android: proguard mapping.txt and native debug symbols (if using NDK)
  - iOS: dSYM files
- Upload mapping files automatically (use Crashlytics Gradle plugin + Xcode run script).
- Without mapping, stack traces will be obfuscated and hard to read.
*/

/* ===========================================================================
📌 11. DYNAMIC LINKS: SETUP (console + native)
===============================================================================
1) Firebase Console:
   - Go to Firebase → Dynamic Links → Add domain (e.g., myapp.page.link) or use custom domain.

2) Android config:
   - Add intent filter in AndroidManifest to receive links:
     <intent-filter>
       <action android:name="android.intent.action.VIEW" />
       <category android:name="android.intent.category.DEFAULT" />
       <category android:name="android.intent.category.BROWSABLE" />
       <data android:host="myapp.page.link" android:scheme="https" />
     </intent-filter>

   - If using custom domain, set host accordingly.

3) iOS config:
   - Enable Associated Domains in Xcode capabilities:
     applinks:myapp.page.link
   - Add reverse client id and GoogleService-Info.plist to project.
   - Ensure Team & App ID match Firebase settings.

4) Configure link behavior (open via app or fallback to Play/App Store or web).
*/

/* ===========================================================================
📌 12. CREATE DYNAMIC LINKS (console & programmatically)
===============================================================================
- You can create short or long links in Firebase Console (useful for marketing).
- Programmatic creation (backend) example (recommended for controlled params):
  - Use REST API: https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=API_KEY (server-side)
  - Or use Admin SDK to build links on server if available.

Payload examples (short link POST body):
{
  "dynamicLinkInfo": {
    "domainUriPrefix": "https://myapp.page.link",
    "link": "https://myapp.example.com/welcome?ref=campaign123",
    "androidInfo": { "androidPackageName": "com.mycompany.myapp" },
    "iosInfo": { "iosBundleId": "com.mycompany.myapp" },
    "socialMetaTagInfo": { "title": "Join MyApp", "description": "Awesome app" }
  }
}
Note: API_KEY here is a Firebase Web API Key (public), it's OK to use from server; prefer server-side creation for secure campaigns/attribution.
*/

/* ===========================================================================
📌 13. HANDLING DYNAMIC LINKS IN APP (React Native)
===============================================================================
- Use @react-native-firebase/dynamic-links to handle foreground, background & cold-start links.
*/
import { useEffect } from "react";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { Linking } from "react-native";

export function useDynamicLinksHandler(navigation) {
  useEffect(() => {
    // 1) When app is opened from a dynamic link (cold start)
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link && link.url) {
          handleLink(link.url, navigation);
        }
      });

    // 2) When app is in background or foreground and receives a link
    const unsubscribe = dynamicLinks().onLink((link) => {
      if (link && link.url) handleLink(link.url, navigation);
    });

    // 3) Also handle generic Linking (optional) if you have non-dynamic links
    const linkingSub = Linking.addEventListener("url", (evt) => {
      handleLink(evt.url, navigation);
    });

    return () => {
      unsubscribe();
      linkingSub.remove && linkingSub.remove();
    };
  }, []);
}

function handleLink(url, navigation) {
  // parse URL and route inside app
  // example: https://myapp.example.com/welcome?ref=campaign123
  const parsed = new URL(url);
  const pathname = parsed.pathname;
  const params = Object.fromEntries(parsed.searchParams.entries());

  // Log analytics event
  analytics().logEvent("dynamic_link_open", { url, ...params });

  // Navigate based on path
  if (pathname.startsWith("/welcome")) {
    navigation.navigate("Welcome", { ref: params.ref });
  }
}

/* ===========================================================================
📌 14. DEFERRED DEEP LINKING (install then open)
===============================================================================
- Dynamic Links supports deferred deep linking: user clicks link, installs app, opens app and receives the original link.
- Ensure you call `getInitialLink()` on cold start (see above) to capture deferred link.
- Test carefully: use adb to mimic install flows for Android or real devices for iOS.
*/

/* ===========================================================================
📌 15. ANALYTICS & ATTRIBUTION
===============================================================================
- Firebase Analytics automatically receives Dynamic Link attribution events for installs & opens.
- You can log custom events when handling a dynamic link (see handleLink example).
- Use campaign parameters (utm_source, utm_medium, utm_campaign) inside the link to track marketing channels.
*/

/* ===========================================================================
📌 16. TESTING (Crashlytics & Dynamic Links)
===============================================================================
Crashlytics:
  - Generate a test crash: crashlytics().crash() — useful to verify pipeline.
  - For JS: throw an error inside a dev build where Crashlytics enabled and verify console.
  - Verify in Firebase console (may take few minutes) and check stack traces & logs.

Dynamic Links:
  - Create test link in console and open on real device → verify app routing.
  - Test deferred deep linking: uninstall app, open link, install app, open app → check initial link.
  - Test multiple scenarios: foreground, background, cold start.

Note: Firebase console may take some minutes to show events; symbolication (native) may take additional time for dSYM/mapping uploads.
*/

/* ===========================================================================
📌 17. CI AUTOMATION (upload symbols, mapping files)
===============================================================================
Android:
  - Use Crashlytics Gradle plugin to upload mapping.txt automatically during release build.
  - Or use `firebase-cli` or Gradle tasks in CI to upload native symbols.

iOS:
  - Ensure the Xcode Run Script `${PODS_ROOT}/FirebaseCrashlytics/run` runs in CI to upload dSYMs.
  - Using Fastlane, add `upload_symbols_to_crashlytics` action if needed.

Fastlane (example):
lane :android_release do
  gradle(task: "bundleRelease")
  # crashlytics mapping upload may be automatic; otherwise use firebase CLI
end

lane :ios_release do
  build_app(...)
  upload_symbols_to_crashlytics(dsym_path: './path/to/dSYMs')
end

GitHub Actions:
  - Add steps to build release artifacts and ensure symbol upload steps run after build.
  - Store Firebase service account key in secrets to allow server-side symbol uploads if using API.
*/

/* ===========================================================================
📌 18. PRIVACY & GDPR (must-read)
===============================================================================
- Inform users in privacy policy that you collect crash reports and device info.  
- Allow user opt-out for analytics/crash (if required by law or privacy policy).  
- Avoid logging PII in crash reports (do not set email or sensitive attributes unless permitted and stored securely).  
- If you must include user identifiers, ensure consent & secure handling.  
- Use data retention & deletion policies for crash reports per legal requirements.
*/

/* ===========================================================================
📌 19. TROUBLESHOOTING (common issues)
===============================================================================
• Crashlytics not receiving reports:
  - Check that collection is enabled (not disabled in code).
  - Confirm `google-services.json` / `GoogleService-Info.plist` placed correctly.
  - Ensure release build (some SDKs suppress reports in debug).
  - Upload mapping files / dSYMs.

• Dynamic Links does not open app:
  - Check intent filters (Android) and Associated Domains / applinks (iOS).
  - Ensure domain is configured in Firebase Console.
  - Test with real devices (simulators sometimes behave differently).

• Stack traces obfuscated:
  - Upload mapping.txt (Android) and dSYMs (iOS).
  - Confirm proguard/R8 settings and that Gradle/Xcode run scripts executed in CI.

• Link attribution missing:
  - Ensure analytics is enabled and you log events when handling links.
  - Check campaign parameters in the link payload.
*/

/* ===========================================================================
📌 20. CHECKLIST — QUICK (before shipping)
===============================================================================
✔ Firebase project configured with both Android & iOS apps  
✔ google-services.json & GoogleService-Info.plist in correct native folders  
✔ @react-native-firebase packages installed & pods installed for iOS  
✔ Crashlytics collection enabled for release; disabled in dev if desired  
✔ Global JS error handler records unhandled exceptions (careful with forced native crash)  
✔ Set userId, custom keys, and logs (breadcrumbs) where helpful  
✔ Ensure native symbol (mapping/dSYM) upload is automated in CI  
✔ Dynamic Links domain configured & intent filters / associated domains set up  
✔ Test dynamic links (cold start, deferred, background, foreground)  
✔ Add privacy notice & opt-out options if required  
✔ CI uploads symbols and builds releases with correct configs per environment
*/

/* ===========================================================================
📌 21. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: What is Crashlytics?  
A: Firebase Crashlytics is a crash-reporting tool showing realtime crash groups, stack traces, and breadcrumbs.

Q2: How do you add custom data to crash reports?  
A: Use crashlytics().setUserId(), setAttribute(), and crashlytics().log() to add user info & breadcrumbs.

Q3: Why upload dSYMs and mapping files?  
A: To symbolicate native stack traces so you see readable function names and lines instead of obfuscated symbols.

Q4: What are Dynamic Links?  
A: Links that survive install and open a specific place in the app, useful for referrals and deferred deep linking.

Q5: Where should the Firebase API key live?  
A: The Firebase Web API Key in client config is public (used by SDKs). Secrets and server keys must remain on the backend.

Q6: How do Crashlytics and Analytics work together?  
A: Crashlytics reports include event logs and attributes; Analytics provides attribution & conversion tracking (e.g., from a dynamic link).
*/

/* ===========================================================================
📌 22. SAMPLE: MINIMAL USAGE EXAMPLE (single-file)
===============================================================================
// In your login flow:
async function onLogin(user) {
  setCrashUser(user.id, user.email);
  crashlytics().setAttribute('account_type', user.accountType);
  analytics().logLogin({ method: 'email' });
}

// In an important action:
async function placeOrder(order) {
  addBreadcrumb('place_order_attempt', { orderId: order.id, total: order.total });
  try {
    await api.createOrder(order);
    analytics().logEvent('order_placed', { orderId: order.id, value: order.total });
  } catch (e) {
    await recordHandledError(e, { orderId: order.id });
    throw e;
  }
}

// Deep link handling (see useDynamicLinksHandler above)
*/

/* ===========================================================================
📌 23. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Install @react-native-firebase/app + crashlytics + dynamic-links (+analytics).  
2) Place google-services.json & GoogleService-Info.plist correctly.  
3) Initialize Crashlytics, attach global JS error handler, add breadcrumbs & userId.  
4) Upload mapping & dSYM files automatically in CI for readable native stack traces.  
5) Configure Dynamic Links domain, intent filters (Android), and Associated Domains (iOS).  
6) Use dynamicLinks().getInitialLink() + onLink() to route users, log analytics events.  
7) Test cold start, deferred deep links, and crash reports. 8) Respect privacy & offer opt-outs. 9) Automate symbol uploads in CI (Fastlane/GHA).
*/

/* ===========================================================================
📌 24. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Exact Fastlane + GitHub Actions scripts to build releases and upload dSYMs/mapping files  
  ✅ Full server-side workflow for programmatic Dynamic Link creation & campaign tracking  
  ✅ Debugging playbook: step-by-step for "no crashes showing", "no dynamic link received" issues
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
