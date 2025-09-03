/**
 * ==============================================================
 * 📘 useEffect with async/await in React / React Native
 * ==============================================================
 *
 * 🟢 Why Do We Need Async in useEffect?
 * --------------------------------------------------------------
 * - useEffect is used for side effects like API calls, subscriptions, timers.
 * - Most side effects involve asynchronous operations (e.g., fetching data).
 * - BUT, useEffect callback function itself **cannot be async** because:
 *      - React expects the return value of useEffect to be either `undefined`
 *        or a cleanup function.
 *      - An `async` function always returns a Promise, not a cleanup function.
 * - Therefore, we need to handle async/await inside useEffect correctly.
 *
 * ==============================================================
 * 🔹 Wrong Way (❌ Don't do this)
 * ==============================================================
 */
useEffect(async () => {
  // ❌ Invalid - useEffect should not return a Promise
  const data = await fetchData();
  console.log(data);
}, []);

/**
 * ==============================================================
 * 🔹 Correct Ways (✅ Best Practices)
 * ==============================================================
 *
 * 1️⃣ Define an async function inside useEffect and call it
 */
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const json = await response.json();
      console.log("Data:", json);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  fetchData();
}, []);

/**
 * Explanation:
 * - We define an async function `fetchData` INSIDE useEffect.
 * - Then, we call it normally.
 * - This way, the main useEffect function is still synchronous.
 *
 * ==============================================================
 * 2️⃣ Define async function outside useEffect and call inside
 * ==============================================================
 */
const fetchPost = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/2");
  return response.json();
};

useEffect(() => {
  fetchPost().then((data) => console.log("Post:", data));
}, []);

/**
 * Explanation:
 * - Async function can also be defined outside.
 * - But you still call it normally inside useEffect.
 *
 * ==============================================================
 * 3️⃣ Using IIFE (Immediately Invoked Function Expression)
 * ==============================================================
 */
useEffect(() => {
  (async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/3"
      );
      const json = await response.json();
      console.log("IIFE Data:", json);
    } catch (e) {
      console.error("IIFE Error:", e);
    }
  })();
}, []);

/**
 * Explanation:
 * - We define an async arrow function and invoke it immediately.
 * - Keeps code compact and clean.
 *
 * ==============================================================
 * 🔹 Handling Cleanup in Async Effects
 * ==============================================================
 * - Sometimes async requests may resolve after the component unmounts.
 * - This can cause "memory leaks" or "setting state on unmounted component".
 * - To avoid this, use a flag to track if the component is still mounted.
 */
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function AsyncCleanupExample() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/4"
      );
      const json = await response.json();
      if (isMounted) setData(json);
    };

    fetchData();

    // Cleanup: runs when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View>
      <Text>{data ? data.title : "Loading..."}</Text>
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 Common Mistakes
 * ==============================================================
 * ❌ Making useEffect async directly
 * ❌ Forgetting to handle cleanup
 * ❌ Not handling errors in async calls
 *
 * ==============================================================
 * 🔹 Best Practices
 * ==============================================================
 * ✅ Always keep the main useEffect callback synchronous.
 * ✅ Use async functions inside (declared or IIFE).
 * ✅ Handle errors with try/catch.
 * ✅ Use cleanup functions to prevent memory leaks.
 * ✅ For multiple API calls, consider `Promise.all`.
 *
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * ==============================================================
 * Q1: Why can't useEffect be async?
 *   → Because React expects useEffect to return either nothing or a cleanup function,
 *     but async functions always return a Promise.
 *
 * Q2: How to use async/await inside useEffect?
 *   → Define an async function inside useEffect (or use IIFE) and call it.
 *
 * Q3: How do you prevent memory leaks in async useEffect?
 *   → Track a mounted flag or use an AbortController to cancel requests.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - Never make useEffect async directly.
 * - Wrap async code inside an inner function or IIFE.
 * - Always handle cleanup to avoid memory leaks.
 * ==============================================================
 */
