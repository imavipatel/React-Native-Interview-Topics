/**
 * ==============================================================
 * 📘 React Navigation – Lifecycle Events (focus, blur)
 * ==============================================================
 *
 * 🟢 THEORY (What & Why?)
 * --------------------------------------------------------------
 * - Just like components have lifecycle methods (mount, update, unmount),
 *   React Navigation provides **navigation lifecycle events**.
 *
 * - Two most common events:
 *   1. **focus** → when the screen becomes active (visible to the user).
 *   2. **blur**  → when the screen goes out of focus (user navigates away).
 *
 * - These events help in:
 *   ✅ Refreshing data when a screen comes into view
 *   ✅ Starting animations or tracking (analytics)
 *   ✅ Pausing/cleaning up timers, listeners, or API calls when leaving screen
 *
 * - Without lifecycle events, you might keep unnecessary work running
 *   even when the screen is hidden → leads to **performance & memory issues**.
 *
 * ==============================================================
 * 🔹 Using `useFocusEffect` (Recommended Hook)
 * --------------------------------------------------------------
 * - Runs effect every time screen is focused.
 * - Automatically cleans up when screen is blurred.
 */
import React from "react";
import { View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

function ProfileScreen() {
  useFocusEffect(
    React.useCallback(() => {
      console.log("🔵 Screen is focused! Fetching data...");
      // Example: Fetch user profile
      return () => {
        console.log("⚪ Screen lost focus! Cleaning up...");
        // Example: cancel API request, stop timer
      };
    }, [])
  );

  return (
    <View>
      <Text>👤 Profile Screen</Text>
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 Using `navigation.addListener`
 * --------------------------------------------------------------
 * - Low-level way to listen to navigation events (focus, blur).
 * - Useful if you need precise control or don't want to use hooks.
 */
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

function SettingsScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      console.log("🔵 Settings screen is focused");
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      console.log("⚪ Settings screen lost focus");
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return (
    <View>
      <Text>⚙️ Settings Screen</Text>
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 Real-World Use Cases
 * --------------------------------------------------------------
 * ✅ focus:
 *   - Refresh latest data (API call)
 *   - Start a camera preview or animation
 *   - Resume video/audio playback
 *
 * ✅ blur:
 *   - Stop ongoing network requests
 *   - Pause timers or stop playing media
 *   - Save draft data (like form input)
 *
 * ==============================================================
 * 🔹 Example: Auto-refresh feed when focused
 */
function FeedScreen() {
  useFocusEffect(
    React.useCallback(() => {
      console.log("🔵 Fetching latest feed...");
      // fetchFeed();
    }, [])
  );

  return <Text>📰 Feed Screen</Text>;
}

/**
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: What is the difference between component lifecycle & navigation lifecycle?
 *   → Component lifecycle = mount/update/unmount of React component
 *     Navigation lifecycle = screen visibility (focus/blur)
 *
 * Q2: Why is `useFocusEffect` preferred over `useEffect`?
 *   → `useEffect` runs only on mount/unmount.
 *     `useFocusEffect` runs every time the screen is focused/blurred,
 *     which is correct for navigation-based apps.
 *
 * Q3: Can I use both `focus` and `blur` events together?
 *   → Yes, they complement each other.
 *     Focus = do work, Blur = clean up work.
 *
 * Q4: What happens if we don’t clean up on blur?
 *   → Background work continues (timers, API calls) → memory leaks & performance issues.
 *
 * Q5: How to decide between `navigation.addListener` and `useFocusEffect`?
 *   → `useFocusEffect` is simpler & automatically handles cleanup.
 *     Use `addListener` when you need event subscriptions outside React components.
 *
 * ==============================================================
 * 🔹 Comparison with App Lifecycle (AppState)
 * --------------------------------------------------------------
 * - React Navigation lifecycle (`focus`, `blur`) works **inside the app**
 *   for switching between screens.
 * - App Lifecycle (`AppState`) works for **app-wide events** like:
 *   - Foreground (active)
 *   - Background (inactive)
 *   - Killed (terminated)
 *
 * ✅ Example Difference:
 *   - If you go from "Home" → "Profile":
 *       AppState = still "active"
 *       Navigation = Home (blur), Profile (focus)
 *
 *   - If you minimize the app:
 *       AppState = goes to "background"
 *       Navigation events = none triggered
 *
 * ✅ Best Practice:
 *   - Use AppState for global tasks (pause music, disconnect socket)
 *   - Use focus/blur for screen-specific tasks (refresh data, clean timers)
 *
 * ==============================================================
 */
