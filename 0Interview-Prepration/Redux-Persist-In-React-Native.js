/**
 * react-native-redux-persist-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How I would handle data persistence using Redux Persist in React Native"
 *
 * - Very simple language for beginners
 * - Full coverage: why use redux-persist, storage choices, setup, encryption,
 *   migrations, purge/logout, best practices, tests, checklist, interview Q&A
 * - Copy-paste into your notes repo and adapt to your project.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Persist Redux state across app restarts safely and predictably using redux-persist.
*/

/* ===========================================================================
📌 1. WHY USE REDUX-PERSIST? (simple)
===============================================================================
- Keeps parts of Redux store on device so user data (UI prefs, cached items,
  tokens (careful!), offline queues) survive app restarts.
- Saves you from manually rehydrating state.
- Works well with Redux Toolkit and React-Redux.
- NOTE: Not every state should be persisted (e.g., ephemeral UI flags, large caches).
*/

/* ===========================================================================
📌 2. MAIN CONCEPTS (beginner-friendly)
===============================================================================
- Persistor: controls saving/loading from storage.
- Storage engine: where data is stored (AsyncStorage, MMKV, secure storage).
- persistConfig: rules for what to persist (whitelist / blacklist), version, migrate.
- Transforms: run code when saving/loading (e.g., encryption, filtering).
- Rehydration: process of loading persisted state into Redux store on app start.
*/

/* ===========================================================================
📌 3. DEPENDENCIES (common)
===============================================================================
yarn add @reduxjs/toolkit react-redux redux-persist @react-native-async-storage/async-storage
# optional (better perf / smaller footprint)
yarn add react-native-mmkv redux-persist-mmkv
# for encryption transform (optional)
yarn add redux-persist-transform-encrypt
*/

/* ===========================================================================
📌 4. SIMPLE IMPLEMENTATION (AsyncStorage) — step-by-step
===============================================================================
- This is the minimal recommended setup that works out-of-the-box.
- Store only safe/needed slices. Do NOT persist secrets in plain text.
*/

// store.js (single-file example)
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";

// Example slices (replace with your real slices)
import userReducer from "./slices/user.slice"; // contains user profile (no tokens)
import settingsReducer from "./slices/settings.slice"; // app preferences
import uiReducer from "./slices/ui.slice"; // ephemeral UI - we WILL NOT persist this

// 1) Root reducer
const rootReducer = combineReducers({
  user: userReducer,
  settings: settingsReducer,
  ui: uiReducer,
});

// 2) Persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage, // AsyncStorage for RN
  whitelist: ["user", "settings"], // only persist these reducers
  version: 1, // bump on schema changes -> use migrate
  // transforms: [someTransform], // optional transforms (encryption, migrations)
};

// 3) Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4) Configure store (include redux-persist safe middleware setup)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist actions cause non-serializable values during persist/rehydrate
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5) Create persistor
export const persistor = persistStore(store);

// 6) App root (wrap provider)
export function AppRoot({ App }) {
  // App is your main navigator or root component
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}

/* ===========================================================================
📌 5. BETTER STORAGE OPTION: MMKV (faster & smaller)
===============================================================================
- MMKV is much faster and smaller than AsyncStorage.
- Use a redux-persist storage adapter like 'redux-persist-mmkv' or 'redux-persist-mmkv-storage'.
- Example is conceptual — install the adapter and follow its README for exact import names.
*/

// conceptual snippet (do this if you install the adapter)
// import { createMMKVStorage } from 'redux-persist-mmkv';
// import { MMKV } from 'react-native-mmkv';
// const mmkv = new MMKV();
// const mmkvStorage = createMMKVStorage({ instance: mmkv });
// // use mmkvStorage in persistConfig.storage

