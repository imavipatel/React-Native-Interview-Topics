/**
 * ==============================================================
 * 📘 React Native Notes – Deep Linking & Linking API
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is Deep Linking?
 * - A way to open a specific screen inside your app from an external source
 *   (like a link, notification, QR code, or another app).
 * - Example:
 *   - `myapp://profile/101` → Opens the Profile screen with ID = 101
 *   - `https://myapp.com/profile/101` → Universal link → Opens same screen
 *
 * 🔹 Why use Deep Linking?
 * 1) Better user experience (direct navigation).
 * 2) Integration with other apps / websites.
 * 3) Handle push notifications with specific routes.
 * 4) Marketing campaigns (links to promotions inside app).
 *
 * 🔹 Types of Deep Linking
 * 1) **Custom URI Scheme** → e.g. `myapp://details/1`
 * 2) **Universal Links (iOS) / App Links (Android)** → e.g. `https://myapp.com/details/1`
 *
 * --------------------------------------------------------------
 * 🔹 Linking API
 * - React Native’s built-in `Linking` API is used to:
 *   ✅ Open external apps/URLs
 *   ✅ Listen to deep link events
 *   ✅ Handle incoming URLs
 *
 * ==============================================================
 * 🔹 Example 1: Open External Links
 * --------------------------------------------------------------
 */
import React from "react";
import { Button, Linking } from "react-native";

export default function OpenLinkExample() {
  const openGoogle = () => {
    Linking.openURL("https://www.google.com"); // opens browser
  };

  return <Button title="Open Google" onPress={openGoogle} />;
}

/**
 * ==============================================================
 * 🔹 Example 2: Handle Incoming Deep Links
 * --------------------------------------------------------------
 */
import React, { useEffect } from "react";
import { View, Text, Linking } from "react-native";

function DeepLinkExample() {
  useEffect(() => {
    // Get initial link when app is opened from cold start
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("App opened with URL:", url);
      }
    });

    // Listen for deep link events when app is already running
    const subscription = Linking.addEventListener("url", (event) => {
      console.log("Deep link triggered:", event.url);
    });

    return () => {
      subscription.remove(); // cleanup to prevent memory leak
    };
  }, []);

  return (
    <View>
      <Text>Deep Linking Example</Text>
    </View>
  );
}

// export default DeepLinkExample;

/**
 * ==============================================================
 * 🔹 Example 3: Deep Linking with React Navigation
 * --------------------------------------------------------------
 * - React Navigation integrates with Linking for automatic route handling.
 */
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function Home() {
  return <Text>Home Screen</Text>;
}
function Profile({ route }) {
  return <Text>Profile ID: {route.params.id}</Text>;
}

