/**
 * ==============================================================
 * 📘 React Notes – Context API & useContext
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is Context API?
 * - A way to **share data between components** without passing props
 *   manually at every level (avoids "props drilling").
 * - Provides a **global-like state** for React apps.
 *
 * 🔹 Why use Context?
 * - Useful for data that many components need:
 *    ✅ Theme (light/dark)
 *    ✅ User authentication
 *    ✅ Language/Localization
 *    ✅ App settings
 *
 * 🔹 How it works?
 * 1. Create Context → `const MyContext = React.createContext()`
 * 2. Provide Context → Wrap components with `<MyContext.Provider>`
 * 3. Consume Context → Use `useContext(MyContext)` or `<MyContext.Consumer>`
 *
 * --------------------------------------------------------------
 * 🔹 useContext Hook
 * - A hook to access context values directly.
 * - Removes the need for `<Context.Consumer>` wrapper.
 *
 * Syntax:
 * const value = useContext(MyContext);
 *
 * ==============================================================
 * 🔹 Example – Theme Context
 * --------------------------------------------------------------
 */
import React, { createContext, useContext, useState } from "react";
import { View, Text, Button } from "react-native";

// 1️⃣ Create Context
const ThemeContext = createContext();

// 2️⃣ Create Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3️⃣ Consume Context with useContext
function ThemedScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme === "light" ? "#fff" : "#333",
      }}
    >
      <Text
        style={{ color: theme === "light" ? "#000" : "#fff", fontSize: 20 }}
      >
        Current Theme: {theme}
      </Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
}

// 4️⃣ Root App
export default function App() {
  return (
    <ThemeProvider>
      <ThemedScreen />
    </ThemeProvider>
  );
}

/**
 * ✅ How it works:
 * - `ThemeProvider` stores the theme state.
 * - `ThemedScreen` reads theme value with useContext.
 * - Toggle button updates context → re-renders all consumers.
 *
 * ==============================================================
 * 🔹 Example – User Authentication Context
 * --------------------------------------------------------------
 */
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (name) => setUser({ name });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function UserProfile() {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <View style={{ padding: 20 }}>
      {user ? (
        <>
          <Text>Welcome, {user.name}!</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Button title="Login" onPress={() => login("Avi")} />
      )}
    </View>
  );
}

function App2() {
  return (
    <AuthProvider>
      <UserProfile />
    </AuthProvider>
  );
}

/**
 * ✅ How it works:
 * - Context provides `user`, `login`, and `logout`.
 * - `UserProfile` can directly access them without prop drilling.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What problem does Context API solve?
 *    → Avoids "props drilling" when passing data through multiple levels.
 *
 * Q2: How is Context different from Redux?
 *    → Context is simpler, good for small-medium state sharing.
 *      Redux is more powerful for large apps with complex global state.
 *
 * Q3: Can useContext cause performance issues?
 *    → Yes, because when context changes, all consumers re-render.
 *      Solution: Split contexts or use memoization.
 *
 * Q4: How many contexts can you use in one app?
 *    → Unlimited. You can nest multiple providers.
 *
 * Q5: When NOT to use Context?
 *    → For very frequent state updates (e.g., animations, counters).
 *      Use local state or state management libraries instead.
 *
 * Q6: Real-world use cases?
 *    - Theme switching
 *    - Multi-language support
 *    - Authentication (logged-in user info)
 *    - App-wide settings
 *
 * ==============================================================
 */
