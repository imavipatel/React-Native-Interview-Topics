/**
 * ==============================================================
 * 📘 React Native – useSafeAreaInsets (from react-native-safe-area-context)
 * ==============================================================
 *
 * 🟢 What is Safe Area?
 * --------------------------------------------------------------
 * - On modern devices (iPhone X and above, Android with notches, curved screens),
 *   the screen has "unsafe" areas → notch, status bar, home indicator.
 * - Safe area = region of the screen where content is not obstructed.
 * - Example: If you put a button behind iPhone's notch → user cannot tap it.
 *
 * 🟢 What is useSafeAreaInsets?
 * --------------------------------------------------------------
 * - A hook provided by `react-native-safe-area-context`.
 * - Returns the safe area insets (padding) for each side:
 *   { top, bottom, left, right }.
 * - Helps us add padding/margin dynamically depending on device.
 *
 * 🟢 Why use it?
 * --------------------------------------------------------------
 * - Avoids UI being cut off by notches, status bar, navigation bar.
 * - Works across iOS + Android devices with different screen cutouts.
 * - Better than hardcoding padding (because devices vary).
 *
 * ==============================================================
 * 🔹 Installation
 * --------------------------------------------------------------
 * 1. Install package:
 *    npm install react-native-safe-area-context
 *
 * 2. Wrap your app with SafeAreaProvider (root level, e.g. in App.js):
 *
 *    import { SafeAreaProvider } from 'react-native-safe-area-context';
 *
 *    export default function App() {
 *      return (
 *        <SafeAreaProvider>
 *          <YourApp />
 *        </SafeAreaProvider>
 *      );
 *    }
 *
 * ==============================================================
 * 🔹 Example 1: Basic Usage
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeAreaExample() {
  const insets = useSafeAreaInsets(); // { top, bottom, left, right }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,      // avoid status bar
          paddingBottom: insets.bottom, // avoid home indicator
        },
      ]}
    >
      <Text style={styles.text}>Hello Safe Area 👋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

/**
 * ==============================================================
 * 🔹 Example 2: Sticky Button Above Home Indicator
 */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StickyButtonExample() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <TouchableOpacity
        style={[
          styles1.button,
          { marginBottom: insets.bottom + 10 }, // extra space above home bar
        ]}
      >
        <Text style={styles1.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles1 = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

/**
 * ==============================================================
 * 🔹 Example 3: Custom Header with Dynamic Padding
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles2.header, { paddingTop: insets.top + 10 }]}>
      <Text style={styles2.headerText}>My App</Text>
    </View>
  );
}

const styles2 = StyleSheet.create({
  header: {
    backgroundColor: "purple",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});

/**
 * ==============================================================
 * 📊 Comparison: SafeAreaView vs useSafeAreaInsets
 * --------------------------------------------------------------
 * | Approach        | What it does                                | Flexibility |
 * |-----------------|----------------------------------------------|-------------|
 * | SafeAreaView    | Adds padding automatically for safe areas    | Limited     |
 * | useSafeAreaInsets | Gives exact inset values {top, bottom...} | More control|
 *
 * Example:
 * - SafeAreaView → quick fix (wrap your screen).
 * - useSafeAreaInsets → when you need dynamic values (like sticky buttons).
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Why not just use SafeAreaView instead of useSafeAreaInsets?
 *   → SafeAreaView auto applies padding, but less flexible.  
 *     useSafeAreaInsets gives more control for custom layouts.
 *
 * Q2: What happens if SafeAreaProvider is missing?
 *   → Hook will throw error. Always wrap app in SafeAreaProvider.
 *
 * Q3: Do Android devices also need safe area handling?
 *   → Yes, devices with notches, curved edges, and navigation bars benefit.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - `useSafeAreaInsets` → hook that returns padding needed for safe area.
 * - Helps avoid UI overlaps with notch, status bar, home indicator.
 * - More flexible than SafeAreaView for custom layouts.
 * - Must wrap app with SafeAreaProvider at root.
 * ==============================================================
 */
