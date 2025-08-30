/**
 * ==============================================================
 * 📘 Axios vs Fetch in React Native (Networking Layer)
 * ==============================================================
 *
 * 🟢 Introduction
 * --------------------------------------------------------------
 * In React Native, we make API calls using **fetch** (built-in)
 * or **Axios** (popular 3rd-party library).
 *
 * Both do the same job: send HTTP requests & handle responses.
 * But they differ in features, syntax, and convenience.
 *
 * ==============================================================
 * 🔹 Fetch API (Native JS API)
 * --------------------------------------------------------------
 * - Built-in function (no extra library needed).
 * - Returns a Promise.
 * - Requires manual parsing of JSON.
 * - Minimal features → you handle errors, timeouts manually.
 *
 * ✅ Pros:
 *   - No installation (works out-of-the-box).
 *   - Lightweight & modern (based on Promises).
 *
 * ❌ Cons:
 *   - No request/response interceptors.
 *   - No automatic timeout handling.
 *   - Must manually handle JSON, errors, and retries.
 *
 * --------------------------------------------------------------
 * Example: Fetch in React Native
 */
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function FetchExample() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then(res => res.json()) // must parse manually
      .then(data => setUser(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return <View>{user ? <Text>{user.name}</Text> : <Text>Loading...</Text>}</View>;
}

/**
 * ==============================================================
 * 🔹 Axios (3rd Party Library)
 * --------------------------------------------------------------
 * - Must install: `npm install axios`.
 * - Based on Promises, like fetch.
 * - Built-in JSON parsing → no need for `.json()`.
 * - Has interceptors for logging, auth tokens, retries, etc.
 * - Better error handling (network vs HTTP errors).
 *
 * ✅ Pros:
 *   - Simpler syntax (auto parses JSON).
 *   - Supports interceptors (auth headers, logging).
 *   - Timeout support.
 *   - Wide community support.
 *
 * ❌ Cons:
 *   - Extra dependency (increases bundle size).
 *   - Slightly larger overhead compared to fetch.
 *
 * --------------------------------------------------------------
 * Example: Axios in React Native
 */
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import axios from "axios";

export default function AxiosExample() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users/1")
      .then(response => setUser(response.data)) // JSON auto-parsed
      .catch(err => console.error("Axios error:", err));
  }, []);

  return <View>{user ? <Text>{user.name}</Text> : <Text>Loading...</Text>}</View>;
}

/**
 * ==============================================================
 * 🔹 Advanced: Interceptors in Axios
 * --------------------------------------------------------------
 * - Useful for attaching auth tokens or logging all requests.
 */
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = "Bearer TOKEN123"; // add token
    console.log("📤 Request:", config.url);
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => {
    console.log("📥 Response:", response.status);
    return response;
  },
  error => Promise.reject(error)
);

/**
 * ==============================================================
 * 🔹 Fetch with AbortController (Timeout Example)
 * --------------------------------------------------------------
 * - Fetch does NOT have built-in timeout.
 * - We use AbortController to cancel requests manually.
 */
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function FetchWithTimeout() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // cancel after 3s

    fetch("https://jsonplaceholder.typicode.com/users/1", {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => {
        if (err.name === "AbortError") {
          console.error("⏳ Request timed out");
        } else {
          console.error("Fetch error:", err);
        }
      })
      .finally(() => clearTimeout(timeoutId));

    return () => controller.abort(); // cleanup on unmount
  }, []);

  return <View>{data ? <Text>{data.name}</Text> : <Text>Loading...</Text>}</View>;
}

/**
 * ==============================================================
 * 🔹 Comparison Table – Axios vs Fetch
 * --------------------------------------------------------------
 *
 * | Feature               | Fetch                        | Axios                          |
 * |-----------------------|------------------------------|--------------------------------|
 * | Built-in              | ✅ Yes                       | ❌ No (install required)       |
 * | JSON parsing          | ❌ Manual (`res.json()`)      | ✅ Automatic                   |
 * | Timeout support       | ❌ No (manual AbortController)| ✅ Built-in                    |
 * | Interceptors          | ❌ No                        | ✅ Yes (auth, logging, retry)  |
 * | Error handling        | ❌ Must check `res.ok`        | ✅ Automatic distinction       |
 * | Upload/Download prog. | ❌ Hard to implement          | ✅ Easy via `onUploadProgress` |
 * | Bundle size           | ✅ Small                     | ❌ Slightly bigger             |
 *
 * ==============================================================
 * 🔹 Best Practices
 * --------------------------------------------------------------
 * - Use **fetch** for simple GET/POST requests where you don’t need
 *   interceptors or advanced features.
 * - Use **Axios** for apps needing:
 *    - Authentication headers.
 *    - Global error handling.
 *    - Request retries.
 *    - File uploads with progress.
 *
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Which is better for React Native?
 *   → Depends. Use fetch for simple apps; Axios for larger apps
 *     with authentication, logging, or retries.
 *
 * Q2: How to add timeout in fetch?
 *   → Use AbortController to cancel requests manually.
 *
 * Q3: Why use Axios interceptors?
 *   → To attach tokens, handle 401 errors globally, log requests.
 *
 * Q4: Can fetch handle uploads?
 *   → Yes, but progress tracking is harder compared to Axios.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - Fetch = simple, built-in, minimal.
 * - Axios = powerful, feature-rich, recommended for production apps.
 * - Choose based on project needs: small (fetch), large-scale (Axios).
 * ==============================================================
 */
