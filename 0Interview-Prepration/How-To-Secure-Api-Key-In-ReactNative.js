/**
 * react-native-secure-api-key-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How to store & protect API keys on the frontend (React Native)
 *  — practical patterns, why some approaches are unsafe, and concrete implementations"
 *
 * - Very simple language for beginners
 * - Full coverage: threat model, recommended architectures, code examples (Keychain),
 *   proxy/server-side approaches, CI handling, obfuscation, app attestation, checklist, Q&A
 * - Everything in one single-file JS notes format (copy-paste into your notes repo)
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Never put long-lived secrets in the app; if you must store secrets, store them
in platform secure storage and minimize exposure with short-lived tokens + server-side controls.
*/

/* ===========================================================================
📌 1. THREAT MODEL (very simple)
===============================================================================
Who/what can steal an API key from an app?
  • Someone with physical device access (rooted/jailbroken)  
  • A malicious app or process on the device  
  • Reverse-engineer the app bundle / decompile the APK/IPA  
  • Network eavesdroppers (if TLS is not enforced)  
  • CI logs / accidentally committed keys in repo

What can an attacker do with a stolen key?
  • Make API calls as your app (fraud, charge costs)  
  • Read or modify user data on backend (if API lacks checks)  
  • Exfiltrate data or escalate attacks
*/

/* ===========================================================================
📌 2. MAIN RULE (simple)
===============================================================================
Frontend = untrusted. Do not treat any secret in the app as fully secret.
Design your system so the backend holds the real secret and the frontend gets
short-lived credentials or uses safe flows that do not expose secrets.
*/

/* ===========================================================================
📌 3. SAFE ARCHITECTURES (ranked best → less safe)
===============================================================================
1) **Backend Proxy / Token Minting (BEST)**  
   - Backend stores the sensitive API key / service credential.  
   - Frontend authenticates to backend (user login, device token).  
   - Backend calls third-party API or mints a short-lived token for the app.  
   - Frontend never sees the long-lived secret.

2) **Short-lived client tokens (recommended if proxy possible)**  
   - Backend returns short-lived signed tokens (JWT/HMAC) scoped to user & action.  
   - Tokens expire quickly (minutes). Revokeable.

3) **App Attestation + Backend (strong)**  
   - Use Play Integrity / App Attest to ensure requests come from genuine app instances.  
   - Backend allows sensitive ops only if attestation proof checks pass.

4) **Secure storage in app for non-sensitive keys (acceptable with caveats)**  
   - Store in Keychain (iOS) or Android Keystore / EncryptedSharedPreferences / MMKV-Encryption.  
   - Only for keys that MUST live on device and with short TTL and limited scope.

5) **Embed & obfuscate (LAST RESORT, not recommended)**  
   - Obfuscation slows but does not prevent extraction. Use only for low-risk keys.
*/

/* ===========================================================================
📌 4. WHY NOT JUST PUT API KEY IN JS / .env or AsyncStorage?
===============================================================================
- JS bundle is easy to extract from app package (APK/IPA).  
- .env or config files in repo can be leaked.  
- AsyncStorage is plain-text and readable on rooted devices.  
- Any static secret in app is effectively public to a determined attacker.
*/

/* ===========================================================================
📌 5. RECOMMENDED PATTERN — BACKEND PROXY (detailed)
===============================================================================
1) Frontend authenticates user (username/password / OAuth).  
2) Frontend calls your backend with user token.  
3) Backend validates user & issues a short-lived token scoped to the API (or proxies the request).  
4) Frontend uses short-lived token for API requests. Backend uses stored secret to call third-party service.

Benefits:
  • Real secrets never reach device.  
  • Backend enforces rate limits, scopes, logging, revocation.  
  • Faster response to compromise (rotate secret server-side).
*/

/* ===========================================================================
📌 6. EXAMPLE: SIMPLE PROXY FLOW (conceptual)
===============================================================================
/* Backend pseudo-code (Node.js/Express) */
//
// POST /api/proxy/thirdparty
// - Backend holds THIRD_PARTY_API_KEY in env (never in repo).
// - Backend forwards request to third party and returns result.
//

// server.js (conceptual)
const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

