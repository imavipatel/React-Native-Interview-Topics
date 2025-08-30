/**
 * ==============================================================
 * 📘 Memory Leaks & Stale Hook Values in React/React Native
 * ==============================================================
 *
 * 🟢 What is a Memory Leak?
 * --------------------------------------------------------------
 * - A memory leak happens when your app keeps references in memory
 *   even though they are no longer needed.
 * - In React/React Native, leaks often happen when:
 *    1. Timers (setInterval, setTimeout) are not cleared.
 *    2. Event listeners (keyboard, dimensions, network) are not removed.
 *    3. Async calls (fetch, promises) try to update unmounted components.
 * - Result → Increased memory usage, app slows down, may crash.
 *
 * 🟢 What are Stale Hook Values?
 * --------------------------------------------------------------
 * - "Stale values" happen when a function inside a hook captures
 *   an **old snapshot of state or props**.
 * - Because of JavaScript closures, the function may keep using
 *   outdated values even though the state has updated.
 * - Common with `useEffect`, `setInterval`, async callbacks.
 *
 * ==============================================================
 * 🔹 Common Causes of Memory Leaks
 * ==============================================================
 * 1. Timers not cleared
 * 2. Subscriptions/listeners not removed
 * 3. Async calls trying to set state after unmount
 * 4. Retaining large objects in closures
 *
 * ==============================================================
 * 🔹 Examples
 * ==============================================================
 *
 * ❌ Example of Memory Leak with setInterval:
 */
import React, { useState, useEffect } from "react";

export default function LeakExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);

    // ❌ Missing cleanup → interval keeps running even if component unmounts
  }, []);

  return <p>{count}</p>;
}

/**
 * ✅ Fixed with Cleanup:
 */
useEffect(() => {
  const id = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);

  return () => clearInterval(id); // ✅ Cleanup on unmount
}, []);

/**
 * --------------------------------------------------------------
 * ❌ Example of Stale Hook Value:
 */
import React, { useState, useEffect } from "react";

export default function StaleValueExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("Count:", count); // ❌ Always logs old value of count
      setCount(count + 1); // Uses stale closure of count
    }, 1000);

    return () => clearInterval(id);
  }, []); // empty deps → closure keeps old `count`

  return <p>{count}</p>;
}

/**
 * ✅ Fixed using Functional Update (always gets latest state):
 */
useEffect(() => {
  const id = setInterval(() => {
    setCount((prev) => prev + 1); // ✅ No stale closure
  }, 1000);

  return () => clearInterval(id);
}, []);

/**
 * ✅ Or include `count` in dependency array:
 */
useEffect(() => {
  const id = setInterval(() => {
    console.log("Count:", count); // ✅ Now uses fresh value
    setCount(count + 1);
  }, 1000);

  return () => clearInterval(id);
}, [count]);

/**
 * ==============================================================
 * 🔹 Avoiding Memory Leaks – Best Practices
 * ==============================================================
 * 1. Always clean up timers (`clearTimeout`, `clearInterval`).
 * 2. Remove event listeners on unmount.
 * 3. Cancel network requests if component unmounts.
 * 4. Use cleanup return function inside `useEffect`.
 * 5. Use functional updates to avoid stale values.
 *
 * Example: Cleaning listeners in React Native
 */
import { useEffect } from "react";
import { Keyboard } from "react-native";

export default function KeyboardExample() {
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => console.log("Shown"));
    const hide = Keyboard.addListener("keyboardDidHide", () => console.log("Hidden"));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return null;
}

/**
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * ==============================================================
 * Q1: How do stale closures happen in hooks?
 *   → When a callback inside a hook uses variables from an older render,
 *     due to how closures capture values.
 *
 * Q2: How to fix stale hook values in intervals?
 *   → Use functional state updates OR add the variable to dependency array.
 *
 * Q3: Why are cleanups important in useEffect?
 *   → They prevent memory leaks by removing side-effects when the component unmounts.
 *
 * Q4: How do you cancel an async API request in React Native?
 *   → Use `AbortController` or track mounted state to ignore updates after unmount.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - Memory leaks happen when resources are not released after component unmount.
 * - Stale hook values happen due to closures capturing old state/props.
 * - Always cleanup side effects in `useEffect` and prefer functional updates.
 * - In React Native, clean up event listeners, timers, and async calls to avoid leaks.
 * ==============================================================
 */