const linking = {
  prefixes: ["myapp://", "https://myapp.com"], // supported schemes
  config: {
    screens: {
      Home: "home",
      Profile: "profile/:id", // profile/101 → { id: 101 }
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * --------------------------------------------------------------
 * Q1: What is deep linking in React Native?
 *    → It allows opening a specific screen inside the app using a URL.
 *
 * Q2: What’s the difference between Custom URI Scheme vs Universal Links?
 *    → Custom Scheme → works only for your app (myapp://)
 *      Universal Links / App Links → open app if installed, else open website.
 *
 * Q3: How to listen for deep links inside React Native?
 *    → Using `Linking.addEventListener("url", callback)`
 *
 * Q4: How to handle deep linking with React Navigation?
 *    → Define `linking` object with prefixes + screen config.
 *
 * Q5: What are real-world use cases of deep linking?
 *    → Push notifications, referral campaigns, QR codes, in-app navigation.
 *
 * ==============================================================
 */

/**
 * ==============================================================
 * 📘 React Native Notes – Deep Linking + Linking API (Combined)
 * ==============================================================
 *
 * 🟢 THEORY (What & Why?)
 * --------------------------------------------------------------
 * - Deep Linking = Open specific screens in the app from an external link.
 *   Examples:
 *     - Custom Scheme → `myapp://profile/101`
 *     - Universal/App Links → `https://myapp.com/profile/101`
 *
 * - Used for: Push notifications, marketing links, QR codes, referrals,
 *   and navigation from external apps/websites.
 *
 * - React Native provides the **Linking API** for handling URLs.
 *   React Navigation supports **Deep Linking** with config mapping.
 *
 * ==============================================================
 * 🔹 Linking API Basics
 * --------------------------------------------------------------
 * ✅ Open external URLs:
 *     Linking.openURL("https://google.com")
 *
 * ✅ Check if URL can be opened:
 *     Linking.canOpenURL("myapp://profile/1")
 *
 * ✅ Listen for incoming links:
 *     Linking.addEventListener("url", callback)
 *
 * ✅ Get initial launch URL:
 *     Linking.getInitialURL()
 *
 * ==============================================================
 * 🔹 React Navigation Deep Linking Setup
 * --------------------------------------------------------------
 */
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";

const Stack1 = createStackNavigator();

function Home() {
  return <Text>🏠 Home Screen</Text>;
}
function Profile({ route }) {
  return <Text>👤 Profile ID: {route.params.id}</Text>;
}

const linking1 = {
  prefixes: ["myapp://", "https://myapp.com"], // supported schemes/domains
  config: {
    screens: {
      Home: "home",
      Profile: "profile/:id", // maps link → screen params
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking1}>
      <Stack1.Navigator>
        <Stack1.Screen name="Home" component={Home} />
        <Stack1.Screen name="Profile" component={Profile} />
      </Stack1.Navigator>
    </NavigationContainer>
  );
}

/**
 * ==============================================================
 * 🔹 Platform Setup for Deep Linking
 * --------------------------------------------------------------
 *
 * 🟠 1. Android Setup (AndroidManifest.xml)
 * --------------------------------------------------------------
 * - You must declare intent filters for your scheme/domain.
 *
 * Example:
 *
 * <manifest ...>
 *   <application ...>
 *     <activity
 *       android:name=".MainActivity"
 *       android:launchMode="singleTask"
 *       android:autoVerify="true"
 *       android:exported="true"
 *       android:windowSoftInputMode="adjustResize">
 *
 *       <!-- Custom URI scheme -->
 *       <intent-filter>
 *         <action android:name="android.intent.action.VIEW" />
 *         <category android:name="android.intent.category.DEFAULT" />
 *         <category android:name="android.intent.category.BROWSABLE" />
 *         <data android:scheme="myapp" android:host="profile" />
 *       </intent-filter>
 *
 *       <!-- App Link (https://myapp.com) -->
 *       <intent-filter android:autoVerify="true">
 *         <action android:name="android.intent.action.VIEW" />
 *         <category android:name="android.intent.category.DEFAULT" />
 *         <category android:name="android.intent.category.BROWSABLE" />
 *         <data android:scheme="https"
 *               android:host="myapp.com"
 *               android:pathPrefix="/profile" />
 *       </intent-filter>
 *     </activity>
 *   </application>
 * </manifest>
 *
 * --------------------------------------------------------------
 * 🟠 2. iOS Setup (Info.plist)
 * --------------------------------------------------------------
 * - Add `CFBundleURLTypes` for custom schemes.
 * - Add `NSUserActivityTypes` for universal links.
 *
 * Example: Info.plist
 *
 * <plist version="1.0">
 * <dict>
 *   ...
 *   <!-- Custom Scheme -->
 *   <key>CFBundleURLTypes</key>
 *   <array>
 *     <dict>
 *       <key>CFBundleURLSchemes</key>
 *       <array>
 *         <string>myapp</string>
 *       </array>
 *     </dict>
 *   </array>
 *
 *   <!-- Universal Links -->
 *   <key>NSUserActivityTypes</key>
 *   <array>
 *     <string>NSUserActivityTypeBrowsingWeb</string>
 *   </array>
 * </dict>
 * </plist>
 *
 * --------------------------------------------------------------
 * 🟠 3. Apple App Site Association (AASA) File
 * --------------------------------------------------------------
 * - Required for Universal Links.
 * - Hosted at: `https://myapp.com/apple-app-site-association`
 *
 * Example AASA file:
 * {
 *   "applinks": {
 *     "apps": [],
 *     "details": [
 *       {
 *         "appID": "TEAM_ID.BUNDLE_IDENTIFIER",
 *         "paths": [ "/profile/*", "/home" ]
 *       }
 *     ]
 *   }
 * }
 *
 * --------------------------------------------------------------
 * 🟠 4. Android Asset Links (assetlinks.json)
 * --------------------------------------------------------------
 * - Required for App Links.
 * - Hosted at: `https://myapp.com/.well-known/assetlinks.json`
 *
 * Example assetlinks.json:
 * [
 *   {
 *     "relation": ["delegate_permission/common.handle_all_urls"],
 *     "target": {
 *       "namespace": "android_app",
 *       "package_name": "com.myapp",
 *       "sha256_cert_fingerprints": [
 *         "YOUR_APP_SIGNATURE_HASH"
 *       ]
 *     }
 *   }
 * ]
 *
 * ==============================================================
 * 🔹 Deep Linking Flow (Step-by-Step)
 * --------------------------------------------------------------
 * 1. User clicks a deep link (e.g., `myapp://profile/101`).
 * 2. OS (Android/iOS) checks registered schemes/app links.
 * 3. If app installed → launches app’s MainActivity (Android) or AppDelegate (iOS).
 * 4. The deep link URL is passed to React Native via **Linking API**.
 * 5. React Navigation parses the URL using `linking.config`.
 * 6. Correct screen opens with params (e.g., `route.params.id = 101`).
 *
 * ==============================================================
 * ❓ Q&A (Common Interview Questions)
 * --------------------------------------------------------------
 * Q1: Difference between custom scheme vs universal/app links?
 *    → Custom scheme: works only if app is installed (myapp://...)
 *      Universal/App links: works even if app isn’t installed → opens website.
 *
 * Q2: How to configure Android for deep linking?
 *    → Add `<intent-filter>` in AndroidManifest.xml.
 *
 * Q3: How to configure iOS for deep linking?
 *    → Add CFBundleURLTypes in Info.plist + setup AASA file for universal links.
 *
 * Q4: What files are needed on the server?
 *    → iOS → apple-app-site-association
 *      Android → assetlinks.json
 *
 * Q5: How does React Navigation handle deep linking?
 *    → Using `linking` config with `prefixes` + `screen` mapping.
 *
 * ==============================================================
 */
