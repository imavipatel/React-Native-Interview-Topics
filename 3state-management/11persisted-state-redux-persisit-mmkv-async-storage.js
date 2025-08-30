/**
 * ==============================================================
 * 📘 Persisted State – redux-persist, AsyncStorage, MMKV
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is Persisted State?
 * - Normally, React/Redux state is lost when the app restarts.
 * - **Persisted state** means saving state to device storage so it
 *   survives app reloads/restarts.
 * - Example: User login session, cart items, app theme, onboarding flag.
 *
 * --------------------------------------------------------------
 * 🔹 Why do we need Persistence?
 * ✅ Improve UX → user doesn’t need to log in every time.
 * ✅ Performance → fewer API calls by caching data locally.
 * ✅ Offline Support → app can work without internet.
 *
 * --------------------------------------------------------------
 * 🔹 AsyncStorage
 * - Simple **key-value storage** for React Native.
 * - Works like `localStorage` in the web.
 * - Stores small amounts of data (strings only).
 * - API is async (Promise-based).
 *
 * --------------------------------------------------------------
 * 🔹 MMKV (by Tencent, used in RN apps)
 * - Ultra-fast **key-value storage** library written in C++.
 * - Much faster than AsyncStorage (uses memory-mapped storage).
 * - Supports primitives (string, number, boolean) + buffers.
 * - Great for apps needing performance (chat apps, big lists).
 * - Can be used directly or as a backend for `redux-persist`.
 *
 * --------------------------------------------------------------
 * 🔹 redux-persist
 * - A library that automatically **saves Redux state to storage**
 *   (AsyncStorage or MMKV).
 * - Restores state when the app restarts → no need to manually re-fetch.
 * - Supports:
 *    * Whitelisting (only save specific reducers)
 *    * Blacklisting (exclude some reducers)
 *    * Migration (update old persisted state shape to new)
 *
 * ==============================================================
 * 🔹 Code Examples
 * --------------------------------------------------------------
 *
 * Example 1: AsyncStorage (simple key-value store)
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

// Save data
await AsyncStorage.setItem("theme", "dark");

// Retrieve data
const theme = await AsyncStorage.getItem("theme");
console.log(theme); // "dark"

/**
 * --------------------------------------------------------------
 * Example 2: MMKV (high-performance storage)
 */
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

// Save data
storage.set("user_id", "12345");

// Retrieve data
const id = storage.getString("user_id");
console.log(id); // "12345"

/**
 * --------------------------------------------------------------
 * Example 3: redux-persist with AsyncStorage
 */
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import rootReducer from "./reducers";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "cart"], // only save these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };

/**
 * ==============================================================
 * 📊 Comparison Table
 * ==============================================================
 *
 * | Feature         | AsyncStorage                     | MMKV                        | redux-persist              |
 * |-----------------|----------------------------------|-----------------------------|-----------------------------|
 * | Type            | Key-value storage                | Key-value (C++ fast engine) | Redux enhancer (uses storage) |
 * | Speed           | Slower                           | Much faster (native layer)  | Depends on backend storage  |
 * | Data Type       | String only                      | String, number, boolean     | Redux state (objects)       |
 * | Use Case        | Small settings, flags, tokens    | Performance-critical apps   | Persist whole Redux store   |
 * | Offline Support | ✅ Yes                           | ✅ Yes                       | ✅ Yes                       |
 * | Complexity      | Easy                             | Easy (but needs install)    | Medium (extra setup)        |
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Why do we need persisted state?
 *    → To keep data (auth, theme, cart) across app restarts without re-fetching.
 *
 * Q2: What’s the difference between AsyncStorage and MMKV?
 *    → Both are key-value stores, but MMKV is **much faster** and supports more data types.
 *
 * Q3: How does redux-persist work?
 *    → Wraps Redux reducers, saves state to storage, and restores on app reload.
 *
 * Q4: When should you use redux-persist?
 *    → When you want **Redux-managed state** (auth, cart, user preferences) to survive app restarts.
 *
 * Q5: Best practice for persisted state?
 *    → Persist only what’s necessary (auth token, theme), not large/temporary data.
 *
 * ==============================================================
 */
