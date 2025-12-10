/**
 * react-native-refresh-token-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "Refresh Token – how I handle refresh token functionality and implement it"
 *
 * - Very simple language for beginners
 * - Full coverage: concept, security goals, client implementation (React Native),
 *   axios interceptors, refresh queue (race prevention), rotation & reuse handling,
 *   server-side considerations, logout & revoke, tests, checklist, interview Q&A
 * - Everything in one file (single-file JS notes). Copy-paste into your notes repo.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Keep users logged in safely by using short-lived access tokens and a secure,
reliable refresh token flow that renews access without compromising security.
*/

/* ===========================================================================
📌 1. WHAT IS A REFRESH TOKEN? (very simple)
===============================================================================
- Access token: short-lived token (e.g., 5–15 minutes) used for API calls.  
- Refresh token: long-lived credential used only to request new access tokens.
- Purpose: limit exposure by making access tokens short, while allowing seamless UX
  via refresh tokens when access tokens expire.
*/

/* ===========================================================================
📌 2. SECURITY GOALS (beginner-friendly)
===============================================================================
✔ Minimize time a stolen token is useful (short access token TTL).  
✔ Protect refresh tokens with platform secure storage (Keychain / Keystore).  
✔ Prevent refresh token replay & detect reuse (rotate-on-refresh).  
✔ Limit where refresh tokens can be used (bind to device/session).  
✔ Allow server-side revocation and quick invalidation when compromise suspected.
*/

/* ===========================================================================
📌 3. HIGH-LEVEL FLOW (simple)
===============================================================================
1) User logs in → server returns { accessToken, refreshToken, expiresIn }.  
2) Client stores accessToken in memory and refreshToken in secure storage.  
3) Client attaches accessToken to API requests.  
4) On 401 / token expiry, client calls refresh endpoint with refreshToken.  
5) Server validates and returns new accessToken (and optionally a new refreshToken).  
6) Client updates in-memory accessToken and replaces stored refreshToken (if rotated).  
7) On logout or refresh failure, client clears tokens and forces login.
*/

/* ===========================================================================
📌 4. STORAGE & SAFE HANDLING (client)
===============================================================================
- Access token: keep in memory (avoid AsyncStorage). If you persist, keep very short TTL and encrypt.  
- Refresh token: must be stored in secure OS storage:
  • iOS Keychain (react-native-keychain)  
  • Android Keystore + EncryptedSharedPreferences or encrypted MMKV  
- Never log tokens or include them in error messages.
*/
import * as Keychain from "react-native-keychain";
// Example helpers (single-file)
const REFRESH_TOKEN_KEY = "refresh_token_v1";

export async function saveRefreshToken(token) {
  await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getRefreshToken() {
  const cred = await Keychain.getGenericPassword();
  if (cred && cred.username === REFRESH_TOKEN_KEY) return cred.password;
  return null;
}

export async function clearRefreshToken() {
  await Keychain.resetGenericPassword();
}

/* ===========================================================================
📌 5. CLIENT IMPLEMENTATION DETAILS (axios example)
===============================================================================
- Use axios request interceptor to attach access token.
- Use response interceptor to handle 401 and retry after refreshing.
- Use a refresh queue so only one refresh request runs at a time (avoid race).
- Replace refresh token if server rotates it.
*/

import axios from "axios";

/* In-memory tokens */
let inMemoryAccessToken = null;
let accessTokenExpiry = null; // optional epoch ms

export function setAccessToken(token, expiresInSec = null) {
  inMemoryAccessToken = token;
  accessTokenExpiry = expiresInSec ? Date.now() + expiresInSec * 1000 : null;
}

export function clearAccessToken() {
  inMemoryAccessToken = null;
  accessTokenExpiry = null;
}

export function getAccessToken() {
  return inMemoryAccessToken;
}

export function isAccessTokenExpiringSoon(bufferMs = 10000) {
  if (!accessTokenExpiry) return false;
  return Date.now() + bufferMs >= accessTokenExpiry;
}

/* axios instance */
export const apiClient = axios.create({
  baseURL: "https://api.example.com",
  timeout: 15000,
});

/* Refresh control state */
let isRefreshing = false;
let refreshPromise = null;
let requestQueue = []; // queued requests while refresh in progress

function enqueueRequest(p) {
  requestQueue.push(p);
}
function processQueue(error, token = null) {
  requestQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      resolve(apiClient.request(config));
    }
  });
  requestQueue = [];
}

