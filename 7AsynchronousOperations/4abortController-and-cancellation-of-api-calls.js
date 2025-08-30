/**
 * ==============================================================
 * 📘 AbortController & API Call Cancellation
 * ==============================================================
 *
 * 🟢 Why Do We Need to Cancel API Calls?
 * --------------------------------------------------------------
 * - In React/React Native, components mount & unmount frequently.
 * - If an API request is still running when a component unmounts:
 *     ❌ You may try to update state on an unmounted component.
 *     ❌ This can cause memory leaks & warnings.
 * - Example: User navigates away while an API call is still loading.
 * - Solution: Use **AbortController** to cancel API requests safely.
 *
 * ==============================================================
 * 🔹 AbortController Basics
 * ==============================================================
 * - A built-in browser API (also works in React Native with fetch).
 * - Provides a way to **abort a fetch request** if it's no longer needed.
 * - Key parts:
 *    ✅ `AbortController` → Creates a controller.
 *    ✅ `controller.signal` → A signal passed to fetch().
 *    ✅ `controller.abort()` → Cancels the request.
 *
 * ==============================================================
 * 🔹 Example: Fetch with AbortController
 * ==============================================================
 */
import React, { useEffect, useState } from "react";
import { Text } from "react-native";

export default function UserData() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users/1",
          { signal: controller.signal }
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("❌ Fetch aborted!");
        } else {
          console.log("⚠️ Fetch error:", error);
        }
      }
    };

    fetchUser();

    // Cleanup on unmount → cancel request
    return () => {
      controller.abort();
    };
  }, []);

  if (!user) return <Text>Loading...</Text>;
  return <Text>User: {user.name}</Text>;
}

/**
 * ==============================================================
 * 🔹 Axios with Cancellation
 * ==============================================================
 * - Axios has built-in cancellation using `CancelToken` (deprecated).
 * - New versions recommend using `AbortController` as well.
 */
import axios from "axios";

async function fetchPosts() {
  const controller = new AbortController();
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts",
      {
        signal: controller.signal, // just like fetch
      }
    );
    console.log(response.data);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("❌ Axios request canceled");
    } else {
      console.log("⚠️ Axios error:", error);
    }
  }
  // Cancel manually if needed
  controller.abort();
}

/**
 * ==============================================================
 * 🔹 Real-World Example: Search with Autocomplete
 * ==============================================================
 * - Imagine a search bar where the user types quickly.
 * - Each keystroke fires an API call → previous calls should be canceled.
 * - Otherwise, you may get **out-of-order results**.
 */
import React, { useState, useEffect } from "react";
import { TextInput, FlatList, Text } from "react-native";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchSearch = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?name_like=${query}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("🔎 Previous search canceled");
        } else {
          console.error(error);
        }
      }
    };

    fetchSearch();

    return () => {
      controller.abort(); // cancel old request if query changes
    };
  }, [query]);

  return (
    <>
      <TextInput
        placeholder="Search users..."
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, padding: 8, margin: 10 }}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </>
  );
}

/**
 * ==============================================================
 * 🔹 When Should You Cancel Requests?
 * ==============================================================
 * ✅ When component unmounts → prevent setting state after unmount.
 * ✅ When user navigates away from a screen.
 * ✅ When a new search/query starts → cancel old request (autocomplete).
 * ✅ When network is too slow → cancel & retry later.
 *
 * ==============================================================
 * 🔹 Common Pitfalls
 * ==============================================================
 * ❌ Forgetting to cancel fetch → memory leaks, console warnings.
 * ❌ Cancelling after fetch has already finished (no effect).
 * ❌ Not checking for `AbortError` in catch block.
 *
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * ==============================================================
 * Q1: What happens if you don’t cancel an API call when a component unmounts?
 *   → It may try to update state on an unmounted component → memory leak.
 *
 * Q2: What is AbortController?
 *   → A built-in API that lets you cancel fetch requests using a signal.
 *
 * Q3: How to handle multiple requests at once?
 *   → Use multiple AbortControllers, one for each request.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - Always cancel network requests when component unmounts.
 * - Use `AbortController` with fetch and Axios (new versions).
 * - Helps prevent memory leaks, unnecessary network usage,
 *   and improves app performance.
 * ==============================================================
 */
