/**
 * react-native-offline-guest-mode-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "How to handle offline data & guest mode in React Native apps"
 *
 * - Plain-language overview
 * - Storage options & tradeoffs (SQLite, Realm, MMKV, AsyncStorage)
 * - Guest mode patterns (ephemeral vs persisted guest)
 * - Offline write queue, sync strategy, conflict resolution
 * - Sample abstractions / hooks (useOfflineQueue, useGuestSession)
 * - Data migration when upgrading guest -> authenticated user
 * - Security & encryption notes
 * - Background sync, retry/backoff, and testing checklist
 * - Interview Q&A + cheat-sheet
 *
 * Paste into your notes repo — ready for interview prep and implementation.
 */

/* ===========================================================================
📌 0. BIG PICTURE — simple explanation
===============================================================================
Offline + Guest Mode = let users use app without network or without account,
while ensuring data persists, synchronizes later, and can be upgraded to a full
account. Key concerns:
  • Local persistence (durable storage)
  • Queueing actions (writes) for later sync
  • Conflict resolution when syncing
  • Safe migration when guest signs up (merge or transfer data)
  • Security (encrypt sensitive data at rest)
  • UX: optimistic updates, progress, and error feedback
*/

/* ===========================================================================
📌 1. STORAGE OPTIONS & TRADEOFFS (choose based on needs)
===============================================================================
• AsyncStorage (RN builtin / community):
  - Pros: simple, key/value
  - Cons: not optimized for large datasets, not great for queries

• MMKV (react-native-mmkv):
  - Pros: fast, small, key/value, good for caching and tokens
  - Cons: not relational

• SQLite (react-native-sqlite-storage / better-sqlite3 variants):
  - Pros: relational queries, ACID, large datasets
  - Cons: query complexity, migration management

• Realm:
  - Pros: reactive, fast, object model, sync-ready (Realm Sync)
  - Cons: binary size, licensing considerations

• WatermelonDB:
  - Pros: optimized for large lists, lazy loading, good for complex apps
  - Cons: more setup, native schema

CHOOSING GUIDELINES:
  - Small prefs / tokens → MMKV
  - Relational / offline-first entities (messages, tasks) → SQLite / Realm / WatermelonDB
  - Simple key/value cache → AsyncStorage (only for tiny amounts)
  - If offline-sync built-in desired → consider Realm Sync or CouchDB + PouchDB
*/

/* ===========================================================================
📌 2. GUEST MODE PATTERNS (ephemeral vs persisted guest)
===============================================================================
1) Ephemeral Guest (in-memory or temp-only)
   - Data lives only until app closed or user signs up
   - Good for frictionless trials where persistence not necessary
   - Simpler security but bad UX if users expect data saved

2) Persisted Guest (recommended)
   - Create a local guest identity (guestId) and store data locally
   - Store guest refresh token or just local-only marker (avoid server secrets)
   - Better UX: data still available after app restart
   - Must plan migration path to permanent account

Best practice: persist guest data locally (SQLite/MMKV), use a locally-generated guestId.
*/

/* ===========================================================================
📌 3. HIGH-LEVEL OFFLINE ARCHITECTURE
===============================================================================
Local DB (SQLite/Realm)
  ↑
  | read/write for UI (fast)
  |
Offline Queue (writes/actions) -> persisted queue (local DB / queue table)
  ↓
Sync Engine (runs on connectivity / background) => Server API
  • Pull (fetch server changes) → merge into local DB
  • Push (flush queued writes) → server
Conflict resolution (server wins / client wins / last-write-wins / CRDT / custom)
Event bus / state notifications -> update UI optimistically and correct after sync
*/

/* ===========================================================================
📌 4. ACTION QUEUE & SYNC STRATEGY (practical)
===============================================================================
Queue structure (persisted):
[
  { id, type: 'create_todo', payload: {...}, status: 'pending', retryCount: 0, createdAt }
]

Sync steps:
  1. Connectivity detected or user triggers sync
  2. Lock queue (mutex) and mark batch as in-flight
  3. For each action:
     - Send to server (POST/PUT/DELETE)
     - On success: remove queue item and update local DB with canonical server id/ts
     - On conflict/error: apply resolution strategy or requeue with backoff
  4. After push, pull server updates (incremental since lastSyncAt or using server-provided changes)
  5. Apply merges to local DB and emit events
  6. Release mutex

Notes:
  - Always persist queue to survive app restarts.
  - Use optimistic UI: reflect changes immediately in local DB before server confirms.
  - Use stable temporary IDs (client-generated) for entities (cid: 'temp-123') and replace with server ID after sync.
*/

