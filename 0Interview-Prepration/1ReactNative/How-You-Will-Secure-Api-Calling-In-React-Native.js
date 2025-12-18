/**
 * react-native-secure-api-calls-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES: "How to secure API calling in React Native"
 * - Plain-language explanations (what to protect and why)
 * - Practical recommendations (network, auth, storage, pinning, retries)
 * - Copy-pasteable patterns: Axios instance + interceptors, secure storage, token refresh mutex
 * - Native/security notes (Keychain/Keystore, cert pinning, mTLS)
 * - Detection, logging, monitoring, and checklist + interview Q&A
 *
 * Use these patterns in your apps. Install recommended native libraries for full functionality.
 */

/* ===========================================================================
📌 0. BIG PICTURE — WHAT "SECURING API CALLS" MEANS
===============================================================================
Goal: ensure confidentiality, integrity, and authenticity of requests and responses.
Protect:
  • Data in transit (TLS / HTTPS)
  • Credentials/tokens on device (Keychain / Keystore / SecureStore)
  • Request integrity (signatures, nonces, timestamps)
  • Defensive client behavior (validate inputs, limit retries)
  • Minimize attack surface (avoid logging secrets, minimize permissions)
Approach: combine transport security, auth best-practices, secure storage, request hardening, and server-side protections.
*/

/* ===========================================================================
📌 1. TRANSPORT LAYER — ALWAYS USE HTTPS / TLS
===============================================================================
✔ Use HTTPS (TLS 1.2+; prefer TLS 1.3 where supported).
✔ Disable insecure HTTP endpoints—block plain HTTP in builds/config.
✔ Verify certificates — prefer certificate/public-key pinning for high-security apps.
✔ Enforce strong TLS ciphers on server; use modern protocols only.
Note: Mobile OS provides TLS stacks; ensure servers use proper certificates (CA-signed).
*/

/* ===========================================================================
📌 2. CERTIFICATE PINNING & PUBLIC KEY PINNING (WHEN TO USE)
===============================================================================
Why: prevents MITM even if CA is compromised or device trusts a rogue intermediate.
Options:
  • Public-key pinning (pin SPKI hashes) — stable across cert renewals if same key used
  • Cert pinning (pin leaf cert) — simpler but needs update on cert rotation
Implementation:
  • Use native libraries: react-native-ssl-pinning / native networking libs / okhttp with certificatePinner.
  • With Fabric/new arch, still pin at native layer.
Tradeoffs:
  • Pinning = stronger security but need deployment strategy for key rotation & emergency unpinning.
  • Provide fallback/TTL pins or multiple pins (current + backup).
*/

/* ===========================================================================
📌 3. AUTHENTICATION & TOKEN STRATEGIES
===============================================================================
Common schemes:
  • OAuth2 (Authorization Code + PKCE) — for user auth & third-party
  • JWT access tokens + refresh tokens — common pattern
  • API keys for machine-to-machine (store securely)
Best practices:
  • Short-lived access tokens, longer-lived refresh tokens.
  • Store tokens in secure storage (Keychain/Keystore, not AsyncStorage).
  • Use PKCE for public clients (mobile apps).
  • Rotate refresh tokens and support refresh-token revocation on server.
  • Use scope & audience restrictions on tokens.
  • Avoid embedding secrets in app binary.
*/

/* ===========================================================================
📌 4. SECURE STORAGE ON DEVICE
===============================================================================
Do NOT store secrets in AsyncStorage or plain files.
Use platform secure stores:
  • iOS: Keychain (react-native-keychain or expo-secure-store)
  • Android: EncryptedSharedPreferences or Android Keystore (react-native-keychain)
Libraries:
  • react-native-keychain
  • react-native-sensitive-info
  • expo-secure-store (if using Expo)
Pattern:
  • Store refresh token in secure store
  • Keep access token in-memory (short-lived) and reload from secure store on cold start
  • Consider encrypting stored blobs with device keys (keystore-backed)
*/

/* ===========================================================================
📌 5. NETWORK LAYER PATTERNS — INTERCEPTORS, TIMEOUTS, RETRIES
===============================================================================
Essentials:
  • Use a single network client instance (Axios/fetch wrapper)
  • Centralize headers, timeouts, and retry/backoff logic
  • Implement request signing or HMAC where server expects it
  • Protect against replay: include nonce + timestamp + signature
  • Timeout short for UI requests, longer for background tasks
  • Exponential backoff with jitter for retries
  • Circuit breaker for repeated failures
*/

/* ===========================================================================
📌 6. TOKEN REFRESH WITH MUTEX (prevent race conditions)
===============================================================================
Problem: multiple parallel requests trigger multiple refresh calls causing token thrash.
Solution: refresh mutex / queue pending requests until refresh completes.

Below: Axios + secure storage + refresh mutex pattern (conceptual code).
Requires: axios, react-native-keychain or secure store library.
*/

