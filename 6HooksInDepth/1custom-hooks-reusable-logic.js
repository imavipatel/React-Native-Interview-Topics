/**
 * ==============================================================
 * 📘 Custom Hooks – Creating Reusable Logic
 * ==============================================================
 *
 * 🟢 THEORY (Why Custom Hooks?)
 * --------------------------------------------------------------
 * - In React (and React Native), hooks like `useState`, `useEffect`,
 *   `useReducer` let us add logic to functional components.
 * - Sometimes we need to **reuse logic** across multiple components
 *   (e.g., form handling, API fetching, timers).
 * - Instead of duplicating code → we create a **Custom Hook**.
 *
 * ✅ Custom Hooks are just normal JavaScript functions
 *    - They start with `"use"` (by convention).
 *    - They can call other hooks inside.
 *    - They return data, state, or functions to the component.
 *
 * 🔑 Benefits:
 * - Makes code **clean & DRY** (Don’t Repeat Yourself).
 * - Easier to test and maintain.
 * - Keeps UI code separate from business logic.
 *
 * ==============================================================
 * 🔹 Example 1 – useFetch Hook
 * --------------------------------------------------------------
 * Reusable hook for fetching data from an API.
 */
import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false; // cleanup
    };
  }, [url]);

  return { data, loading, error };
}

/**
 * ✅ Usage in a React Native component:
 */
function PostList() {
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/posts"
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
}

/**
 * ==============================================================
 * 🔹 Example 2 – useToggle Hook
 * --------------------------------------------------------------
 * Reusable hook for toggling boolean values.
 */
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  function toggle() {
    setValue((prev) => !prev);
  }

  return [value, toggle];
}

// ✅ Usage
function DarkModeSwitch() {
  const [isDarkMode, toggleDarkMode] = useToggle(false);

  return (
    <View>
      <Text>Dark Mode: {isDarkMode ? "On" : "Off"}</Text>
      <Button title="Toggle" onPress={toggleDarkMode} />
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 Example 3 – useTimer Hook
 * --------------------------------------------------------------
 * Reusable hook for timers (useful for countdown, stopwatches).
 */
function useTimer(initialTime = 60) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time === 0) return;
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [time]);

  return time;
}

// ✅ Usage
function Countdown() {
  const timeLeft = useTimer(10);

  return <Text>Time left: {timeLeft}</Text>;
}

/**
 * ==============================================================
 * 🔹 Best Practices for Custom Hooks
 * --------------------------------------------------------------
 * ✅ Always start the name with "use" → (e.g., useFetch, useToggle).
 * ✅ Keep them **pure** → avoid modifying global state directly.
 * ✅ Return only what’s needed (state, updater, helper functions).
 * ✅ Use cleanup functions to prevent memory leaks.
 * ✅ Reuse hooks across multiple components for DRY code.
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: What is a custom hook?
 *   → A function that encapsulates reusable logic using React hooks.
 *
 * Q2: Why should we use custom hooks?
 *   → To avoid repeating logic, keep components clean, and make logic reusable.
 *
 * Q3: Can custom hooks return JSX?
 *   → No. They return state/data/functions, not UI.
 *
 * Q4: Do custom hooks share state between components?
 *   → No. Each component gets its own isolated state when calling the hook.
 *
 * Q5: How do you clean up inside a custom hook?
 *   → Return a cleanup function inside `useEffect` (e.g., clearing timers).
 *
 * ==============================================================
 */
