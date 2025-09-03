/**
 * ==============================================================
 * 📘 React Native Hooks for Device Adaptability
 * 👉 useWindowDimensions & useColorScheme
 * ==============================================================
 *
 * 🟢 Why do we need these hooks?
 * --------------------------------------------------------------
 * - Mobile devices have different screen sizes (small, large, tablet).
 * - Users may switch between Light Mode 🌞 and Dark Mode 🌙.
 * - These hooks help us adapt UI dynamically:
 *    1. useWindowDimensions → gives live screen size (width & height).
 *    2. useColorScheme → tells if the system theme is light or dark.
 *
 * ==============================================================
 * 🔹 useWindowDimensions → (Responsive screen size)
 * --------------------------------------------------------------
 * ✅ What is it?
 * - A React Native hook that returns an object with:
 *   { width, height, scale, fontScale }
 * - Unlike `Dimensions.get()`, it updates automatically if the screen rotates.
 *
 * ✅ Why use it?
 * - To build responsive UIs (tablet vs phone).
 * - To adjust layout on orientation change (portrait ↔ landscape).
 *
 * ✅ Example:
 */
import React from "react";
import { Text, View, useWindowDimensions } from "react-native";

export default function WindowDimensionsExample() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Screen width: {width}</Text>
      <Text>Screen height: {height}</Text>
      {width > 600 ? (
        <Text>Tablet Layout 🖥️</Text>
      ) : (
        <Text>Mobile Layout 📱</Text>
      )}
    </View>
  );
}

/**
 * 📝 Key points:
 * - Always better than Dimensions.get() because it updates automatically.
 * - Useful for responsive design → e.g. show grid on tablets, list on phones.
 *
 * ==============================================================
 * 🔹 useColorScheme → (Light / Dark mode detection)
 * --------------------------------------------------------------
 * ✅ What is it?
 * - A React Native hook that returns "light" or "dark".
 * - Helps apps automatically adapt to the device theme.
 *
 * ✅ Why use it?
 * - Users prefer system-wide theme consistency.
 * - Dark mode saves battery on OLED screens.
 *
 * ✅ Example:
 */
import React from "react";
import { Text, View, StyleSheet, useColorScheme } from "react-native";

export default function ColorSchemeExample() {
  const theme = useColorScheme(); // "light" or "dark"

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#000" : "#fff",
    },
    text: {
      color: theme === "dark" ? "#fff" : "#000",
      fontSize: 18,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Current Theme: {theme === "dark" ? "🌙 Dark Mode" : "🌞 Light Mode"}
      </Text>
    </View>
  );
}

/**
 * 📝 Key points:
 * - Returns only "light" or "dark".
 * - Combine with StyleSheet or ThemeProvider for full theming.
 * - Can also be used with custom dark/light asset sets (e.g. images).
 *
 * ==============================================================
 * 📊 Comparison Table
 * --------------------------------------------------------------
 * | Hook               | What it returns        | Example Use Case                |
 * |--------------------|------------------------|---------------------------------|
 * | useWindowDimensions| {width, height, ...}  | Responsive layouts, orientation |
 * | useColorScheme     | "light" / "dark"      | Dark mode / light mode themes   |
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Difference between Dimensions.get() and useWindowDimensions?
 *   → Dimensions.get() gives static values (need manual listener).
 *     useWindowDimensions auto-updates when screen rotates/resizes.
 *
 * Q2: Can useColorScheme return "no-preference"?
 *   → No, in React Native it only returns "light" or "dark".
 *
 * Q3: Why is dark mode important in mobile apps?
 *   → Better readability in low light, saves battery, user preference.
 *
 * Q4: How would you build a fully responsive app in RN?
 *   → Combine useWindowDimensions, Flexbox, and percentage-based widths.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - `useWindowDimensions` → build responsive UIs that adapt to any screen.
 * - `useColorScheme` → support light & dark themes easily.
 * - Together → modern, user-friendly, system-adaptive React Native apps.
 *
 * ==============================================================
 * 🔹 Combined Example → (Responsive + Theming together)
 * --------------------------------------------------------------
 */
import React from "react";
import { Text, View, StyleSheet, useWindowDimensions, useColorScheme } from "react-native";

export default function CombinedExample() {
  const { width } = useWindowDimensions();
  const theme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#111" : "#eee",
    },
    text: {
      color: theme === "dark" ? "#fff" : "#000",
      fontSize: width > 600 ? 24 : 16, // bigger text on tablets
      margin: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {width > 600 ? "Tablet Layout 🖥️" : "Mobile Layout 📱"}
      </Text>
      <Text style={styles.text}>
        Current Theme: {theme === "dark" ? "🌙 Dark Mode" : "🌞 Light Mode"}
      </Text>
    </View>
  );
}

/**
 * ==============================================================
 * 🚀 With this combined example:
 * - Screen adjusts based on size → Responsive.
 * - Theme changes with system setting → Adaptive.
 * - Best practice: Combine both hooks for modern apps.
 * ==============================================================
 */
