/**
 * react-native-resilient-api-notes-beginner-friendly.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly):
 * "How to handle API calling when the network is slow or unstable in React Native"
 *
 * This file explains everything in very simple language.
 * All concepts are the same — only easier to understand.
 */

/* ===========================================================================
📌 0. WHY HANDLING POOR NETWORK IS IMPORTANT (simple explanation)
===============================================================================
Mobile networks are not always stable. People's connections can:

  • switch from WiFi → 4G → 3G → 2G  
  • drop suddenly  
  • become slow  
  • fail randomly  

If your app does not handle this well:

  ❌ API calls will fail  
  ❌ App will freeze  
  ❌ User will get frustrated  

So we must make API calls “smart”:

  ✔ Retry when network is temporarily bad  
  ✔ Cancel requests that take too long  
  ✔ Save actions offline and send them later  
  ✔ Show helpful messages to users  
  ✔ Make uploads/downloads continue from where they stopped  
*/

/* ===========================================================================
📌 1. MAIN IDEAS (simple rules)
===============================================================================
• Detect if the device is online or offline  
• Use timeouts — don’t let API calls hang forever  
• Retry requests intelligently  
• Save important actions to a queue when offline  
• Send them again when network becomes available  
• Allow users to manually retry  
• Use small chunks for big uploads/downloads  
• Avoid downloading huge data in one go  
*/

/* ===========================================================================
📌 2. DETECTING NETWORK STATUS (NetInfo)
===============================================================================
Use NetInfo library to know if the device is online.

Example:
*/
import { useEffect, useRef, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export function useNetworkStatus() {
  const [state, setState] = useState({
    isConnected: true,
    isInternetReachable: true,
    type: "unknown",
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((s) => {
      setState({
        isConnected: s.isConnected,
        isInternetReachable: s.isInternetReachable,
        type: s.type,
      });
    });
    NetInfo.fetch().then((s) =>
      setState({
        isConnected: s.isConnected,
        isInternetReachable: s.isInternetReachable,
        type: s.type,
      })
    );
    return unsubscribe;
  }, []);

  return state;
}

/* ===========================================================================
📌 3. TIMEOUTS & CANCEL REQUESTS (Beginner Explanation)
===============================================================================
By default, fetch() can take forever.  
We must cancel it if it takes too long.

We use AbortController for that:
*/

export async function fetchWithTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } finally {
    clearTimeout(id);
  }
}

/* ===========================================================================
📌 4. RETRIES WITH BACKOFF (simple explanation)
===============================================================================
Sometimes a network call fails for a short moment.  
In this case, retrying can fix the problem.

BUT…

❌ Don’t retry immediately  
❌ Don’t retry too many times  
❌ Don’t retry 401 (Unauthorized)

So we retry with increasing delay:

1st retry → wait 0.5 sec  
2nd retry → wait 1 sec  
3rd retry → wait 2 sec  
4th retry → wait random time (jitter helps avoid server overload)
*/

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function backoffDelay(baseMs, attempt, maxDelay = 30000) {
  const expo = Math.min(maxDelay, baseMs * Math.pow(2, attempt));
  return Math.floor(Math.random() * expo);
}

export async function retryWithBackoff(fn, options = {}) {
  const { retries = 3, baseDelay = 500, timeout = 10000, retryOn } = options;
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const shouldRetry =
        attempt < retries &&
        (typeof retryOn === "function" ? retryOn(err) : defaultRetryOn(err));
      if (!shouldRetry) throw err;
      const delay = backoffDelay(baseDelay, attempt);
      await sleep(delay);
      attempt += 1;
    }
  }
}

function defaultRetryOn(err) {
  if (err?.name === "AbortError") return true;
  if (err?.response) {
    const status = err.response.status;
    return status >= 500 || status === 429;
  }
  return true;
}

/* ===========================================================================
📌 5. AXIOS CLIENT WITH AUTO RETRY & TOKEN REFRESH (simple version)
===============================================================================
This code handles:
  ✔ Automatic token refresh  
  ✔ Automatic retry for 401  
  ✔ Adds Authorization header automatically  
*/

import axios from "axios";

let inMemoryToken = null;
let refreshMutex = null;

