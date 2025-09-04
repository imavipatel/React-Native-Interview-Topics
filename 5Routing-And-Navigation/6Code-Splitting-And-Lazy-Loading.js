/**
 * ==============================================================
 * 📘 Code-Splitting & Lazy Loading of Screens in React Native
 * ==============================================================
 *
 * 🟢 THEORY (What & Why?)
 * --------------------------------------------------------------
 * - **Code-splitting**: Breaking your app’s JavaScript bundle into smaller chunks
 *   instead of loading everything at once.
 * - **Lazy loading**: Loading components/screens only when they are actually needed
 *   (on-demand), instead of at app startup.
 *
 * ✅ Why it matters?
 *   - RN bundles can get very large as the app grows.
 *   - Without code-splitting → whole bundle loads at startup → **slow launch time**.
 *   - With lazy loading → only the required screens/components load → **faster startup**,
 *     less memory usage, and smoother performance.
 *
 * ==============================================================
 * 🔹 How It Works
 * --------------------------------------------------------------
 * 1. Split the app bundle into multiple chunks.
 * 2. Load only the entry point (App + initial screen) at startup.
 * 3. When navigating to a new screen → load that screen asynchronously.
 *
 * 🔹 Benefits:
 * - 🚀 Faster startup time → only essential screens load first.
 * - 📉 Reduced memory footprint → not all JS is in memory at once.
 * - ⚡ Better performance for large apps.
 *
 * 🔹 Drawbacks:
 * - ⚠️ Slight delay when loading a lazy-loaded screen (first-time load).
 * - ⚠️ If not managed properly → can lead to too many small chunks = overhead.
 *
 * ==============================================================
 * 🔹 Example – React Native Lazy Loading with React.lazy
 * --------------------------------------------------------------
 */
import React, { Suspense, lazy } from "react";
import { Text } from "react-native";

// Lazy load screens
const HomeScreen = lazy(() => import("./screens/HomeScreen"));
const ProfileScreen = lazy(() => import("./screens/ProfileScreen"));

export default function App() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <HomeScreen />
      {/* When user navigates to ProfileScreen, it will load on-demand */}
      {/* <ProfileScreen /> */}
    </Suspense>
  );
}

/**
 * ==============================================================
 * 🔹 Example – Lazy Loading Screens with React Navigation
 * --------------------------------------------------------------
 */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

// Lazy import function
const LazyProfileScreen = () => {
  const Component = React.lazy(() => import("./screens/ProfileScreen"));
  return (
    <Suspense fallback={<Text>Loading Screen...</Text>}>
      <Component />
    </Suspense>
  );
};

export default function NavApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Profile screen will load lazily when needed */}
        <Stack.Screen name="Profile" component={LazyProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * ==============================================================
 * 🔹 Code-Splitting Strategies
 * --------------------------------------------------------------
 * 1. **Route-based splitting**:
 *    - Each screen/component is split into its own chunk.
 *    - Most common for navigation-heavy apps.
 *
 * 2. **Component-based splitting**:
 *    - Heavy UI components (charts, maps, video players) loaded only when used.
 *
 * 3. **Dynamic import()**:
 *    - Use `import()` syntax to load modules conditionally.
 *
 * Example:
 */
async function loadModule() {
  const { HeavyModule } = await import("./HeavyModule");
  HeavyModule.doSomething();
}

/**
 * ==============================================================
 * 🔹 Performance Best Practices
 * --------------------------------------------------------------
 * ✅ Use `React.lazy` + `Suspense` for splitting screens/components.
 * ✅ Show a lightweight fallback (spinner / skeleton) while loading.
 * ✅ Split only **heavy/non-critical** screens (e.g., Settings, Profile, Charts).
 * ✅ Keep critical paths (like Login, Home) eagerly loaded.
 * ✅ For huge apps → consider **dynamic code push** or **server-driven code loading**.
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: What is the difference between code-splitting and lazy loading?
 *   → Code-splitting breaks bundles into chunks; lazy loading loads those chunks on demand.
 *
 * Q2: How does lazy loading improve performance?
 *   → By reducing initial bundle size, making app startup faster.
 *
 * Q3: Is there any downside to lazy loading?
 *   → Yes, first-time navigation to a lazy screen may cause a slight delay.
 *
 * Q4: How can you improve user experience during lazy loading?
 *   → Show a fallback UI (spinner, loading text, skeleton) while the component loads.
 *
 * Q5: Can we lazy load everything?
 *   → No. Critical screens (like Home, Login, Splash) should be eagerly loaded.
 *     Lazy load only non-essential or heavy screens.
 *
 * ==============================================================
 */