app.post("/api/proxy/thirdparty", async (req, res) => {
  // 1) Authenticate & authorize the user / device
  const user = authenticate(req); // your auth logic
  if (!user) return res.status(401).send("unauthorized");

  // 2) Optionally check device attestation or user rate limits
  // checkAttestation(req.body.attestation);

  // 3) Call third-party using server-side secret
  const response = await fetch("https://thirdparty.example.com/data", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.THIRD_PARTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body.payload),
  });

  const data = await response.json();
  res.json(data);
});

/* Frontend uses your backend endpoint, not the third-party API directly. */

/* ===========================================================================
📌 7. SHORT-LIVED TOKENS (minting example)
===============================================================================
- Backend mints a short-lived token (e.g., JWT with small TTL) that is allowed for limited usage.
- Example TTL: 5–15 minutes. Token bound to user/device and can be revoked.

Benefits:
  • Even if token is stolen, its lifetime is short.  
  • You can scope tokens to specific endpoints/actions.
*/

/* ===========================================================================
📌 8. IMPLEMENTATION: MOBILE SECURE STORAGE (Keychain example)
===============================================================================
Use secure platform storage for any secret that must live on device (refresh tokens,
device-specific keys). Example with react-native-keychain.

Install:
  yarn add react-native-keychain

Code:
*/
import * as Keychain from "react-native-keychain";

