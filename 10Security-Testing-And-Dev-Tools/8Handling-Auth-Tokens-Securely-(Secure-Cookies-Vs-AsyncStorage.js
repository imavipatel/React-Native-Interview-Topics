/**************************************************************
 * 📘 Handling Auth Tokens Securely in React Native
 **************************************************************/

/********************************************
 * 🟢 Why is this important?
 ********************************************/
/**
 * - Authentication tokens (JWT, OAuth tokens, session IDs) are the "keys"
 *   to your user’s account.
 * - If attackers steal tokens → they can impersonate users.
 * - Mobile apps often face attacks like:
 *   🔹 Reverse engineering
 *   🔹 Rooted/jailbroken devices
 *   🔹 Man-in-the-Middle (MITM)
 *   🔹 Malware extracting storage
 *
 * ✅ Proper storage & transport of tokens is critical.
 */

/********************************************
 * 🔑 Token Storage Options in React Native
 ********************************************/

/**
 * 1. AsyncStorage
 *    - Pros:
 *      ✅ Easy to use (key-value storage).
 *      ✅ Persistent across sessions.
 *    - Cons:
 *      ❌ Tokens stored in plain text on disk.
 *      ❌ Can be accessed if device is rooted/jailbroken.
 *      ❌ Vulnerable to XSS-like attacks (if injected code runs).
 *
 *    ⚠️ AsyncStorage should NOT be used for sensitive auth tokens in production.
 */

/**
 * 2. Secure Storage APIs
 *    - iOS: Keychain
 *    - Android: Keystore
 *    - Libraries:
 *      🔹 react-native-keychain
 *      🔹 react-native-encrypted-storage
 *      🔹 expo-secure-store
 *
 *    - Pros:
 *      ✅ OS-level encryption
 *      ✅ Tied to hardware security modules (Trusted Execution Environment)
 *      ✅ Cannot be read by other apps
 *    - Cons:
 *      ❌ Slightly more setup
 *      ❌ Some APIs slower than AsyncStorage
 *
 *    ✅ Recommended for sensitive tokens.
 */

/**
 * 3. HTTP-only, Secure Cookies
 *    - Server sets cookie in response → client sends automatically with requests.
 *    - `HttpOnly` flag:
 *       🔒 JavaScript cannot access cookie (prevents XSS attacks).
 *    - `Secure` flag:
 *       🔒 Sent only over HTTPS (not plain HTTP).
 *    - Works best in web → but in mobile, React Native’s fetch/axios support is limited.
 *
 *    ⚠️ React Native does NOT natively support HttpOnly cookies like browsers.
 *    - Need libraries: `react-native-cookies`, `react-native-cookie`, etc.
 */

/********************************************
 * 🛠️ Example – Using Secure Storage (Best Practice)
 ********************************************/
import EncryptedStorage from "react-native-encrypted-storage";

// Save token
async function saveToken(token) {
  try {
    await EncryptedStorage.setItem("auth_token", token);
  } catch (error) {
    console.error("Failed to save token securely", error);
  }
}

// Retrieve token
async function getToken() {
  try {
    const token = await EncryptedStorage.getItem("auth_token");
    return token;
  } catch (error) {
    console.error("Failed to fetch token", error);
    return null;
  }
}

// Delete token
async function clearToken() {
  try {
    await EncryptedStorage.removeItem("auth_token");
  } catch (error) {
    console.error("Failed to clear token", error);
  }
}

/********************************************
 * 🛠️ Example – Using react-native-keychain
 ********************************************/
import * as Keychain from "react-native-keychain";

// Save
await Keychain.setGenericPassword("user", "my_secret_token");

// Get
const creds = await Keychain.getGenericPassword();
console.log("Token:", creds?.password);

// Remove
await Keychain.resetGenericPassword();

/********************************************
 * 🚨 Common Mistakes to Avoid
 ********************************************/
/**
 * ❌ Storing tokens in AsyncStorage, SQLite, or files without encryption.
 * ❌ Embedding tokens in source code (hardcoded).
 * ❌ Returning tokens over plain HTTP (must use HTTPS).
 * ❌ Keeping refresh tokens accessible in insecure storage.
 */

/********************************************
 * 🔒 Best Practices
 ********************************************/
/**
 * 1. Prefer Secure Storage (Keychain/Keystore) over AsyncStorage.
 * 2. If possible, use short-lived access tokens + refresh tokens.
 * 3. Rotate tokens frequently (server-side enforced).
 * 4. Always use HTTPS + certificate pinning to prevent MITM.
 * 5. Avoid exposing tokens to JS runtime if possible → cookies (HttpOnly).
 * 6. Clear tokens immediately on logout.
 * 7. For high-security apps (banking/fintech):
 *    - Use OS-level storage only (Keychain/Keystore).
 *    - Combine with jailbreak/root detection.
 */

/********************************************
 * 📊 Summary
 ********************************************/
/**
 * 🔹 AsyncStorage → NOT safe for tokens (use only for non-sensitive data).
 * 🔹 Secure Storage (Keychain/Keystore) → BEST option for mobile tokens.
 * 🔹 HTTP-only Secure Cookies → great for web, limited support in RN.
 * 🔹 Always combine with HTTPS, SSL Pinning, and token rotation.
 */
