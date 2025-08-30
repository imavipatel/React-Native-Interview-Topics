/**
 * ==============================================================
 * 📘 Fetch vs Axios for API Calls in React / React Native
 * ==============================================================
 *
 * 🟢 Why Do We Need API Calls?
 * --------------------------------------------------------------
 * - Most apps need to communicate with a backend server.
 * - API calls help fetch data (GET), send data (POST), update (PUT/PATCH),
 *   or delete data (DELETE).
 * - In React/React Native, the two most common ways to make API requests are:
 *    1. fetch (native JavaScript API)
 *    2. axios (third-party library)
 *
 * ==============================================================
 * 🔹 Fetch API
 * ==============================================================
 * - Built into JavaScript → no installation required.
 * - Returns a Promise.
 * - Requires manual handling of JSON conversion and errors.
 *
 * Example (React Native / React):
 */
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function FetchExample() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => setData(json))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <View>
      <Text>{data ? data.title : "Loading..."}</Text>
    </View>
  );
}

/**
 * ✅ Pros of fetch:
 *   - No extra library required
 *   - Simple for basic requests
 *
 * ❌ Cons of fetch:
 *   - No request/response interceptors
 *   - Need manual JSON parsing (`.json()`)
 *   - Harder to cancel requests
 *   - Verbose error handling
 *
 * ==============================================================
 * 🔹 Axios
 * ==============================================================
 * - Popular third-party library for API calls.
 * - Provides many features out of the box:
 *    ✅ Automatic JSON parsing
 *    ✅ Request & response interceptors
 *    ✅ Timeout & cancellation support
 *    ✅ Cleaner syntax
 *
 * Example (React Native / React):
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function AxiosExample() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Axios error:", error));
  }, []);

  return (
    <View>
      <Text>{data ? data.title : "Loading..."}</Text>
    </View>
  );
}

/**
 * ✅ Pros of axios:
 *   - Cleaner and shorter syntax
 *   - Automatic JSON transformation
 *   - Interceptors (modify requests/responses globally)
 *   - Supports request cancellation
 *   - Default timeout handling
 *
 * ❌ Cons of axios:
 *   - Requires installation (`npm install axios`)
 *   - Slightly larger bundle size than fetch
 *
 * ==============================================================
 * 🔹 Advanced Features
 * ==============================================================
 *
 * 1️⃣ Handling POST requests
 */
axios
  .post("https://jsonplaceholder.typicode.com/posts", {
    title: "foo",
    body: "bar",
    userId: 1,
  })
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));

/**
 * 2️⃣ Adding Interceptors (e.g. adding auth token)
 */
axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = "Bearer YOUR_TOKEN";
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 3️⃣ Cancelling Requests
 */
const controller = new AbortController();

axios
  .get("https://jsonplaceholder.typicode.com/posts", {
    signal: controller.signal,
  })
  .catch((e) => console.log("Request cancelled:", e.message));

controller.abort(); // cancels the request

/**
 * ==============================================================
 * 🔹 Comparison: Fetch vs Axios
 * ==============================================================
 *
 * | Feature              | Fetch                           | Axios                       |
 * |----------------------|---------------------------------|-----------------------------|
 * | Availability         | Built-in (no install)          | Third-party library         |
 * | Syntax               | Verbose                        | Clean & simple              |
 * | JSON Handling        | Manual (response.json())        | Auto                        |
 * | Interceptors         | ❌ No                          | ✅ Yes                      |
 * | Timeout Support      | ❌ No (needs AbortController)   | ✅ Built-in                 |
 * | Request Cancelation  | With AbortController (manual)   | Easy with axios cancel token|
 * | Bundle Size          | Lightweight (native)            | Slightly bigger             |
 *
 * ==============================================================
 * 🔹 Best Practices
 * ==============================================================
 * ✅ Use axios when:
 *    - Your app makes many API calls
 *    - You need interceptors (auth, logging, error handling)
 *    - You want simpler syntax & built-in features
 *
 * ✅ Use fetch when:
 *    - You want zero dependencies
 *    - You only need simple API requests
 *    - You’re okay handling JSON & errors manually
 *
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * ==============================================================
 * Q1: Which is better, fetch or axios?
 *   → axios is feature-rich and developer-friendly, but fetch is built-in and lightweight.
 *
 * Q2: How do you cancel an API request in React Native?
 *   → With AbortController (for fetch) or cancel tokens/AbortController in axios.
 *
 * Q3: Why use interceptors in axios?
 *   → To modify requests globally (like adding tokens) or handle responses centrally.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - fetch = simple, no dependency, manual handling
 * - axios = powerful, easier syntax, extra features
 * - Choose based on project size & needs
 * ==============================================================
 */
