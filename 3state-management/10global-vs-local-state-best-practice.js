/**
 * ==============================================================
 * 📘 React State Management – Global vs Local State
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Local State
 * - State that belongs to a single component.
 * - Managed using `useState` or `useReducer` in functional components.
 * - Example: Form input values, toggle state, modal visibility.
 * - Lives **only inside the component** → Other components can’t access it directly.
 *
 * 🔹 Global State
 * - Shared state that multiple components across the app need.
 * - Example: Auth user, theme, language, cart items, notifications.
 * - Managed using:
 *    * Context API
 *    * Redux / Zustand / Recoil / MobX
 * - Useful when **many components need the same data**.
 *
 * --------------------------------------------------------------
 * 🔹 When to use Local State?
 * ✅ UI-related small pieces of state.
 * ✅ Temporary state that doesn’t affect other components.
 * ✅ Component-specific logic (dropdown open/close, animation toggle).
 *
 * 🔹 When to use Global State?
 * ✅ Authentication / user session data.
 * ✅ App-wide settings (dark/light theme, localization).
 * ✅ Data shared between unrelated components (cart, notifications).
 * ✅ Caching fetched API data.
 *
 * --------------------------------------------------------------
 * 🔹 Best Practices
 * 1) **Keep state as local as possible**
 *    - Don’t make everything global.
 *    - Start with local state → lift it up only when multiple components need it.
 *
 * 2) **Avoid prop drilling**
 *    - If local state is needed across many layers, consider moving it to global state.
 *
 * 3) **Balance performance**
 *    - Too much global state can cause unnecessary re-renders.
 *    - Keep global state minimal (auth, theme, global config).
 *
 * 4) **Use proper tools**
 *    - Context API → Simple global state (small-medium apps).
 *    - Redux / Zustand / MobX → Complex state logic.
 *    - Recoil → Deeply nested trees with shared state.
 *
 * ==============================================================
 * 🔹 Code Examples
 * --------------------------------------------------------------
 *
 * Example 1: Local State with useState
 */
import React, { useState } from "react";
import { View, Text, Button } from "react-native";

function Counter() {
  const [count, setCount] = useState(0); // local state
  return (
    <View>
      <Text>{count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
}

/**
 * --------------------------------------------------------------
 * Example 2: Global State with Context API
 */
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // global state
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedText() {
  const { theme } = useContext(ThemeContext);
  return (
    <Text style={{ color: theme === "light" ? "black" : "white" }}>Hello</Text>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedText />
    </ThemeProvider>
  );
}

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is the difference between local and global state?
 *    → Local state is confined to a component, while global state is shared across components.
 *
 * Q2: Why not make everything global?
 *    → Increases complexity, reduces performance, and makes debugging harder.
 *
 * Q3: How do you decide where to store state?
 *    → Start with local → Lift up if multiple components need it → Move to global store if app-wide.
 *
 * Q4: How does Context API help with global state?
 *    → Avoids prop drilling by providing state directly to deeply nested components.
 *
 * Q5: Real-world example?
 *    - Local State → Search input text in a search bar.
 *    - Global State → Logged-in user data available across app.
 *
 * ==============================================================
 */
