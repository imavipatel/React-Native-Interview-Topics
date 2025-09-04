/**
 * ==============================================================
 * 📘 React – useEffect (Dependency Array & Cleanup)
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is useEffect?
 * - A **React Hook** that lets you perform **side effects** in functional components.
 * - Side effects = actions that happen outside React’s rendering cycle:
 *    ✅ Fetching data
 *    ✅ Subscribing/unsubscribing to events
 *    ✅ Setting up timers/intervals
 *    ✅ Direct DOM manipulations
 *
 * - Equivalent to lifecycle methods in Class Components:
 *    * componentDidMount
 *    * componentDidUpdate
 *    * componentWillUnmount
 *
 * --------------------------------------------------------------
 * 🔹 Why use useEffect?
 * - Keeps side effects separate from rendering logic.
 * - Avoids repetition across lifecycle methods.
 * - Easy to clean up resources when component unmounts.
 *
 * ==============================================================
 * 🔹 Dependency Array in useEffect
 * --------------------------------------------------------------
 * Syntax:
 *    useEffect(callback, [dependencies]);
 *
 * - Dependencies control **when** the effect runs:
 *
 * 1️⃣ No dependency array → Runs on every render
 *    useEffect(() => { ... });
 *
 * 2️⃣ Empty array [] → Runs only once (like componentDidMount)
 *    useEffect(() => { ... }, []);
 *
 * 3️⃣ With dependencies [a, b] → Runs when `a` or `b` change
 *    useEffect(() => { ... }, [a, b]);
 *
 * ==============================================================
 * 🔹 Cleanup Function in useEffect
 * --------------------------------------------------------------
 * - If the effect creates a subscription, timer, or event listener,
 *   we need to **clean it up** when component unmounts or before
 *   re-running the effect.
 *
 * - Cleanup is done by returning a function from useEffect:
 *
 *    useEffect(() => {
 *       const timer = setInterval(() => console.log("Tick"), 1000);
 *
 *       return () => {
 *          clearInterval(timer); // Cleanup
 *       };
 *    }, []);
 *
 * - This prevents **memory leaks** and unwanted background tasks.
 *
 * ==============================================================
 * 🔹 Examples
 * --------------------------------------------------------------
 */

// Example 1: Run once (on mount) – API call
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Fetching user data...");
    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []); // Empty array → runs only once

  return (
    <View>
      <Text>{user ? user.name : "Loading..."}</Text>
    </View>
  );
}

// --------------------------------------------------------------

// Example 2: Run when dependency changes
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`Count changed: ${count}`);
  }, [count]); // Runs whenever `count` updates

  return (
    <View>
      <Text>{count}</Text>
      <Text onPress={() => setCount(count + 1)}>Increment</Text>
    </View>
  );
}

// --------------------------------------------------------------

// Example 3: Cleanup (remove event listener on unmount)
function WindowResizeLogger() {
  useEffect(() => {
    const handleResize = () => console.log("Window resized!");
    window.addEventListener("resize", handleResize);

    return () => {
      console.log("Cleanup: removing resize listener");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <Text>Resize window to see logs</Text>;
}

/**
 * ==============================================================
 * 📊 Mapping Class Lifecycle → useEffect
 * ==============================================================
 *
 * - componentDidMount   → useEffect(..., [])
 * - componentDidUpdate  → useEffect(..., [dependencies])
 * - componentWillUnmount → return cleanup function in useEffect
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What happens if you don’t provide a dependency array?
 *    → The effect runs **after every render** (may cause performance issues).
 *
 * Q2: Why do we need cleanup inside useEffect?
 *    → To prevent memory leaks (e.g., remove event listeners, clear timers).
 *
 * Q3: Can you run multiple useEffects in one component?
 *    → Yes, you can have multiple useEffects for different concerns.
 *
 * Q4: What’s the difference between [] and no array?
 *    → [] runs once on mount. No array runs after **every render**.
 *
 * Q5: Where should you put API calls in functional components?
 *    → Inside useEffect with `[]` as dependency array.
 *
 * ==============================================================
 */