/* Low-level refresh call - use raw axios instance to avoid interceptor loop */
async function callRefreshEndpoint(refreshToken) {
  // Use a fresh axios instance without interceptors
  const plain = axios.create({
    baseURL: "https://api.example.com",
    timeout: 15000,
  });
  const resp = await plain.post("/auth/refresh", { refreshToken });
  return resp.data; // expected { accessToken, refreshToken?, expiresIn }
}

/* refreshTokens: reads refresh token from secure store and calls server */
async function refreshTokens() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const data = await callRefreshEndpoint(refreshToken);
  // On success: server may return new refreshToken (rotate-on-refresh)
  if (data.refreshToken) {
    await saveRefreshToken(data.refreshToken);
  }
  // Set new access token in memory
  setAccessToken(data.accessToken, data.expiresIn || null);
  return data.accessToken;
}

/* Request interceptor - attach access token */
apiClient.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

/* Response interceptor - handle 401 and queue requests during refresh */
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalReq = error.config;
    if (!originalReq || originalReq._retry) return Promise.reject(error);

    if (error.response && error.response.status === 401) {
      originalReq._retry = true;

      // if refresh already running -> queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          enqueueRequest({ resolve, reject, config: originalReq })
        );
      }

      // Start refresh
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          const newAccess = await refreshTokens();
          processQueue(null, newAccess);
          return newAccess;
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          // On refresh failure: cleanup & force logout
          await handleLogoutCleanup();
          throw refreshErr;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      try {
        const newToken = await refreshPromise;
        originalReq.headers.Authorization = `Bearer ${newToken}`;
        return apiClient.request(originalReq);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

/* ===========================================================================
📌 6. INITIALIZATION & APP START (rehydrate session)
===============================================================================
- On app start, try to restore session by checking refresh token and refreshing once.
- This avoids showing login screen if token still valid.
*/
export async function initializeSession() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    await refreshTokens();
    return true;
  } catch (e) {
    // refresh failed, clear local tokens
    await handleLogoutCleanup();
    return false;
  }
}

/* ===========================================================================
📌 7. LOGOUT & REVOKE (client + server)
===============================================================================
- On logout: call server revoke endpoint (best-effort), clear secure storage, clear memory.
- Server should revoke refresh token and mark session as invalid.
*/
export async function handleLogoutCleanup() {
  try {
    const stored = await getRefreshToken();
    if (stored) {
      // Use plain axios to avoid interceptor loops
      await axios.post("https://api.example.com/auth/logout", {
        refreshToken: stored,
      });
    }
  } catch (e) {
    // ignore network errors but still clear local tokens
  } finally {
    await clearRefreshToken();
    clearAccessToken();
  }
}

/* ===========================================================================
📌 8. REFRESH TOKEN ROTATION & REUSE DETECTION (server responsibilities)
===============================================================================
- Rotate-on-refresh:
  • When server accepts a refreshToken, issue a new refreshToken and mark the old one used.
  • Store refresh token state server-side (DB) with status: active / used / revoked / expired.
- Replay detection:
  • If an old (previously-rotated) refreshToken is presented, the server treats it as reuse -> revoke all sessions and require re-auth.
- Benefits:
  • Limits usefulness of a stolen refresh token (single-use).
  • Detects theft if attacker tries to replay a token.
*/

/* ===========================================================================
📌 9. SERVER-SIDE SAMPLE (conceptual pseudo)
===============================================================================
/* Pseudocode (Node.js-like) – do not copy-paste for prod */
//
// POST /auth/refresh
// body: { refreshToken }
// returns: { accessToken, refreshToken (new), expiresIn }
//
// Server steps:
// 1) Validate refreshToken signature & lookup DB record.
// 2) If token not found or status != active -> if found as used -> mark compromise -> revoke all sessions -> return 401.
// 3) If valid -> issue new access token and new refresh token (rotate).
// 4) Mark current refresh token as used (one-time) and store new refresh token active.
// 5) Return new tokens to client.
//

/* ===========================================================================
📌 10. EDGE CASES & PRACTICAL THINGS (beginner-friendly)
===============================================================================
- Simultaneous refresh requests: handled by client queue (only one refresh call).  
- Offline: if refresh fails due to network, show friendly UI and let user retry.  
- Expired refresh token: force full login.  
- Multiple devices: each device has its own refresh token record on server (per-device binding).  
- Token revocation: admin can revoke session server-side; client must handle 401 and redirect to login.  
- Token binding to device: store device fingerprint (hashed) along with refresh token on server to limit misuse.
*/

