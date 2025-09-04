/**
 * ==============================================================
 * 📘 React Native App Lifecycle – AppState, useFocusEffect, useIsFocused
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * React Native apps run inside the OS lifecycle (foreground, background, inactive).
 * We use different tools to **track and respond to lifecycle changes**:
 *
 * 1️⃣ AppState
 * - A core React Native API to track if the app is in:
 *    🔹 "active" → App is visible and running.
 *    🔹 "background" → App is hidden but still running.
 *    🔹 "inactive" → Transition state (e.g., incoming call).
 * - Useful for: pausing timers, stopping background tasks, saving data.
 *
 * 2️⃣ useFocusEffect (React Navigation)
 * - Runs code whenever a **screen comes into focus**.
 * - Similar to `componentDidFocus` / `componentWillBlur`.
 * - Automatically cleans up when screen is unfocused.
 * - Good for: fetching data, subscribing to events only when screen is visible.
 *
 * 3️⃣ useIsFocused (React Navigation)
 * - Returns a boolean (`true` if the screen is focused).
 * - Lets you conditionally run effects inside `useEffect`.
 * - Good for: showing/hiding UI or fetching only when screen is active.
 *
 * ==============================================================
 * 🔹 Examples
 * --------------------------------------------------------------
 */

//
// ✅ Example 1: AppState (Detect app active/inactive)
//
import React, { useEffect, useState } from "react";
import { AppState, Text, View } from "react-native";

function AppStateExample() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      console.log("App State Changed:", nextState);
      setAppState(nextState);
    });

    return () => subscription.remove(); // cleanup
  }, []);

  return (
    <View>
      <Text>Current App State: {appState}</Text>
    </View>
  );
}

//
// ✅ Example 2: useFocusEffect (Screen lifecycle)
//
import React, { useCallback } from "react";
import { Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

function FocusEffectScreen() {
  useFocusEffect(
    useCallback(() => {
      console.log("🔵 Screen Focused: Fetching Data...");
      return () => {
        console.log("⚪ Screen Unfocused: Cleanup...");
      };
    }, [])
  );

  return <Text>Screen with useFocusEffect</Text>;
}

//
// ✅ Example 3: useIsFocused (Conditional logic based on focus)
//
import React, { useEffect } from "react";
import { Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";

function IsFocusedScreen() {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("Screen is focused → Fetch data");
    } else {
      console.log("Screen lost focus → Stop tasks");
    }
  }, [isFocused]);

  return <Text>{isFocused ? "Focused Screen" : "Not Focused"}</Text>;
}

/**
 * ==============================================================
 * 🔍 Comparison Table
 * --------------------------------------------------------------
 * | Hook/API       | Scope                  | Use Case                         | Cleanup?   |
 * |----------------|------------------------|----------------------------------|------------|
 * | AppState       | Entire App lifecycle   | Pause tasks, save data, handle background | Manual     |
 * | useFocusEffect | Specific Screen        | Fetch data only on screen focus  | Auto       |
 * | useIsFocused   | Specific Screen        | Conditional logic in useEffect   | Manual     |
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * --------------------------------------------------------------
 * Q1: Difference between AppState and useFocusEffect?
 *    → AppState = whole app lifecycle (foreground/background).
 *      useFocusEffect = screen lifecycle in navigation.
 *
 * Q2: When to use useIsFocused over useFocusEffect?
 *    → useIsFocused = when you only need a boolean in useEffect.
 *      useFocusEffect = when you want automatic setup/cleanup.
 *
 * Q3: Can AppState detect when a single screen is hidden?
 *    → No, AppState is for the entire app. For screens, use navigation hooks.
 *
 * Q4: Why use AppState in background tasks?
 *    → To stop unnecessary work (timers, API calls) when app is hidden.
 *
 * ==============================================================
 */