/* ===========================================================================
📌 6. ENCRYPTION & TRANSFORMS (protect persisted data)
===============================================================================
- NEVER store raw sensitive secrets (long-lived refresh tokens) in plain persisted state.
- If you must persist sensitive small items, use an encryption transform:
  - redux-persist-transform-encrypt wraps your data with AES using a key.
  - Key management: keep encryption key out of source (derive from device or fetch from secure server).
- Or store tokens in secure storage (Keychain / Android Keystore) instead of redux-persist.

Example using redux-persist-transform-encrypt (conceptual):
*/
import createEncryptor from "redux-persist-transform-encrypt";

const encryptor = createEncryptor({
  secretKey: "SOME_ENV_KEY_OR_DEVICE_KEY", // DO NOT hardcode in prod; use secure source
  onError: function (error) {
    // handle encryption errors
  },
});

// then add to persistConfig:
// transforms: [encryptor]

/* ===========================================================================
📌 7. MIGRATIONS (schema changes between app versions)
===============================================================================
- Use persistConfig.version and persistConfig.migrate to transform old state shape.
- migrate receives persistedState and version -> you return new state to be rehydrated.

Example migrate:
*/
async function migrate(inboundState, currentVersion) {
  // inboundState: what was stored previously
  // currentVersion: number you set in persistConfig.version
  // Return state in new shape or null to clear
  if (!inboundState) return inboundState;

  // Example: if old version 0 had settings.theme = 'dark' as string, new expects boolean
  const nextState = { ...inboundState };
  if (currentVersion === 1) {
    // perform required changes
  }
  return nextState;
}

// add to persistConfig: migrate: (state) => migrate(state, persistConfig.version)

/* ===========================================================================
📌 8. PURGE / LOGOUT (clear persisted store safely)
===============================================================================
- On logout or security event, you often want to clear persisted store.
- Use persistor.purge() or persistor.flush() depending on needs.

Example logout flow:
*/
export async function logout(persistor) {
  // 1) clear any secure storage (Keychain) where tokens might be stored
  // await clearSecureTokens();

  // 2) purge persisted redux (removes saved data)
  await persistor.purge(); // removes persisted state from storage

  // 3) optionally dispatch an action to reset reducers if you have a root RESET case
  // store.dispatch({ type: 'root/reset' });
}

/* ===========================================================================
📌 9. HANDLE RACE & BOOTSTRAP (rehydration ready)
===============================================================================
- PersistGate exposes loading state — wait for rehydration before showing UI that
  depends on persisted values (auth state, theme).
- Alternatively, check store.getState() + persist.hasHydrated in more complex setups.
*/

/* ===========================================================================
📌 10. WHAT TO PERSIST (guidelines)
===============================================================================
✔ Persist:
  - User profile (non-sensitive fields)
  - App settings (theme, language, last-screen)
  - Offline queues (careful with size)
  - Small caches (IDs, metadata)
✘ Don’t persist:
  - Raw passwords and long-lived secret tokens (use secure Keychain instead)
  - Large blobs (images / videos) — use file storage
  - Highly volatile UI flags (modals, transient loaders)
*/

/* ===========================================================================
📌 11. SIZE & PERFORMANCE (keep it small)
===============================================================================
- Persist only small slices; large persisted data = slow boot & storage bloat.
- Compress or trim historic lists before persisting.
- Consider partial persistence: persist only IDs and fetch fresh details on app start.
- MMKV helps here (faster reads/writes), but still prefer small persisted state.
*/

/* ===========================================================================
📌 12. SERIALIZABLE ISSUES (be careful)
===============================================================================
- Redux state should be serializable for persistence and predictable behavior.
- Do not store class instances, Promises, functions, or React elements in persisted state.
- If you must, use transforms to serialize/deserialize those values.
*/

/* ===========================================================================
📌 13. TESTING (basic ideas)
===============================================================================
Unit tests:
  - Mock AsyncStorage/MMKV and test persistReducer behaviour.
  - Test migrate() across versions.
  - Test purge/logout clears persisted storage.

Manual tests:
  - Login, set some settings, restart app -> settings should persist.
  - Bump version and test migrate path (simulate old persisted state).
  - Test logout -> persisted state removed and app shows login.

E2E:
  - Use Detox or Appium: populate state, restart app, assert state rehydrated/cleared.
*/