/* ===========================================================================
📌 11. BACKGROUND REFRESH (optional optimization)
===============================================================================
- If access token is near expiry and app is active, proactively refresh in background to avoid 401 during user actions.
- Use isAccessTokenExpiringSoon() helper and trigger refreshPromise flow (reuse same queue).
- Do not refresh too often; respect rate limits.
*/

/* ===========================================================================
📌 12. TESTING (what to test)
===============================================================================
Unit tests:
  - Mock axios and test interceptor flow: successful refresh then retry original request.
  - Test queued requests: two parallel 401 triggers should result in single refresh call.
Integration:
  - Simulate refresh token rotation response and confirm client replaces stored refresh token.
E2E:
  - Test fresh login -> network offline -> token refresh failure -> app shows login.
Security tests:
  - Simulate replayed refresh token behavior using server and ensure server revokes sessions.
*/

/* ===========================================================================
📌 13. MONITORING & ALERTS (server)
===============================================================================
- Log refresh events: success, failure, reuse detection, revoke.
- Alert on spikes of refresh reuse (possible breach).
- Provide admin tools to revoke sessions and force logout.
*/

/* ===========================================================================
📌 14. COMMON MISTAKES (avoid these)
===============================================================================
✘ Storing refresh tokens in AsyncStorage or plain files.  
✘ Allowing multiple refresh tokens to remain valid forever (no rotation).  
✘ Not handling race conditions — multiple refresh calls causing inconsistent state.  
✘ Logging tokens in telemetry or errors.  
✘ Not allowing user to revoke sessions or see active devices.
*/

/* ===========================================================================
📌 15. CHECKLIST — QUICK (for implementation)
===============================================================================
✔ Access token in memory only (or minimal TTL if persisted)  
✔ Refresh token in Keychain/Keystore / Encrypted storage  
✔ Axios interceptor with refresh queue to avoid race conditions  
✔ Refresh rotation on server (issue new refreshToken on each refresh)  
✔ Replay detection server-side (revoke on reuse)  
✔ Revoke endpoint & logout flow implemented  
✔ Init flow: try refresh on app start (rehydrate session)  
✔ Tests for queue, rotation, and failure paths  
✔ Monitoring & alerting for refresh anomalies
*/

/* ===========================================================================
📌 16. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: Why keep access token in memory and refresh token in secure storage?  
A: Access token is short-lived and safer in memory; refresh token is long-lived and must be protected by OS secure storage.

Q2: What is refresh token rotation?  
A: Issue a new refresh token every time you use an old one; mark old one used. This makes stolen tokens single-use and detectable.

Q3: How do you prevent multiple refresh calls from firing at once?  
A: Implement a refresh queue / mutex on the client so only one refresh request runs; other requests wait and then retry.

Q4: What should server do if a refresh token is replayed?  
A: Treat it as a possible compromise: revoke all related refresh tokens/sessions and force re-authentication for the user.

Q5: Should refresh tokens be revocable?  
A: Yes. Server should store refresh token state so admin or automated systems can revoke a token and block usage immediately.
*/

/* ===========================================================================
📌 17. OPTIONAL: SHORT SAMPLE UX FLOW (client)
===============================================================================
- Normal: user opens app → initializeSession() refreshes tokens → show main UI.  
- During use: API call returns 401 → interceptor triggers refresh → requests resume.  
- On refresh failure: show login screen with message "Session expired — please sign in again."  
- User manually logs out: call handleLogoutCleanup() to revoke tokens and clear storage.
*/

/* ===========================================================================
📌 18. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Use short-lived access tokens + secure refresh tokens.  
2) Store refresh token in Keychain / Keystore. 3) Use axios interceptor + refresh queue to handle 401s safely.  
4) Server must rotate refresh token on each refresh and detect reuse.  
5) Provide revoke endpoint & clear local tokens on logout.  
6) Test queue behavior and rotation flows. 7) Monitor refresh events and alert on anomalies.
*/

/* ===========================================================================
📌 19. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Full server-side implementation: refresh token DB schema + rotate/reuse detection (Node/Express + pseudo SQL)  
  ✅ Advanced client: proactive background refresh + per-device binding + PIN/biometric-protected refresh token usage  
  ✅ Secure refresh flow with App Attest / Play Integrity integration (server validation + client example)
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