/* ===========================================================================
📌 5. CONFLICT RESOLUTION STRATEGIES
===============================================================================
Options:
  • Client wins: accept local changes, overwrite server (risky)
  • Server wins: discard local changes if server has newer data
  • Merge: merge fields (e.g., merge non-conflicting fields)
  • Last Write Wins (by timestamp): use server vs client timestamp
  • Operational Transformation / CRDTs: for complex collaborative apps
  • Manual resolution: surface conflict to user and ask to choose

Recommended:
  - For simple apps: use server-assigned versioning (ETag / revision number) and last-write-wins OR merge non-conflicting fields.
  - For collaborative multi-user data: consider CRDT or server-side merge logic.
*/

/* ===========================================================================
📌 6. SAMPLE STORAGE + QUEUE ABSTRACTION (runnable-ish)
===============================================================================
Below is a small, conceptual implementation using AsyncStorage for queue and
SQLite-like local DB API abstracted (replace with your chosen DB).
This demonstrates patterns: enqueueAction, processQueue, optimistic update.
*/

import { useEffect, useRef, useState } from "react";
import { AppState, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // install if using
// Note: for production use, replace AsyncStorage with SQLite / Realm for scalability

const QUEUE_KEY = "offline_action_queue_v1";
const LAST_SYNC_KEY = "last_sync_at_v1";

/** Local DB abstraction (stub) — replace with real DB calls */
const LocalDB = {
  upsertItem: async (item) => {
    // write item to local DB; item.id might be client id (cid)
  },
  deleteItem: async (id) => {
    // delete from local DB
  },
  getItemsSince: async (since) => {
    // return items for pull logic
  },
  applyServerPatch: async (patch) => {
    // merge server object into local DB
  },
};

/** Queue helpers */
async function readQueue() {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}
async function writeQueue(queue) {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}
async function enqueueAction(action) {
  const queue = await readQueue();
  queue.push({
    id: generateCid(),
    status: "pending",
    retry: 0,
    createdAt: Date.now(),
    ...action,
  });
  await writeQueue(queue);
}

/** simple cid generator */
function generateCid() {
  return `cid-${Math.random().toString(36).slice(2, 9)}`;
}

/* ===========================================================================
   processQueue: drains queue, calls API (axios/fetch), applies server results.
   - Uses a simple mutex (in-memory) to avoid concurrent runs
   - Implements exponential backoff on failures
=============================================================================== */
let queueMutex = false;
async function processQueue(apiClient) {
  if (queueMutex) return;
  queueMutex = true;
  try {
    let queue = await readQueue();
    if (!queue || queue.length === 0) return;

    // process sequentially (or in small batches)
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status === "inflight") continue; // skip already in-flight
      // mark inflight
      item.status = "inflight";
      await writeQueue(queue);

      try {
        // Example switch — adapt to your API
        let res = null;
        if (item.type === "create_todo") {
          // optimistic: local DB already has temp item with cid
          res = await apiClient.post("/todos", item.payload); // server returns canonical object with id
          // update local DB: replace cid with server id and update fields
          await LocalDB.applyServerPatch({
            cid: item.id,
            serverId: res.data.id,
            ...res.data,
          });
        } else if (item.type === "update_todo") {
          res = await apiClient.put(`/todos/${item.payload.id}`, item.payload);
          await LocalDB.applyServerPatch(res.data);
        } else if (item.type === "delete_todo") {
          res = await apiClient.delete(`/todos/${item.payload.id}`);
          await LocalDB.deleteItem(item.payload.id);
        }

        // remove item from queue
        queue = queue.filter((q) => q.id !== item.id);
        await writeQueue(queue);
      } catch (err) {
        // handle per-item error: retry with backoff or fail permanently
        item.retry = (item.retry || 0) + 1;
        item.status = "pending";
        // If server says "conflict", apply resolution
        if (err.response?.status === 409) {
          // conflict — apply merge strategy (e.g., pull server version and prompt user)
          const serverObj = err.response.data;
          await LocalDB.applyServerPatch(serverObj);
          // discard local action or ask user
          queue = queue.filter((q) => q.id !== item.id);
          await writeQueue(queue);
        } else if (item.retry >= 5) {
          // give up after 5 tries — surface to user or store in dead-letter
          // For now, alert and remove
          Alert.alert("Sync failed for an action — removed from queue");
          queue = queue.filter((q) => q.id !== item.id);
          await writeQueue(queue);
        } else {
          // exponential backoff delay before next attempt
          const delay = Math.min(60000, 1000 * Math.pow(2, item.retry));
          await sleep(delay);
          // continue processing loop; item remains in queue
        }
      }
    }
  } finally {
    queueMutex = false;
  }
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/* ===========================================================================
📌 7. HOOK: useOfflineSync (connects to app lifecycle & net status)
===============================================================================
- Listens to AppState and network changes (use NetInfo) to trigger processQueue
- Persisted queue ensures continuity across app restarts
*/