/* ===========================================================================
📌 14. TROUBLESHOOTING (common issues)
===============================================================================
- Rehydration not happening: ensure PersistGate wraps Provider and persistor is created.
- Serializability warnings: update middleware ignoredActions (FLUSH, REHYDRATE, ...).
- State too big / slow startup: reduce persisted slices or switch to MMKV.
- Sensitive data in persisted store: remove keys, use secure storage for tokens, rotate compromised data.
*/

/* ===========================================================================
📌 15. SECURITY NOTES (important)
===============================================================================
- Never persist refresh tokens or secrets in plain redux-persist state.
  Use OS secure storage (Keychain/Keystore) or keep tokens server-bound.
- If you use encryption transform, manage keys securely (derive from biometric secret or secure server).
- Clear persisted store on logout or security events (use persistor.purge()).
*/

/* ===========================================================================
📌 16. CHECKLIST — QUICK (for each release)
===============================================================================
✔ Decide which slices to persist (whitelist)  
✔ Use AsyncStorage for simple use-cases / MMKV for better perf  
✔ Ensure no secrets stored in persisted state (use Keychain/Keystore)  
✔ Add version + migrate for schema changes  
✔ Test rehydration and purge on logout  
✔ Add transforms for encryption or data shape normalization (if needed)  
✔ Monitor persisted size and boot performance  
✔ Add unit tests for migrate & purge behaviors
*/

/* ===========================================================================
📌 17. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: Where should I store refresh tokens?
A: In platform secure storage (Keychain on iOS, Android Keystore), not redux-persist.

Q2: Why not persist everything?
A: Persisting large or sensitive data slows startup and increases attack surface. Persist only needed state.

Q3: How do you clear persisted redux state on logout?
A: Use persistor.purge() to remove saved state and optionally dispatch a reset action to clear in-memory state.

Q4: What is a transform in redux-persist?
A: A hook to modify data before saving or after loading (useful for encryption or migrating shapes).

Q5: How to handle schema changes safely?
A: Use persistConfig.version + migrate function to transform old persisted shapes to new ones.
*/

/* ===========================================================================
📌 18. EXAMPLE: Persist + Secure Token Hybrid (pattern)
===============================================================================
- Keep tokens in Keychain; keep profile/settings in redux-persist.
- On app start:
  1) initialize secure storage -> fetch token if present
  2) wait for rehydration (PersistGate)
  3) if token exists -> set in-memory auth state, otherwise show login
*/

/* ===========================================================================
📌 19. CODE SNIPPET: hybrid init flow (conceptual)
===============================================================================
import { getRefreshTokenSecure } from './secureStorage'; // Keychain helper

export async function bootstrapApp() {
  // 1) Try to get token from secure storage
  const token = await getRefreshTokenSecure();
  // 2) Wait for redux-persist rehydrate (PersistGate ensures this in UI)
  // 3) If token exists, dispatch to redux in-memory state (e.g., authSlice.setAuth(tokenData))
  if (token) {
    store.dispatch({ type: 'auth/setToken', payload: token });
    // Optionally, validate token with backend
  }
}

/* ===========================================================================
📌 20. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Use redux-persist to save small, safe slices only.  
2) Use AsyncStorage for simple cases; prefer MMKV for performance.  
3) Never store raw secrets in persisted redux state — use Keychain/Keystore.  
4) Use whitelist/blacklist + transforms + version/migrate for schema changes.  
5) Purge persisted store on logout or security events.  
6) Test rehydration, migration and purge. Keep persisted size small.
*/

/* ===========================================================================
📌 21. WANT NEXT?
===============================================================================
I can produce in the same simple notes format:
  ✅ Full MMKV + redux-persist-mmkv setup with exact code and native setup steps  
  ✅ Example: redux-persist-transform-encrypt implementation (secure key handling + tips)  
  ✅ Migration examples: upgrade from v1 → v2 with sample migrate() code  
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
