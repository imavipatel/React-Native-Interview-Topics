/**
 * ==============================================================
 * 📘 React Notes – Avoiding Memory Leaks (Stale Closures, Timers)
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is a Memory Leak?
 * - When memory is not released even though it's no longer needed.
 * - In React, leaks usually happen due to:
 *    ✅ Stale closures (functions capturing old state/props)
 *    ✅ Unstopped timers/intervals
 *    ✅ Event listeners not cleaned up
 *    ✅ Async operations still running after component unmount
 *
 * --------------------------------------------------------------
 * 🔹 Stale Closures
 * - A closure = function + variables it remembers.
 * - If closure "captures" old state/props, it may use outdated values.
 * - Example: useEffect callback that doesn’t update correctly.
 *
 * 🔹 Running Timers
 * - setInterval / setTimeout keep running even if the component unmounts.
 * - If not cleared, they continue updating unmounted components → warning + leak.
 *
 * ==============================================================
 * 🔹 Examples
 * --------------------------------------------------------------
 */

//
// ❌ Example 1: Stale Closure Problem
//
import React, { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // ❌ Captures old count value (stale closure)
      console.log("Count:", count);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // dependency is missing 'count'

  return (
    <View>
      <Text>{count}</Text>
      <Button title="Increment" onPress={() => setCount((c) => c + 1)} />
    </View>
  );
}

//
// ✅ Fix: Use Functional Update or Add Dependency
//
useEffect(() => {
  const interval = setInterval(() => {
    setCount((c) => c + 1); // ✅ always gets latest state
  }, 1000);

  return () => clearInterval(interval);
}, []); // works correctly

//
// ❌ Example 2: Running Timer Leak
//
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Running...");
  }, 1000);

  // ❌ Forgot cleanup → keeps running after unmount
}, []);

//
// ✅ Fix: Cleanup Timers
//
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Running...");
  }, 1000);

  return () => clearInterval(timer); // ✅ cleanup on unmount
}, []);

//
// ✅ Example 3: Aborting Async Calls (fetch)
//
import React, { useEffect, useState } from "react";

function UserData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://jsonplaceholder.typicode.com/users", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort(); // ✅ cancel on unmount
  }, []);

  return <Text>{data ? "Loaded" : "Loading..."}</Text>;
}

//
// ✅ Example 4: Event Listener Cleanup
//
useEffect(() => {
  const handler = () => console.log("resize");

  window.addEventListener("resize", handler);

  return () => window.removeEventListener("resize", handler); // ✅ cleanup
}, []);

/**
 * ==============================================================
 * 🔍 Best Practices to Avoid Memory Leaks
 * --------------------------------------------------------------
 * 1️⃣ Always return a cleanup function in useEffect (for timers, listeners).
 * 2️⃣ Use functional updates (setState(prev => ...)) to avoid stale closures.
 * 3️⃣ Cancel async calls (AbortController / axios cancel tokens).
 * 4️⃣ Use libraries like react-query for safe async handling.
 * 5️⃣ Keep dependency arrays accurate in useEffect.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * --------------------------------------------------------------
 * Q1: What is a stale closure in React?
 *    → A closure that uses old state/props because dependencies
 *      weren’t updated in useEffect/useCallback.
 *
 * Q2: How can timers cause memory leaks?
 *    → If not cleared, setInterval/setTimeout run even after
 *      component unmount → updating a non-existing component.
 *
 * Q3: How do you prevent async memory leaks?
 *    → Cancel async calls with AbortController or cleanup logic.
 *
 * Q4: Which React hook helps avoid stale closures?
 *    → Using functional updates inside setState or using refs.
 *
 * Q5: How to check if you forgot cleanup?
 *    → React warns: "Can’t perform a React state update on an unmounted component."
 *
 * ==============================================================
 */
