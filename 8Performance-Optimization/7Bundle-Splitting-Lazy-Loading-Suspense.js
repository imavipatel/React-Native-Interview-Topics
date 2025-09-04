/* =============================================================================
📘 Bundle Splitting & Lazy Loading (React.lazy, Suspense)
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- In React (and React Native), apps can become large and heavy with many 
  components and libraries.
- By default, the entire app bundle is loaded at startup → increases 
  load time and memory usage.
- Solution → Bundle Splitting & Lazy Loading
*/

/* =============================================================================
🔹 Bundle Splitting
-----------------------------------------------------------------------------
- Breaking the large JS bundle into smaller chunks.
- Only load what is needed at a given time.

✅ Benefits:
1. 🚀 Faster app startup (load only essential code).
2. 📉 Lower memory usage.
3. ⚡ Better performance for large apps.
*/

// Example (Web – works with Webpack, Metro bundler in RN):
import("./SomeBigComponent").then((module) => {
  const BigComp = module.default;
  // use component dynamically
});

/* =============================================================================
🔹 Lazy Loading
-----------------------------------------------------------------------------
- Technique to load components only when required (on-demand).
- React provides React.lazy + Suspense for this.

✅ When to use?
- Heavy components (charts, maps, video players).
- Screens/routes that are not visited often.
*/

/* =============================================================================
🔹 React.lazy
-----------------------------------------------------------------------------
- Allows you to load a component dynamically with import().
*/

import React, { Suspense } from "react";

const LazyProfile = React.lazy(() => import("./ProfileScreen"));

function App() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <LazyProfile />
    </Suspense>
  );
}

/*
✅ Key Points:
- React.lazy must return a default export.
- Must be wrapped with <Suspense>.
*/

/* =============================================================================
🔹 Suspense
-----------------------------------------------------------------------------
- React component that handles loading states for lazy-loaded components.
- fallback prop → what to show while waiting (e.g., spinner, loader).
*/

<Suspense fallback={<ActivityIndicator />}>
  <LazyScreen />
</Suspense>;

/* =============================================================================
🔹 Real Example (React Native)
============================================================================= */

import React, { Suspense } from "react";
import { View, Text, ActivityIndicator } from "react-native";

// Lazy load heavy screen
const SettingsScreen = React.lazy(() => import("./screens/SettingsScreen"));

export default function AppRN() {
  return (
    <View style={{ flex: 1 }}>
      <Text>🏠 Home Screen</Text>

      <Suspense fallback={<ActivityIndicator size="large" color="blue" />}>
        <SettingsScreen />
      </Suspense>
    </View>
  );
}

/* =============================================================================
🔹 Bundle Splitting with Navigation
-----------------------------------------------------------------------------
- Often combined with React Navigation.
- Load screens lazily when navigating.
*/

const ProfileScreen = React.lazy(() => import("./ProfileScreen"));

<Stack.Screen
  name="Profile"
  component={() => (
    <Suspense fallback={<Text>Loading Profile...</Text>}>
      <ProfileScreen />
    </Suspense>
  )}
/>;

/* =============================================================================
🔹 Comparison: Bundle Splitting vs Lazy Loading
-----------------------------------------------------------------------------
| Feature                  | Bundle Splitting             | Lazy Loading                 |
|---------------------------|------------------------------|-------------------------------|
| Purpose                   | Split JS into smaller chunks | Load components only on demand|
| When applied              | Build time                   | Runtime                       |
| Example tool              | Webpack, Metro bundler       | React.lazy + Suspense         |
| Performance benefit       | Smaller initial bundle        | Faster navigation/loading     |
*/

/* =============================================================================
🔹 Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: Why use bundle splitting in React Native?
   → To reduce initial bundle size → faster startup on mobile.

Q2: Can we use React.lazy for libraries too?
   → Yes, but mainly for components/screens. For libraries, use dynamic import.

Q3: What’s the fallback in Suspense?
   → A temporary UI (spinner/loader) displayed while the component loads.
*/

/* =============================================================================
🔹 Preloading & Prefetching Strategies
-----------------------------------------------------------------------------
Sometimes lazy loading introduces a delay when opening a new screen.
To make navigation instant, we can use preloading & prefetching.

✅ Preloading:
- Load the component in the background before the user navigates.
- Example: Start loading a Settings screen while the user is still on Home.

✅ Prefetching:
- Load data or assets ahead of time (e.g., API calls, images).
- When the user navigates, everything feels instant.

Example (Preloading a lazy component):
*/

const LazySettings = React.lazy(() => import("./SettingsScreen"));

// Preload before navigation (on hover, focus, or background)
import("./SettingsScreen"); // This will start fetching in background

/*
Example (Prefetching API data):
- Use libraries like React Query or SWR to fetch data early and cache it.
*/

useEffect(() => {
  queryClient.prefetchQuery("settingsData", fetchSettingsData);
}, []);

/*
✅ Benefits:
- 🚀 Instant navigation experience.
- ⏱️ Reduces perceived loading time.
- 📉 Still keeps bundle optimized, but hides lazy-load delay.
*/

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- Bundle Splitting → break large JS bundle into smaller chunks.
- Lazy Loading → load components/screens only when needed.
- Suspense → show fallback while loading.
- Preloading & Prefetching → make navigation feel instant by preparing screens/data ahead.
- Result → 🚀 faster startup, ⚡ smoother performance, 📉 reduced memory usage.
============================================================================= */