/* ============================
   Install:
   npm i axios react-native-keychain
   ============================ */

import axios from "axios";
// import * as Keychain from 'react-native-keychain'; // uncomment when installed
// placeholder Keychain API in comments where used below

// Simple in-memory token cache (keeps access token short-lived in memory)
let inMemoryAccessToken = null;

// refreshPromise acts as a mutex: null when no refresh in progress
let refreshPromise = null;

/**
 * getAccessToken() -> returns current access token (from memory or secure store)
 * (In production, read secure store on cold start and keep in-memory)
 */
async function getAccessToken() {
  if (inMemoryAccessToken) return inMemoryAccessToken;
  // const creds = await Keychain.getGenericPassword();
  // if (creds) return creds.password; // example storing token as password
  return null;
}

/**
 * saveRefreshTokenSecurely(refreshToken)
 */
async function saveRefreshTokenSecurely(refreshToken) {
  // await Keychain.setGenericPassword('refreshToken', refreshToken, { service: 'myapp-refresh' });
}

/**
 * refreshAccessToken() - calls token endpoint and returns new access token
 * Uses refresh token from secure store. Ensures only one refresh occurs at a time.
 */
async function refreshAccessToken() {
  // If there's an ongoing refresh, reuse it (mutex)
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      // const creds = await Keychain.getGenericPassword({ service: 'myapp-refresh' });
      // const refreshToken = creds ? creds.password : null;
      const refreshToken = /* read from secure store */ null;

      if (!refreshToken) throw new Error("No refresh token");

      // Call your token refresh endpoint — POST /auth/refresh
      const res = await axios.post(
        "https://api.example.com/auth/refresh",
        {
          refresh_token: refreshToken,
        },
        {
          timeout: 5000,
        }
      );

      const {
        access_token,
        refresh_token: newRefreshToken,
        expires_in,
      } = res.data;
      inMemoryAccessToken = access_token;

      // Save new refresh token securely
      if (newRefreshToken) {
        await saveRefreshTokenSecurely(newRefreshToken);
      }

      return access_token;
    } catch (err) {
      // On refresh failure: clear tokens and force sign-out
      inMemoryAccessToken = null;
      // await Keychain.resetGenericPassword({ service: 'myapp-refresh' });
      throw err;
    } finally {
      refreshPromise = null; // release mutex
    }
  })();

  return refreshPromise;
}

/* ===========================================================================
Axios instance + interceptors (attach access token, handle 401 -> refresh)
=============================================================================== */
const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
  // withCredentials: true, // only if needed
});