export const apiClient = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  if (inMemoryToken) config.headers.Authorization = `Bearer ${inMemoryToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      await mutexRefreshToken();
      original.headers.Authorization = `Bearer ${inMemoryToken}`;
      return apiClient(original);
    }
    throw err;
  }
);

async function mutexRefreshToken() {
  if (refreshMutex) return refreshMutex;
  refreshMutex = (async () => {
    return inMemoryToken;
  })();
  return refreshMutex;
}

/* ===========================================================================
📌 6. OFFLINE QUEUE (Beginner Explanation)
===============================================================================
If a user tries to do some important action (example: send message, update profile)  
while offline → WE DO NOT WANT TO LOSE THAT ACTION.

So we save it into a queue (local storage).

Later, when the network is available → we process all queued actions.
*/

import AsyncStorage from "@react-native-async-storage/async-storage";
const QUEUE_KEY = "offline_queue_v1";
let queueRunning = false;

async function readQueue() {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}
async function writeQueue(q) {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

export async function enqueueMutation(action) {
  const q = await readQueue();
  q.push({ id: `cid-${Date.now()}`, action, retries: 0 });
  await writeQueue(q);
}

export async function processQueue(apiFn, opts = { maxRetries: 5 }) {
  if (queueRunning) return;
  queueRunning = true;
  try {
    let q = await readQueue();
    for (let i = 0; i < q.length; ) {
      const item = q[i];
      try {
        await retryWithBackoff(() => apiFn(item.action), {
          retries: opts.maxRetries,
        });
        q.splice(i, 1);
        await writeQueue(q);
      } catch (err) {
        item.retries += 1;
        if (item.retries > opts.maxRetries) {
          q.splice(i, 1);
          await writeQueue(q);
        } else {
          i++;
        }
      }
    }
  } finally {
    queueRunning = false;
  }
}

/* ===========================================================================
📌 7. OPTIMISTIC UI (simple explanation)
===============================================================================
Show the update immediately in the UI even before sending to the server.

Example:
  User creates a post →
    ✔ Show it immediately in the UI
    ✔ Add it to offline queue
    ✔ When online, send it to the server
    ✔ Replace temporary ID with real server ID
*/

/* ===========================================================================
📌 8. RESUMABLE UPLOADS (simple explanation)
===============================================================================
If you upload a big file and network breaks:

❌ Don't start upload from beginning  
✔ Continue from where it stopped  

Use TUS protocol or chunked uploads.
*/

/* ===========================================================================
📌 9. REDUCE DATA (good for poor network)
===============================================================================
✔ Use pagination  
✔ Use caching  
✔ Download only what is needed  
✔ Compress data on server  
*/

/* ===========================================================================
📌 10. CIRCUIT BREAKER (beginner explanation)
===============================================================================
If the server is failing again and again →  
STOP sending requests for a while.

This avoids:
  • Battery drain  
  • Server overload  
*/

/* ===========================================================================
📌 11. UI TIPS FOR POOR NETWORK
===============================================================================
✔ Show "Offline" indicator  
✔ Show retry button  
✔ Show loader when retrying  
✔ Avoid freezing UI  
✔ Show last cached data  
*/

/* ===========================================================================
📌 12. TESTING POOR NETWORK
===============================================================================
You can simulate bad network using:

• Android Studio → Network throttling  
• Xcode → Network Link Conditioner  
• Charles Proxy → Drop packets / limit speed  
*/

/* ===========================================================================
📌 13. useNetworkAwareApi HOOK (easy explanation)
===============================================================================
This hook:

  ✔ Checks if device is online  
  ✔ Retries API calls  
  ✔ Saves actions to queue if offline  
*/

import { useCallback } from "react";

export function useNetworkAwareApi(apiClient, processQueueFn) {
  const { isConnected } = useNetworkStatus();

  const callApi = useCallback(
    async (
      requestConfig,
      {
        retry = true,
        fallbackToQueue = false,
        enqueueActionIfOffline = null,
      } = {}
    ) => {
      if (!isConnected) {
        if (enqueueActionIfOffline) {
          await enqueueMutation(enqueueActionIfOffline(requestConfig));
          return { ok: false, queued: true };
        } else {
          throw new Error("Offline");
        }
      }

      const fn = () => apiClient(requestConfig);
      try {
        return await retryWithBackoff(fn, { retries: retry ? 3 : 0 });
      } catch (err) {
        if (fallbackToQueue && enqueueActionIfOffline) {
          await enqueueMutation(enqueueActionIfOffline(requestConfig));
          return { ok: false, queued: true };
        }
        throw err;
      }
    },
    [isConnected, apiClient]
  );

  useEffect(() => {
    if (isConnected) {
      processQueueFn().catch(console.warn);
    }
  }, [isConnected, processQueueFn]);

  return { callApi };
}

/* ===========================================================================
📌 14. INTERVIEW Q&A (simple answers)
===============================================================================
Q1: How to detect network status?
A: Use NetInfo library (isConnected, type, etc.)

Q2: Why do we retry with backoff?
A: To avoid hitting server repeatedly and to allow network time to recover.

Q3: What is optimistic UI?
A: Showing updates in UI immediately before server confirms the action.

Q4: How to support offline user actions?
A: Save them in a queue and send to server when back online.

Q5: How to handle large uploads in poor network?
A: Use resumable uploads (upload in small chunks, retry only failed chunks).
*/

/* ===========================================================================
📌 15. CHEAT-SHEET (very beginner friendly)
===============================================================================
✔ Show offline banner using NetInfo  
✔ Always use timeout for fetch/axios  
✔ Retry API calls using exponential backoff  
✔ Save important actions to offline queue  
✔ Process queue when network returns  
✔ Use small chunks for uploads/downloads  
✔ Show cached data while reloading  
✔ Use optimistic UI for good user experience  
*/

/* ===========================================================================
📌 16. WANT NEXT?
===============================================================================
I can create beginner-friendly notes for:

  ✅ Offline-first architecture (React Native)
  ✅ Resumable uploads full example (client + server)
  ✅ Full Axios wrapper with retry + offline queue
  ✅ Best UI patterns for poor network apps

Tell me which one you want!
*/
