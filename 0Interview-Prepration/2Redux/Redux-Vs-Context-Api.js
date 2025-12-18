/*********************************************************
 * 📘 Redux vs Context API (Beginner-Friendly JS Notes)
 *********************************************************/

/********************************************
 * 🟢 Simple One-Line Difference
 ********************************************/
/**
 * Context API → For sharing SMALL & SIMPLE data
 * Redux       → For managing LARGE & COMPLEX app state
 */

/********************************************
 * 🟢 What is Context API?
 ********************************************/
/**
 * Context API is a **built-in React feature**.
 *
 * Purpose:
 * - Share data globally
 * - Avoid props drilling
 *
 * Example data:
 * - Theme (dark / light)
 * - Language
 * - Logged-in user (simple)
 */

/********************************************
 * 🟢 What is Redux?
 ********************************************/
/**
 * Redux is an **external state management library**.
 *
 * Purpose:
 * - Manage complex app data
 * - Handle large-scale applications
 *
 * Example data:
 * - Auth tokens
 * - Cart & orders
 * - API caching
 * - Real-time updates
 */

/********************************************
 * 🟢 Context API – How it Works
 ********************************************/
/**
 * 1️⃣ Create Context
 * 2️⃣ Wrap App with Provider
 * 3️⃣ Use useContext to read data
 */

/********************************************
 * 🟢 Context API Example
 ********************************************/

import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Home() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <>
      <Text>{theme}</Text>
      <Button title="Change Theme" onPress={() => setTheme("dark")} />
    </>
  );
}

/********************************************
 * 🟢 Problems with Context API (Important)
 ********************************************/
/**
 * ❌ Re-renders ALL consumers when value changes
 * ❌ Hard to manage complex logic
 * ❌ No built-in debugging tools
 * ❌ Not ideal for frequent updates
 */

/********************************************
 * 🟢 Redux – How it Works
 ********************************************/
/**
 * 1️⃣ Store → Holds app state
 * 2️⃣ Action → What happened
 * 3️⃣ Reducer → How state changes
 * 4️⃣ Dispatch → Sends action
 */

/********************************************
 * 🟢 Redux Example (Redux Toolkit)
 ********************************************/

import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

const store = configureStore({
  reducer: authSlice.reducer,
});

/********************************************
 * 🟢 Redux Advantages
 ********************************************/
/**
 * ✅ Centralized state
 * ✅ Predictable updates
 * ✅ Handles complex logic
 * ✅ Middleware support (thunk, saga)
 * ✅ Excellent debugging (Redux DevTools)
 */

/********************************************
 * 🟢 Redux Disadvantages
 ********************************************/
/**
 * ❌ Extra setup
 * ❌ Learning curve
 * ❌ Overkill for small apps
 */

/********************************************
 * 🟢 Context API Advantages
 ********************************************/
/**
 * ✅ Built-in (no extra library)
 * ✅ Simple to use
 * ✅ Good for small shared state
 */

/********************************************
 * 🟢 Context API Disadvantages
 ********************************************/
/**
 * ❌ Performance issues for large apps
 * ❌ No time-travel debugging
 * ❌ Not scalable
 */

/********************************************
 * 🟢 Side-by-Side Comparison
 ********************************************/

const comparison = `
Context API vs Redux

Context API:
- Built-in React
- Best for small apps
- Simple data sharing
- Limited debugging
- Performance issues at scale

Redux:
- External library
- Best for large apps
- Complex state handling
- Excellent debugging
- Scales very well
`;

/********************************************
 * 🟢 When to Use What?
 ********************************************/
/**
 * ✅ Use Context API when:
 * - App is small
 * - State changes are rare
 * - Data is simple (theme, language)
 *
 * ✅ Use Redux when:
 * - App is large
 * - Many screens share data
 * - Frequent state updates
 * - Complex business logic
 */

/********************************************
 * 🟢 Interview Answer (Short & Strong)
 ********************************************/
/**
 * "Context API is suitable for small, simple global state,
 * while Redux is better for large applications with
 * complex state logic and debugging needs."
 */

/********************************************
 * 🟢 Real Project Usage (Recommended)
 ********************************************/
/**
 * ✔ Context API → Theme, Localization
 * ✔ Redux      → Auth, API data, Cart, Orders
 */

/********************************************
 * 🟢 Final Summary
 ********************************************/
/**
 * Context API = Simple & light
 * Redux       = Powerful & scalable
 */
