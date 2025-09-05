/******************************************************
 * 📘 Secure Storage – Keychain/Keystore, SecureStore, Encrypted-Storage
 ******************************************************/

/********************************************
 * 🟢 Why Secure Storage?
 ********************************************/
/**
 * - In mobile apps, we often store:
 *   🔹 Authentication tokens (JWT, OAuth tokens)
 *   🔹 Refresh tokens
 *   🔹 Sensitive user data (PINs, credentials)
 *
 * - Problem: `AsyncStorage` is **not secure**
 *   → Data is stored in plain text on the device.
 *
 * - Solution: Use **secure storage mechanisms** provided by OS
 *   → iOS Keychain
 *   → Android Keystore
 *   + Secure RN libraries that abstract them.
 */

/********************************************
 * 🔐 iOS Keychain & Android Keystore
 ********************************************/
/**
 * - Both are OS-level secure storage systems.
 *
 * 🔹 iOS Keychain:
 *   - Encrypted & managed by iOS.
 *   - Items are persisted across app reinstalls (unless explicitly cleared).
 *   - Apps cannot access other apps’ Keychain items.
 *
 * 🔹 Android Keystore:
 *   - Stores cryptographic keys inside a secure hardware enclave (TEE).
 *   - Apps can use keys but cannot extract them.
 *   - Ensures even rooted devices can’t easily access secrets.
 *
 * ✅ Best for: API tokens, passwords, certificates.
 */

/********************************************
 * 📦 Expo SecureStore
 ********************************************/
/**
 * - Part of Expo SDK (`expo-secure-store`).
 * - Provides a simple API over Keychain (iOS) & Keystore (Android).
 *
 * 🔹 Features:
 *   ✅ Cross-platform (iOS + Android).
 *   ✅ Easy to use with async API.
 *   ✅ Handles encryption under the hood.
 *
 * 🔹 Example:
 */
import * as SecureStore from "expo-secure-store";

async function saveToken(token) {
  await SecureStore.setItemAsync("authToken", token);
}

async function getToken() {
  return await SecureStore.getItemAsync("authToken");
}

/**
 * ✅ Best for Expo apps or RN apps already using Expo libs.
 */

/********************************************
 * 📦 react-native-encrypted-storage
 ********************************************/
/**
 * - A popular RN package for **secure data storage**.
 * - Uses:
 *   → iOS Keychain
 *   → Android Keystore + AES encryption
 *
 * 🔹 Features:
 *   ✅ Strong encryption (AES-256).
 *   ✅ Async API.
 *   ✅ Well-maintained & stable.
 *
 * 🔹 Example:
 */
import EncryptedStorage from "react-native-encrypted-storage";

async function storeUserSession() {
  await EncryptedStorage.setItem(
    "user_session",
    JSON.stringify({ token: "123456", loggedIn: true })
  );
}

async function loadUserSession() {
  const session = await EncryptedStorage.getItem("user_session");
  if (session) return JSON.parse(session);
  return null;
}

/**
 * ✅ Best for production RN apps (more secure than AsyncStorage).
 */

/********************************************
 * ⚖️ Comparison
 ********************************************/
/**
 * | Tool/Library              | Platform   | Security Level   | Ease of Use  | Best Use Case               |
 * |----------------------------|------------|-----------------|--------------|-----------------------------|
 * | iOS Keychain              | iOS        | High (OS-level) | Native only  | Store sensitive tokens      |
 * | Android Keystore          | Android    | High (TEE/HW)   | Native only  | Store encryption keys       |
 * | Expo SecureStore          | iOS/Android| Medium-High     | Very Easy    | Expo apps needing security  |
 * | Encrypted-Storage         | iOS/Android| High (AES + OS) | Easy         | RN apps, JWTs, credentials  |
 */

/********************************************
 * ✅ Best Practices
 ********************************************/
/**
 * - Always prefer **OS-level secure storage** (Keychain/Keystore).
 * - Use **EncryptedStorage** or **SecureStore** instead of AsyncStorage for sensitive data.
 * - Store:
 *   🔹 Tokens
 *   🔹 Refresh tokens
 *   🔹 Small sensitive data
 *
 * - Do NOT store:
 *   ❌ Large user data
 *   ❌ Images/files
 *
 * - Combine with:
 *   🔹 HTTPS (TLS) for network security
 *   🔹 Biometric authentication for extra protection
 */