import NetInfo from "@react-native-community/netinfo"; // install this lib

export function useOfflineSync(apiClient) {
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // start when app resumes or network becomes online
    const onConnectivityChange = (state) => {
      if (state.isConnected) {
        processQueue(apiClient).catch(console.warn);
        // also run a pull to get server updates
        runPull(apiClient).catch(console.warn);
      }
    };

    unsubscribeRef.current = NetInfo.addEventListener(onConnectivityChange);

    const appStateListener = (next) => {
      if (next === "active") {
        NetInfo.fetch().then(onConnectivityChange);
      }
    };
    const sub = AppState.addEventListener("change", appStateListener);

    // initial attempt
    NetInfo.fetch().then(onConnectivityChange);

    return () => {
      unsubscribeRef.current?.();
      sub.remove?.();
    };
  }, [apiClient]);
}

async function runPull(apiClient) {
  // Example pull: fetch changes since lastSyncAt
  const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
  const res = await apiClient.get("/changes", { params: { since: lastSync } });
  // apply patches to local DB
  for (const patch of res.data.patches) {
    await LocalDB.applyServerPatch(patch);
  }
  await AsyncStorage.setItem(LAST_SYNC_KEY, res.data.currentSyncAt);
}

/* ===========================================================================
📌 8. GUEST → AUTH MIGRATION (transfer or merge)
===============================================================================
Strategy A: Seamless upgrade (recommended UX)
  1) Persist guest data tied to guestId (local DB).
  2) On sign-up/login, call server endpoint to claim guest data:
     - POST /claim-guest { guestId, credentials } => server merges guest server-side or returns new server ids
  3) Server returns canonical mapping of client cid -> server id
  4) Local sync engine applies mappings and updates local DB to use server ids
  5) Save auth tokens securely; continue sync as authenticated user

Strategy B: Upload then discard local
  - Upload local data to server under new account, then clear guest local store.

Edge cases:
  - If server cannot accept guest data, surface conflict and allow user to choose.
  - If guest had offline-only changes conflicting with existing account data, provide merge UI.

Important:
  - Do not use same refresh tokens for guest mode.
  - Use device-unique guestId (UUID) which server can accept for temporary association.
*/

/* ===========================================================================
📌 9. SECURITY & PRIVACY (must-do)
===============================================================================
• Encrypt sensitive local DB (Realm has encryption; for SQLite use SQLCipher)
• Securely store any tokens in Keychain / Keystore (react-native-keychain)
• Clear guest data on sign-out if user chooses (or keep if merged)
• Adhere to privacy laws: allow user to delete account + local data
• For queues with sensitive payloads, encrypt payloads at rest if stored to disk
• Avoid storing raw PII in logs or telemetry
*/

/* ===========================================================================
📌 10. BACKGROUND SYNC (optional advanced)
===============================================================================
• iOS: Background fetch / BGAppRefreshTask (limited); use push notifications to wake for sync
• Android: WorkManager (periodic/background tasks)
• Use server push notifications (silent push) to trigger sync for critical updates
• Always be mindful of battery/quotas: batch operations and limit frequency
*/

/* ===========================================================================
📌 11. TESTING & VALIDATION
===============================================================================
• Automated tests:
  - Unit test queue logic (enqueue, retry, failure handling)
  - Integration tests: simulate offline, enqueue actions, restart app, reconnect, and verify server receives actions
• Manual tests:
  - Reproduce network flakiness: airplane mode, intermittent reconnection
  - Guest -> auth flows, conflict scenarios
  - Large data sets and app restart during in-flight sync
• Use tools: Charles / Proxyman to simulate server responses & conflicts
*/

