/**
 * ===================================================================
 * 📘 Handling Race Conditions & Deduplication in React/React Native
 * ===================================================================
 *
 * 🟢 Introduction
 * -------------------------------------------------------------------
 * - **Race condition** happens when multiple async operations run
 *   at the same time, and their results arrive in an unexpected order.
 * - **Deduplication** means preventing duplicate or redundant requests.
 *
 * These are common problems in apps with API calls, forms, or
 * background sync.
 *
 * ===================================================================
 * 🔹 Race Conditions
 * -------------------------------------------------------------------
 * Example:
 *   - User types quickly in a search bar.
 *   - Each keystroke triggers an API call.
 *   - Results from an older request might arrive later than newer ones,
 *     overriding fresh results with stale data.
 *
 * ✅ Goal: Ensure only the **latest request** updates the UI.
 *
 * -------------------------------------------------------------------
 * 🔹 Example of Race Condition
 */
async function searchUsers(query) {
  const response = await fetch(`https://api.example.com/users?q=${query}`);
  const data = await response.json();
  return data;
}

// Issue: If "React" request comes back AFTER "Rea", UI may show stale data.

/**
 * -------------------------------------------------------------------
 * 🔹 Fix with Request Cancellation (AbortController)
 */
let currentController = null;

async function safeSearchUsers(query) {
  if (currentController) currentController.abort(); // cancel previous
  currentController = new AbortController();

  try {
    const response = await fetch(`https://api.example.com/users?q=${query}`, {
      signal: currentController.signal,
    });
    const data = await response.json();
    console.log("✅ Latest Result:", data);
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("⏹️ Request cancelled:", query);
    } else {
      console.error("❌ Error:", err);
    }
  }
}

/**
 * -------------------------------------------------------------------
 * 🔹 Deduplication
 * -------------------------------------------------------------------
 * Problem:
 *   - Multiple components may trigger the **same API call**.
 *   - This wastes bandwidth and causes unnecessary re-renders.
 *
 * ✅ Goal: Avoid duplicate API calls, reuse existing promises.
 *
 * -------------------------------------------------------------------
 * 🔹 Example of Deduplication with Cache
 */
const requestCache = {};

function deduplicatedFetch(url) {
  if (requestCache[url]) {
    console.log("♻️ Returning cached promise for:", url);
    return requestCache[url];
  }

  const promise = fetch(url)
    .then((res) => res.json())
    .finally(() => {
      delete requestCache[url]; // clean up after completion
    });

  requestCache[url] = promise;
  return promise;
}

// Usage
deduplicatedFetch("https://api.example.com/data").then(console.log);
deduplicatedFetch("https://api.example.com/data").then(console.log);
// ✅ Only one network request made, second uses cached promise.

/**
 * -------------------------------------------------------------------
 * 🔹 Libraries that Handle Race Conditions & Deduplication
 * -------------------------------------------------------------------
 * 1. **React Query**
 *    - Automatic request deduplication (same key = single request).
 *    - Cancels outdated queries with `enabled` or `staleTime`.
 *
 * 2. **SWR (Stale-While-Revalidate)**
 *    - Built-in deduplication (identical keys share request).
 *    - Prevents race conditions with revalidation.
 *
 * 3. **Axios + axios-cancel-token / AbortController**
 *    - Allows cancelling previous API calls.
 *
 * 4. **Redux-Saga**
 *    - Effects like `takeLatest` automatically cancel stale requests.
 *
 * -------------------------------------------------------------------
 * 🔹 Example with Redux-Saga (Race Condition Fix)
 */
// takeLatest ensures only the latest API call is executed.
import { takeLatest, call, put } from "redux-saga/effects";

function* fetchDataSaga(action) {
  try {
    const response = yield call(fetch, `/api?q=${action.query}`);
    const data = yield response.json();
    yield put({ type: "FETCH_SUCCESS", payload: data });
  } catch (err) {
    yield put({ type: "FETCH_ERROR", error: err });
  }
}

function* watchSearch() {
  yield takeLatest("FETCH_REQUEST", fetchDataSaga);
}

/**
 * ===================================================================
 * 🔹 Best Practices
 * -------------------------------------------------------------------
 * 1. Use **AbortController** in fetch/axios to cancel old requests.
 * 2. Use **takeLatest in Redux-Saga** to auto-cancel older API calls.
 * 3. Deduplicate API calls by caching promises.
 * 4. Use libraries (React Query, SWR) that handle deduplication by default.
 * 5. Avoid updating state if component is unmounted (prevents memory leaks).
 *
 * ===================================================================
 * 🔹 Q&A (Interview Style)
 * -------------------------------------------------------------------
 * Q1: What is a race condition in React?
 *   → When multiple async calls return out of order, causing stale UI updates.
 *
 * Q2: How to prevent race conditions in fetch?
 *   → Use AbortController to cancel previous requests.
 *
 * Q3: What is deduplication in networking?
 *   → Ensuring multiple identical requests are merged into one.
 *
 * Q4: Which libraries support deduplication?
 *   → React Query, SWR, axios with custom cache.
 *
 * Q5: What’s the difference between race condition handling & deduplication?
 *   → Race condition = multiple requests, wrong result order.
 *     Deduplication = avoiding sending duplicate requests.
 *
 * ===================================================================
 * ✅ Final Takeaways
 * -------------------------------------------------------------------
 * - Race condition → fix with **cancellation (AbortController, takeLatest)**.
 * - Deduplication → fix with **promise caching (React Query, SWR, custom)**.
 * - Both techniques improve **performance** and **data consistency**.
 * ===================================================================
 */