// Request interceptor to attach tokens and common headers
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add additional headers: device id, app version, nonces if used for signing
    config.headers["X-Client-Version"] = "1.0.0";
    config.headers["X-Device-Id"] = "device-id-placeholder";
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and retry once after refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        const token = await getAccessToken();
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest); // retry original request
      } catch (err) {
        // Refresh failed — redirect to login / clear session
        // signOutUser();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

/* ===========================================================================
📌 7. REQUEST SIGNING (HMAC) & REPLAY PROTECTION
===============================================================================
Why: ensure request authenticity and detect tampering.
Pattern (server + client):
  • Client computes HMAC over (method + path + body + timestamp + nonce) using a secret
  • Server validates signature, checks timestamp window, checks nonce uniqueness
Notes:
  • Mobile apps cannot safely store long-term symmetric secrets (attacker with device can extract).
  • Use token-based HMAC where server issues short-lived keys or use asymmetric signing with private keys in secure module (e.g., hardware-backed keys).
  • For higher security, use Mutual TLS or hardware-backed keys.
*/

/* ===========================================================================
📌 8. MUTUAL TLS (mTLS) & HARDWARE- BACKED KEYS (HIGH SECURITY)
===============================================================================
mTLS: both client & server present certificates. Strong but operationally heavy.
Hardware-backed keys:
  • Use Android Keystore / iOS Secure Enclave to generate/keep private keys that never exit hardware.
  • Use keys to sign requests or perform asymmetric auth flows.
Native code required — integrate via native modules or libraries.
*/

/* ===========================================================================
📌 9. SECURE ERROR HANDLING, LOGGING & TELEMETRY
===============================================================================
• Never log tokens, passwords, PII, or raw request bodies that include secrets.
• Send minimal telemetry: event types, status codes, non-PII error messages.
• Mask or redact sensitive fields before logging or sending to Sentry.
• Use sampling for error telemetry to avoid exfiltrating large amounts of data.
• On auth failures, avoid revealing detailed reasons in logs accessible to client.
*/

/* ===========================================================================
📌 10. ADDITIONAL DEFENSIVE SERVER-SIDE CONTROLS (work with backend)
===============================================================================
Server must help secure APIs:
  • Enforce TLS & HSTS
  • Validate tokens & scopes
  • Rate limiting & throttling per account/IP/device
  • Freshness checks for signed requests (timestamp + nonce)
  • Bind refresh tokens to device identifiers and revoke on logout
  • Detect anomalous behavior & block suspicious clients
  • Support token revocation and immediate logout
  • Use short TTLs for access tokens and rotate refresh tokens
*/

/* ===========================================================================
📌 11. HANDLING WEBVIEWS, DEEP LINKS & THIRD-PARTY AUTH
===============================================================================
• WebViews: isolate auth contexts; avoid sharing cookies with app webviews if possible.
• Deep links: validate redirect URIs (use app link verification where possible).
• OAuth: use Authorization Code Flow with PKCE for native apps; never store client secret in app.
*/

/* ===========================================================================
📌 12. OFFLINE & QUEUING WITH SECURITY
===============================================================================
• Queue requests securely when offline; sign then send with current token when online.
• Ensure queued payloads are encrypted on disk if they include sensitive data.
• Revalidate queued requests on send (tokens may have expired).
*/

/* ===========================================================================
📌 13. COMMON LIBRARY RECOMMENDATIONS
===============================================================================
• react-native-keychain (secure storage / Keychain & Keystore)
• axios (network client) + axios-retry (retry/backoff) or custom implementation
• react-native-ssl-pinning (certificate pinning) — verify maintenance & compatibility
• react-native-secure-storage / expo-secure-store (if using Expo)
• OAuth helpers: AppAuth / react-native-app-auth (Authorization Code + PKCE)
• Reanimated/GestureHandler for safe UI thread animations (not auth-specific but relevant to UX)
Always vet native libraries for maintenance & security posture.
*/

/* ===========================================================================
📌 14. SAMPLE HIGH-LEVEL APP FLOW (authentication + call)
===============================================================================
1) User authenticates using Authorization Code + PKCE (AppAuth) → server returns:
     { access_token (short), refresh_token (rotating) }
2) Save refresh_token securely in Keychain; keep access_token in-memory.
3) For each API request, Axios attaches Authorization: Bearer <access_token>
4) On 401:
     - Use mutexed refresh flow to get new access_token using refresh_token
     - Save new refresh_token if returned
     - Retry original requests
5) On logout or critical error:
     - Clear secure store & in-memory tokens
     - Notify server to revoke tokens
6) Use certificate pinning for sensitive apps & hardware-backed keys for highest security
*/

/* ===========================================================================
📌 15. CHECKLIST (practical action items)
===============================================================================
✔ Enforce HTTPS (no HTTP)
✔ Store refresh token in Keychain/Keystore, not AsyncStorage
✔ Keep access token in memory and recreate on cold start
✔ Use Authorization Code + PKCE for OAuth flows
✔ Implement refresh token rotation & revoke on logout
✔ Add refresh mutex to avoid parallel refresh calls
✔ Implement retry with exponential backoff + jitter
✔ Avoid logging secrets and redact PII in telemetry
✔ Validate server TLS config and consider cert pinning
✔ Use hardware-backed keys / mTLS for very-high-security apps
✔ Limit permissions and minimize data in requests
*/

/* ===========================================================================
📌 16. INTERVIEW Q&A (short)
===============================================================================
Q1: Where should you store refresh tokens in RN?
A: In platform secure store (Keychain on iOS, Keystore/EncryptedSharedPreferences on Android). Avoid AsyncStorage.

Q2: How do you prevent multiple refreshes when many requests get 401?
A: Use a refresh mutex/promise queue so only one refresh happens and others await it.

Q3: Is certificate pinning always recommended?
A: Recommended for high-security apps (finance, healthcare) — but requires careful rotation strategy.

Q4: Should you log request bodies?
A: No — never log tokens, passwords, or PII. Mask sensitive fields.

Q5: What is PKCE and why use it?
A: PKCE (Proof Key for Code Exchange) prevents interception of the authorization code; mandatory for native public clients.

*/

/* ===========================================================================
📌 17. NEXT: READY-MADE ARTIFACTS I CAN PREP FOR YOU (tell me which)
===============================================================================
  ✅ Fully implemented Axios + Keychain example with real code (I will include install steps)
  ✅ Certificate pinning sample (Android okhttp / iOS NSURLSession) with instructions
  ✅ OAuth 2.0 Authorization Code + PKCE flow example using react-native-app-auth
  ✅ Checklist + CI checks for build-time secrets detection
Choose one and I’ll produce it in this same single-file JS Notes format.
*/