/* ===========================================================================
📌 12. LIBRARIES / APPROACHES TO CONSIDER
===============================================================================
• Realm (offline-first + optional sync)
• CouchDB / PouchDB (replication & sync model, conflict resolution)
• WatermelonDB (fast for large lists, offline support)
• react-native-mmkv for simple key-value performance
• react-native-background-fetch / react-native-background-actions / WorkManager wrappers
• react-native-async-storage for tiny queues (not recommended for large queues)
Always evaluate tradeoffs for app scale & complexity.
*/

/* ===========================================================================
📌 13. SAMPLE HIGH-LEVEL USAGE (flow)
===============================================================================
1) User in guest mode: app creates guestId and stores it in secure local storage
2) User creates items → UI writes to local DB and enqueues create actions (optimistic update)
3) User offline: queue persists; UI shows pending indicator
4) Network returns: useOfflineSync triggers processQueue, pushes actions, replaces cids with server ids
5) User signs up: claim guestId endpoint maps/merges guest data to new account
6) Continue sync as authenticated user and delete guest-specific keys if merged
*/

/* ===========================================================================
📌 14. HOOKS: useGuestSession (simplified)
===============================================================================
- Manages guestId generation, persistent flag, and sign-up transition
*/
import { v4 as uuidv4 } from "uuid"; // install uuid

export function useGuestSession() {
  const [guestId, setGuestId] = useState(null);
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("guest_id_v1");
      if (stored) setGuestId(stored);
      else {
        const id = `guest-${uuidv4()}`;
        await AsyncStorage.setItem("guest_id_v1", id);
        setGuestId(id);
      }
    })();
  }, []);

  async function claimGuestToUser(authToken) {
    // Call server to claim guest data using guestId
    // await apiClient.post('/claim-guest', { guestId }, { headers: { Authorization: `Bearer ${authToken}` }});
    // On success: server returns mapping + any conflicts
    // Apply server mappings to local DB
    // Delete guest marker if merged
    await AsyncStorage.removeItem("guest_id_v1");
    setGuestId(null);
  }

  return { guestId, claimGuestToUser };
}

/* ===========================================================================
📌 15. INTERVIEW Q&A (short)
===============================================================================
Q1: How do you persist offline writes?
A: Persist an action queue (DB or storage). Apply optimistic updates to local DB, then flush queue on reconnect.

Q2: How to handle guest mode data when user signs up?
A: Use guestId tied to local data; call server "claim guest" endpoint to merge or map client IDs to server IDs, then update local DB.

Q3: Which local DB to choose?
A: For small key/value use MMKV; for relational offline-first use SQLite, Realm, or WatermelonDB depending on scale and developer preference.

Q4: How to resolve conflicts?
A: Choose a pragmatic strategy: server-wins, client-wins, merge fields, or CRDTs for complex collaboration.

Q5: How to ensure queued actions survive app restarts?
A: Persist the queue to durable storage (DB or filesystem); do not keep it only in memory.

Q6: How to secure queued sensitive payloads?
A: Encrypt at rest (SQLCipher, Realm encryption) and store tokens in Keychain/Keystore.
*/

/* ===========================================================================
📌 16. QUICK CHEAT-SHEET (implementation checklist)
===============================================================================
✔ Pick storage: Realm/SQLite/MMKV based on data model
✔ Persist offline action queue (durable)
✔ Implement optimistic UI with temporary cids
✔ Use mutexed refresh & processQueue for reliable sync
✔ Implement retry with exponential backoff + dead-letter handling
✔ Provide guestId and guest→auth claim flow
✔ Encrypt sensitive local data and use secure token storage
✔ Use NetInfo + AppState to trigger sync; consider background sync
✔ Test for restarts, intermittent connectivity, and conflict scenarios
*/

/* ===========================================================================
📌 17. NEXT ARTIFACTS I CAN PREP FOR YOU (tell me which)
===============================================================================
  ✅ Full example with SQLite + queue table + sync worker (step-by-step)
  ✅ Realm-based offline-first sample with guest migration flow
  ✅ Unit tests & integration test plan for offline sync
  ✅ Background sync recipes for iOS (BGTasks) and Android (WorkManager)

Tell me which one and I will produce it in this same single-file JS Notes format.
*/