/** Save a token securely (example: store short-lived token or device-key) */
export async function saveTokenSecurely(token) {
  await Keychain.setGenericPassword("app-token", token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

/** Read token */
export async function getTokenSecurely() {
  const creds = await Keychain.getGenericPassword();
  if (creds) return creds.password;
  return null;
}

/** Remove token */
export async function clearTokenSecurely() {
  await Keychain.resetGenericPassword();
}

/* ===========================================================================
📌 9. EXAMPLE: axios interceptor using short-lived token
===============================================================================
import axios from 'axios';

const api = axios.create({ baseURL: 'https://api.example.com' });

api.interceptors.request.use(async (config) => {
  const token = await getTokenSecurely(); // from Keychain
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ===========================================================================
📌 10. APP ATTESTATION / DEVICE PROOF (strong protection)
===============================================================================
- Use Play Integrity API (Android) and App Attest / DeviceCheck (iOS).
- Flow:
  1) App requests attestation from OS provider.
  2) Attestation proof sent to backend.
  3) Backend verifies proof with platform service, then allows sensitive action or mints token.

Benefits:
  • Backend only trusts requests from genuine, unmodified apps on real devices.
  • Helps prevent automated abuse and fake clients.
*/

/* ===========================================================================
📌 11. ADDITIONAL LAYERS TO REDUCE RISK
===============================================================================
• **Rate limiting & usage quotas**: limit damage of stolen credentials.  
• **IP reputation & geo checks**: flag odd requests.  
• **Short TTL & rotation**: rotate keys frequently server-side.  
• **Scopes**: create keys with minimal required permissions.  
• **Monitoring & alerts**: unusual spikes, new client IDs, many failures.  
• **HMAC/signing**: instead of sending secret, sign payloads on server and validate.  
• **mTLS**: mutual TLS is strong but harder for mobile clients and certificate management.
*/

/* ===========================================================================
📌 12. LEAST-PRIVILEGE API KEYS (practical)
===============================================================================
- Create API keys with minimal permissions (read-only, per-feature).  
- Use different keys for dev/staging/prod and keep them separate.  
- For third-party services, restrict keys by referrer, IP, or allowed endpoints if provider supports it.
*/

/* ===========================================================================
📌 13. WHAT ABOUT JS OBFUSCATION?
===============================================================================
- Obfuscation (minify + JS obfuscator) only raises the bar slightly.  
- It **does not** prevent extraction on rooted/jailbroken devices.  
- Use obfuscation only as extra delay, not as a primary defense.
*/

/* ===========================================================================
📌 14. HANDLING EMBEDDED KEYS (if absolutely necessary)
===============================================================================
If you cannot avoid storing a key on device (rare), follow strict rules:
  • Make the key read-only & minimal-scope.  
  • Store in native secure storage (Keychain/Keystore).  
  • Use native code (NDK) to access and avoid exposing in JS when possible.  
  • Use app attestation + backend verification before allowing sensitive ops.  
  • Log & monitor all uses and rotate key on suspicious activity.
*/

/* ===========================================================================
📌 15. CI / REPO PRACTICES (must do)
===============================================================================
• Never commit secrets to repo. Use .gitignore for env files.  
• Store secrets in CI secret manager (GitHub Actions secrets, Bitrise secrets, etc.).  
• Use ephemeral credentials for CI tasks when possible.  
• Scan repo history for leaked secrets (git-secrets, truffleHog).  
• Rotate secrets if leak suspected.
*/

/* ===========================================================================
📌 16. EXAMPLE: Minimal secure flow summary (recommended)
===============================================================================
1) User logs in on app → app sends credentials to YOUR backend.  
2) Backend verifies and runs attestation checks (opt).  
3) Backend mints short-lived token scoped to needed API operations (5-15m) and returns to app.  
4) App stores token in Keychain and uses it in API calls.  
5) Backend performs third-party calls or proxies requests using long-lived secret kept server-side.  
6) Monitor usage and revoke tokens if suspicious.
*/

/* ===========================================================================
📌 17. CHECKLIST — QUICK (apply these)
===============================================================================
✔ Never embed production long-lived API keys in JS bundle.  
✔ Use backend proxy or mint short-lived scoped tokens.  
✔ Store any device tokens in Keychain/Keystore (react-native-keychain / Encrypted MMKV).  
✔ Use Play Integrity / App Attest when possible for sensitive operations.  
✔ Use TLS + certificate pinning to protect in-transit secrets.  
✔ Restrict API keys by scope and rotate regularly.  
✔ Keep secrets in CI secret manager and scan repo for leaks.  
✔ Monitor, alert & rate-limit usage.  
✔ Provide a revocation plan and emergency rotation.
*/

/* ===========================================================================
📌 18. SIMPLE INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: Can I store my API key in AsyncStorage or .env?  
A: No — AsyncStorage is not secure and .env files can be leaked. Use server-side storage or Keychain for device secrets.

Q2: What is the best way to protect keys for third-party APIs?  
A: Keep the key on your backend and proxy requests or mint short-lived tokens for the client.

Q3: What is a short-lived token and why use it?  
A: A token with small TTL (minutes). If stolen, it becomes useless quickly, limiting damage.

Q4: What is App Attest / Play Integrity?  
A: Platform services that verify the app & device are genuine and not tampered — helpful to trust client requests.

Q5: Is obfuscation sufficient security?  
A: No. Obfuscation only makes reverse-engineering harder but doesn't stop a determined attacker.
*/

/* ===========================================================================
📌 19. SMALL CODE SNIPPETS (single-file practical)
===============================================================================
/* A) Save short-lived token securely (Keychain)
*/
export async function storeShortLivedToken(token) {
  await Keychain.setGenericPassword("short_token", token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

/* B) Use backend proxy (frontend call example) */
export async function callProtectedApi(payload) {
  // call your backend, which proxies to third-party using server secret
  const token = await getTokenSecurely();
  const resp = await fetch("https://api.your-backend.com/proxy/thirdparty", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
  return resp.json();
}

/* C) Example: Request attestation proof to backend (conceptual)
   - Implementation differs per platform and SDK; backend validates attestation.
*/
export async function requestAttestationAndMint() {
  // 1) get attestation proof from platform (native SDK)
  const attestation = await getPlatformAttestation(); // native bridge
  // 2) send to backend with user auth
  const resp = await fetch("https://api.your-backend.com/auth/mint", {
    method: "POST",
    body: JSON.stringify({ attestation }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await resp.json();
  // 3) backend returns short-lived token if attestation valid
  await storeShortLivedToken(data.token);
  return data.token;
}

/* ===========================================================================
📌 20. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Frontend is untrusted — keep long-lived secrets on backend.  
2) Use backend proxy or mint short-lived scoped tokens for client.  
3) Store device tokens in Keychain / Android Keystore when needed.  
4) Use App Attest / Play Integrity to verify client authenticity.  
5) Use TLS + certificate pinning to secure transport.  
6) Restrict & rotate keys, monitor usage, and implement rate-limits.  
7) Avoid obfuscation as main defense; use it only as an extra layer.
*/

/* ===========================================================================
📌 21. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Full backend token-minting example (Node + Redis + JWT + revoke flow)  
  ✅ Play Integrity / App Attest integration notes with example server validation code  
  ✅ Exact Keychain + Encrypted MMKV hybrid example (store device key + refresh token + usage)
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
