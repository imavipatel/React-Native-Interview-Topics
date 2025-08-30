/**
 * ==============================================================
 * 📘 AsyncStorage, SecureStorage, MMKV in React Native
 * ==============================================================
 *
 * 🟢 Introduction
 * --------------------------------------------------------------
 * In React Native, we often need to store small amounts of data
 * (like tokens, user preferences, settings).
 *
 * There are 3 main storage solutions:
 * - AsyncStorage (basic, community library)
 * - SecureStorage (encrypted storage for sensitive data)
 * - MMKV (fast, efficient storage from WeChat team)
 *
 * Each has pros, cons, and use cases.
 *
 * ==============================================================
 * 🔹 1. AsyncStorage
 * --------------------------------------------------------------
 * - Key-value storage system.
 * - Works asynchronously (non-blocking).
 * - Good for small data like user preferences, tokens.
 * - Not secure → data stored as plain text (not encrypted).
 * - Slower compared to MMKV.
 *
 * ✅ Pros:
 *   - Easy to use.
 *   - Cross-platform (iOS + Android).
 *   - Community maintained (`@react-native-async-storage/async-storage`).
 *
 * ❌ Cons:
 *   - No encryption (bad for sensitive data like passwords).
 *   - Performance issues for large datasets.
 *
 * --------------------------------------------------------------
 * Example: AsyncStorage
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

// Save data
await AsyncStorage.setItem("username", "avi123");

// Get data
const name = await AsyncStorage.getItem("username");

// Remove data
await AsyncStorage.removeItem("username");

// ✅ Real-world Example: Storing theme preferences
await AsyncStorage.setItem("theme", "dark");
const theme = await AsyncStorage.getItem("theme"); // "dark"

/**
 * ==============================================================
 * 🔹 2. SecureStorage (Expo SecureStore / react-native-keychain)
 * --------------------------------------------------------------
 * - Stores sensitive data securely (encrypted).
 * - On iOS → Keychain, on Android → Keystore.
 * - Best for **passwords, tokens, banking info**.
 *
 * ✅ Pros:
 *   - Encrypted by OS → secure storage.
 *   - Protects against device theft, malware.
 *   - Used for authentication tokens, PINs.
 *
 * ❌ Cons:
 *   - Slightly slower due to encryption overhead.
 *   - Limited storage size.
 *
 * --------------------------------------------------------------
 * Example: SecureStorage (Expo SecureStore)
 */
import * as SecureStore from "expo-secure-store";

// Save securely
await SecureStore.setItemAsync("token", "my_secret_token");

// Get securely
const token = await SecureStore.getItemAsync("token");

// Delete securely
await SecureStore.deleteItemAsync("token");

// ✅ Real-world Example: Storing JWT token
await SecureStore.setItemAsync("jwt", "abc123.jwt.token");
const jwt = await SecureStore.getItemAsync("jwt"); // "abc123.jwt.token"

/**
 * ==============================================================
 * 🔹 3. MMKV (by Tencent/WeChat)
 * --------------------------------------------------------------
 * - Ultra-fast key-value storage library.
 * - Written in C++ (high performance).
 * - Persistent storage like AsyncStorage but **much faster**.
 * - Good for **large datasets** (caches, settings, offline data).
 *
 * ✅ Pros:
 *   - Extremely fast (benchmark: ~30x faster than AsyncStorage).
 *   - Simple API (similar to AsyncStorage).
 *   - Supports encryption.
 *
 * ❌ Cons:
 *   - Requires native setup (extra config).
 *   - Slightly larger library size.
 *
 * --------------------------------------------------------------
 * Example: MMKV
 */
import MMKVStorage from "react-native-mmkv-storage";

const MMKV = new MMKVStorage.Loader().initialize();

// Save data
MMKV.setString("username", "avi123");

// Get data
const user = MMKV.getString("username");

// Delete data
MMKV.removeItem("username");

// ✅ Real-world Example: Storing offline API cache
MMKV.setMap("userProfile", { name: "Avi", age: 25 });
const profile = MMKV.getMap("userProfile"); // { name: "Avi", age: 25 }

/**
 * ==============================================================
 * 🔹 Comparison Table
 * --------------------------------------------------------------
 * | Feature            | AsyncStorage            | SecureStorage        | MMKV                   |
 * |--------------------|-------------------------|----------------------|------------------------|
 * | Security           | ❌ No encryption        | ✅ Encrypted         | ✅ Supports encryption |
 * | Performance        | 🐢 Slow                | 🐢 Medium            | ⚡ Very Fast            |
 * | Storage type       | Key-value (JSON text)  | OS Keychain/Keystore | Key-value (binary)     |
 * | Use case           | Preferences, cache     | Passwords, tokens    | Large data, caches     |
 * | Setup              | Easy                   | Easy (Expo/Keychain) | Native linking needed  |
 * | Cross-platform     | ✅ Yes                  | ✅ Yes               | ✅ Yes                 |
 *
 * ==============================================================
 * 🔹 Best Practices
 * --------------------------------------------------------------
 * - Use **AsyncStorage** → non-sensitive, small data (theme, language).
 * - Use **SecureStorage** → sensitive data (tokens, passwords).
 * - Use **MMKV** → large datasets, high-performance needs (caching).
 *
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Why not store tokens in AsyncStorage?
 *   → Because data is not encrypted → risk of theft.
 *
 * Q2: When to prefer MMKV over AsyncStorage?
 *   → When performance is critical (large lists, offline cache).
 *
 * Q3: Which storage is OS-level secure?
 *   → SecureStorage (Keychain/Keystore).
 *
 * Q4: Can MMKV encrypt data?
 *   → Yes, MMKV supports optional encryption keys.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - AsyncStorage → simple & common, but not secure.
 * - SecureStorage → secure for sensitive info.
 * - MMKV → high-performance, scalable storage.
 * - Choose storage based on **security + performance needs**.
 * ==============================================================
 */
