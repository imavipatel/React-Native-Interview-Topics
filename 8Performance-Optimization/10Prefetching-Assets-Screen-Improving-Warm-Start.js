/* =============================================================================
📘 Prefetching Assets & Screens – Improving Warm Start in React Native
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- "Warm start" = when the app is already loaded in memory, and user re-opens it.
- Prefetching = loading resources (assets, images, screens, API data) in advance 
  before the user actually needs them.
- Helps in:
  ✅ Faster navigation (screen already ready in memory).
  ✅ Smoother UX (no flicker while loading assets/images).
  ✅ Reducing perceived loading time.
*/

/* =============================================================================
🔹 What Can Be Prefetched?
-----------------------------------------------------------------------------
1. **Images & Assets** – load commonly used images/icons in advance.
2. **Fonts** – ensure fonts are cached before they are shown.
3. **Screens/Navigation** – pre-load screens to improve navigation speed.
4. **API Data** – fetch data in advance if you know it will be needed soon.
*/

/* =============================================================================
🔹 Prefetching Images (Example)
============================================================================= */

import { Image } from "react-native";

Image.prefetch("https://example.com/image.png");
// ✅ Downloads and caches the image before it's displayed

/*
✅ Explanation:
- Image.prefetch() caches image in memory/disk before rendering.
- Useful for splash screens, banners, or frequently used icons.
*/

/* =============================================================================
🔹 Prefetching Fonts
============================================================================= */

import * as Font from "expo-font";

async function loadFonts() {
  await Font.loadAsync({
    Roboto: require("./assets/fonts/Roboto.ttf"),
  });
}

/*
✅ Explanation:
- Preloads custom fonts at app startup.
- Prevents UI flickering when text is rendered.
*/

/* =============================================================================
🔹 Prefetching Screens (React Navigation)
============================================================================= */

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";

const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    // Keep splash visible until screens/assets preloaded
    SplashScreen.preventAutoHideAsync();

    const prepare = async () => {
      // Preload images, fonts, API data here
      await Image.prefetch("https://example.com/banner.png");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate loading
      SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*
✅ Explanation:
- App loads assets/screens before hiding splash screen.
- When user navigates, screens are already "warm" → faster transitions.
*/

/* =============================================================================
🔹 Prefetching API Data
============================================================================= */

import React, { useEffect, useState } from "react";

function HomeScreen({ navigation }) {
  const [profileData, setProfileData] = useState(null);

  // Prefetch profile data before navigation
  const prefetchProfile = async () => {
    const res = await fetch("https://api.example.com/user/123");
    const data = await res.json();
    setProfileData(data);
  };

  useEffect(() => {
    prefetchProfile(); // load data in advance
  }, []);

  return (
    <View>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Profile", { data: profileData })}
      />
    </View>
  );
}

/*
✅ Explanation:
- API data is fetched in advance.
- When user clicks "Go to Profile", screen loads instantly with cached data.
*/

/* =============================================================================
🔹 Best Practices
-----------------------------------------------------------------------------
✅ Preload only critical assets (images, fonts, icons) – not everything.
✅ Combine prefetching with a splash screen or loading indicator.
✅ Use libraries:
   - `expo-asset` → prefetch and cache images/assets.
   - `react-query` / `SWR` → prefetch API data with caching.
✅ For large apps:
   - Lazy load less-used screens.
   - Prefetch only likely next screens.
*/

/* =============================================================================
🔹 Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: What is prefetching in React Native?
   → Preloading assets, images, screens, or data before they are needed 
     to make navigation faster and smoother.

Q2: How do you prefetch images?
   → Using `Image.prefetch(url)`.

Q3: How do you improve warm-start performance?
   → Preload frequently used assets/screens at startup, use caching (AsyncStorage, MMKV).

Q4: What’s the difference between lazy loading and prefetching?
   → Lazy loading = load on demand (when needed).
     Prefetching = load in advance (before needed).
*/

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- Prefetching assets/screens improves "warm-start" speed.
- Useful for smoother UX when navigating frequently used screens.
- Combine with caching libraries for maximum performance.
============================================================================= */
