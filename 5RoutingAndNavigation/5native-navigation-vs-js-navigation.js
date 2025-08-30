/**
 * ==============================================================
 * 📘 Native Navigation vs JS Navigation – Performance Comparisons
 * ==============================================================
 *
 * 🟢 THEORY (What & Why?)
 * --------------------------------------------------------------
 * - Navigation is how we move between screens in a mobile app.
 * - In React Native, navigation can be implemented in **two main ways**:
 *
 *   1. **JavaScript (JS) Navigation** → powered by JS libraries (e.g., React Navigation).
 *   2. **Native Navigation** → powered by native OS navigation stacks
 *      (e.g., React Native Navigation by Wix, native stacks in React Navigation).
 *
 * - Both have trade-offs in terms of **performance, complexity, and developer experience**.
 *
 * ==============================================================
 * 🔹 JavaScript Navigation (e.g., React Navigation)
 * --------------------------------------------------------------
 * ✅ Implemented fully in JS → cross-platform solution
 * ✅ Easier to set up → just npm install & configure
 * ✅ Highly customizable with React components
 * ✅ Works consistently on iOS & Android
 *
 * ❌ Performance overhead:
 *   - Screens & transitions handled by JS thread
 *   - Can feel laggy on low-end devices or complex animations
 * ❌ Navigation events are slower (go through Bridge)
 *
 * Example (React Navigation Stack):
 */
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

/**
 * ==============================================================
 * 🔹 Native Navigation (e.g., Wix React Native Navigation)
 * --------------------------------------------------------------
 * ✅ Uses **native platform navigators**:
 *   - iOS → UINavigationController
 *   - Android → FragmentManager / Activities
 *
 * ✅ Better performance:
 *   - Transitions & gestures run on **native UI thread**
 *   - No Bridge bottleneck for animations
 * ✅ Smoother user experience (like pure native apps)
 *
 * ❌ Harder to set up:
 *   - Requires native project changes (Xcode, Gradle)
 * ❌ Less flexible with React-only patterns
 * ❌ Smaller ecosystem compared to React Navigation
 *
 * Example (Wix React Native Navigation):
 */
import { Navigation } from "react-native-navigation";

Navigation.registerComponent("Home", () => HomeScreen);
Navigation.registerComponent("Profile", () => ProfileScreen);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: "Home",
            },
          },
        ],
      },
    },
  });
});

/**
 * ==============================================================
 * 🔹 Hybrid Solutions (Best of Both Worlds)
 * --------------------------------------------------------------
 * - React Navigation introduced **native-stack** using the `react-native-screens` library.
 * - It allows React Navigation (JS-based) to use **native primitives** underneath.
 *
 * ✅ Benefits:
 *   - Native performance for screen transitions
 *   - Still easy to use (JS-first API)
 *   - Less boilerplate compared to Wix RNN
 *   - Good compromise between dev experience & performance
 *
 * Example (Hybrid - native-stack):
 */
import { createNativeStackNavigator as createHybridStack } from "@react-navigation/native-stack";

const HybridStack = createHybridStack();

function HybridApp() {
  return (
    <HybridStack.Navigator>
      <HybridStack.Screen name="Home" component={HomeScreen} />
      <HybridStack.Screen name="Profile" component={ProfileScreen} />
    </HybridStack.Navigator>
  );
}

/**
 * ==============================================================
 * 🔹 Performance Comparison
 * --------------------------------------------------------------
 * ✅ Native Navigation
 *   - Screen transitions handled natively → buttery smooth
 *   - Heavy apps with lots of screens perform better
 *   - No JS thread blocking → UI stays responsive
 *
 * ✅ JS Navigation
 *   - Slightly slower transitions (handled in JS)
 *   - JS thread blockage = delayed navigation
 *   - Easier debugging & flexibility
 *
 * ✅ Hybrid Navigation (React Navigation + native-stack)
 *   - Closer to native performance
 *   - Best compromise between ease-of-use and performance
 *   - Works for most production apps
 *
 * ==============================================================
 * 🔹 Comparison Table
 * --------------------------------------------------------------
 * Feature              | JS Navigation (React Nav)     | Native Navigation (Wix RNN) | Hybrid (React Nav + native-stack)
 * ---------------------|-------------------------------|-----------------------------|---------------------------------
 * Setup                | Easy (JS only)                | Complex (native configs)    | Easy (just enable native-stack)
 * Performance          | Depends on JS thread          | Smooth (native UI thread)   | Near-native performance
 * Animations           | JS-driven (can lag)           | Native-driven (fluid)       | Native-driven (fluid)
 * Ecosystem            | Large, active community       | Smaller, fewer plugins      | Large (same as React Nav)
 * Flexibility          | High (React patterns)         | Limited (native constraints)| High (JS-first, but native perf)
 * Learning Curve       | Easy for React devs           | Harder (native knowledge)   | Easy (like React Nav)
 * Use Case             | Small/medium apps, prototypes | Enterprise apps, perf-heavy | Most production apps
 *
 * ==============================================================
 * 🔹 Real-World Examples
 * --------------------------------------------------------------
 * - Instagram → Uses **native navigation** for smooth transitions
 * - Many RN apps → Use **React Navigation** (easier dev, good enough for most apps)
 * - Hybrid navigation (`native-stack`) → Now the **recommended default** for new RN apps
 *
 * ✅ Rule of Thumb:
 *   - Start with React Navigation (native-stack enabled by default in v6+).
 *   - If your app feels laggy (large app, lots of screens, heavy animations) →
 *     consider Native Navigation.
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Why is Native Navigation faster?
 *   → Because transitions & gestures are handled directly on the **native UI thread**
 *     without depending on the JS thread or Bridge.
 *
 * Q2: Why do most RN apps use React Navigation?
 *   → It’s **easy to set up, flexible, and cross-platform**, with strong community support.
 *
 * Q3: When should you choose Native Navigation?
 *   → For **enterprise-scale apps** where performance & smooth transitions are critical.
 *
 * Q4: Can React Navigation also use native transitions?
 *   → Yes! The `@react-navigation/native-stack` uses `react-native-screens`
 *     under the hood → brings native-like performance (hybrid solution).
 *
 * Q5: Is Native Navigation worth the extra setup?
 *   → Only if your app is **complex, performance-heavy, or animation-intensive**.
 *
 * ==============================================================
 */
