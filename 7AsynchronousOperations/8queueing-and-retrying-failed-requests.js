/**
 * ==============================================================
 * 📘 Queueing & Retrying Failed Requests in React Native
 * ==============================================================
 *
 * 🟢 Introduction
 * --------------------------------------------------------------
 * When working with APIs in React Native apps, network requests
 * may fail due to reasons like:
 *   - No internet connection (offline).
 *   - Server issues (500 errors).
 *   - Timeouts or slow connections.
 *
 * Instead of immediately failing, we can:
 *   - **Queue requests** → temporarily store them.
 *   - **Retry requests** → attempt again after failure.
 *
 * This makes apps more reliable and **offline-friendly**.
 *
 * ==============================================================
 * 🔹 Why Queue & Retry?
 * --------------------------------------------------------------
 * 1. **User Experience** – users expect actions (like sending a message)
 *    to succeed even if network is unstable.
 * 2. **Offline-first apps** – store requests offline, replay when online.
 * 3. **Reduce errors** – prevent data loss due to temporary issues.
 *
 * ==============================================================
 * 🔹 Common Strategies
 * --------------------------------------------------------------
 * 1. **Retry with delay** – retry failed request after a delay.
 * 2. **Exponential backoff** – wait progressively longer between retries
 *    (e.g., 1s → 2s → 4s → 8s).
 * 3. **Queueing offline requests** – store requests (AsyncStorage/MMKV),
 *    replay them when internet is restored.
 * 4. **Limit retries** – avoid infinite retry loops.
 *
 * ==============================================================
 * 🔹 Simple Retry with Axios
 * --------------------------------------------------------------
 */
import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "https://example.com/api",
});

// Retry logic
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (err) {
      if (i < retries - 1) {
        console.log(`Retrying... (${i + 1})`);
        await new Promise((res) => setTimeout(res, delay * (i + 1))); // exponential backoff
      } else {
        throw err;
      }
    }
  }
}

// Usage
fetchWithRetry("/users")
  .then((data) => console.log("✅ Success:", data))
  .catch((err) => console.error("❌ Failed after retries:", err));

/**
 * ==============================================================
 * 🔹 Queueing Failed Requests (Offline-first)
 * --------------------------------------------------------------
 * - Save failed requests into storage (AsyncStorage/MMKV).
 * - Replay them when internet comes back.
 *
 * Example: User sends a message → store in queue → sync later.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

// Queue manager
const requestQueue = [];

// Add to queue
async function addToQueue(request) {
  requestQueue.push(request);
  await AsyncStorage.setItem("requestQueue", JSON.stringify(requestQueue));
}

// Process queue
async function processQueue() {
  const savedQueue =
    JSON.parse(await AsyncStorage.getItem("requestQueue")) || [];
  for (let req of savedQueue) {
    try {
      await api(req); // retry request
    } catch (err) {
      console.log("Still failed:", req.url);
      return; // stop on failure, retry later
    }
  }
  // Clear queue after success
  await AsyncStorage.removeItem("requestQueue");
}

// Example usage
async function sendMessage(message) {
  try {
    await api.post("/messages", { text: message });
    console.log("✅ Sent:", message);
  } catch (err) {
    console.log("❌ Failed, queueing message...");
    await addToQueue({
      method: "POST",
      url: "/messages",
      data: { text: message },
    });
  }
}

/**
 * ==============================================================
 * 🔹 Listening to Online/Offline Events
 * --------------------------------------------------------------
 * React Native provides NetInfo API for network status.
 */
import NetInfo from "@react-native-community/netinfo";

// Listen for connectivity changes
NetInfo.addEventListener((state) => {
  if (state.isConnected) {
    console.log("🔄 Back online, processing queue...");
    processQueue();
  }
});

/**
 * ==============================================================
 * 🔹 Real-world Example
 * --------------------------------------------------------------
 * - User submits a form while offline.
 * - Request is saved in queue.
 * - When internet returns, processQueue() sends pending requests.
 *
 * ✅ Guarantees no data loss.
 *
 * ==============================================================
 * 🔹 Best Practices
 * --------------------------------------------------------------
 * 1. Use exponential backoff for retries → avoid server overload.
 * 2. Limit retries (e.g., max 3 attempts).
 * 3. Queue requests in persistent storage (AsyncStorage/MMKV).
 * 4. Use libraries like:
 *    - axios-retry (auto retries)
 *    - react-query (handles retries + caching)
 *    - redux-offline (queue + retry in Redux apps)
 *
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Why not retry requests infinitely?
 *   → Causes infinite loops, server overload, drains battery.
 *
 * Q2: What is exponential backoff?
 *   → Retry with increasing delay (1s → 2s → 4s → ...).
 *
 * Q3: How to handle offline API calls?
 *   → Queue them in storage, retry when online using NetInfo.
 *
 * Q4: Which library helps with retries & caching?
 *   → React Query, SWR, redux-offline.
 *
 * ==============================================================
 * 🔹 Library Comparison (Queueing & Retry)
 * --------------------------------------------------------------
 * | Library         | Features                                                                 | Best Use Case                                      |
 * |-----------------|--------------------------------------------------------------------------|---------------------------------------------------|
 * | axios-retry     | Auto-retry failed requests with exponential backoff.                     | Simple retry logic for axios-based apps.          |
 * | react-query     | Caching, retries, background refetching, stale-while-revalidate.         | Data fetching + retries + caching in React apps.  |
 * | redux-offline   | Offline queue, retries, rollback, replay requests on reconnect.          | Apps with Redux + offline-first requirement.      |
 * | SWR             | Stale-while-revalidate, caching, lightweight retry mechanism.            | Lightweight caching + retry in functional apps.   |
 * | custom + NetInfo| Full control, manual queueing + retry with AsyncStorage/MMKV.            | When you need custom offline queue logic.         |
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - Retry failed requests → improves reliability.
 * - Queue offline requests → ensures data consistency.
 * - Combine with **NetInfo** to auto-retry when back online.
 * - Use exponential backoff & max retry limits.
 * - Choose library based on app complexity:
 *   - Small apps → axios-retry
 *   - Data-heavy apps → react-query
 *   - Redux apps → redux-offline
 * ==============================================================
 */
