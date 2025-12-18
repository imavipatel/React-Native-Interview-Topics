/**
 * react-native-app-security-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How I would secure a mobile application built with React Native"
 *
 * - Very simple language for beginners
 * - Full coverage: threat model, data protection, auth, network, storage,
 *   native hardening, CI/CD, monitoring, testing, and checklist
 * - Practical tips, code examples, and interview Q&A
 *
 * Copy-paste into your notes repo and adapt to your project.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Make the app safe for users: protect user data, stop attackers, and reduce risks.
*/

/* ===========================================================================
📌 1. THINK LIKE AN ATTACKER (THREAT MODEL)
===============================================================================
Before securing the app, ask:
  • What data is sensitive? (passwords, tokens, PII, payment info)
  • Where is the data stored? (device, backend, cache)
  • What operations are risky? (auth, payments, file export)
  • What attackers can do? (network sniffing, device compromise, API abuse)

Write a short threat model list for your app — this guides all security choices.
*/

/* ===========================================================================
📌 2. NETWORK SECURITY (DATA IN TRANSIT)
===============================================================================
Always assume networks are unsafe (Wi-Fi, mobile networks).

Rules (simple):
  ✔ Use HTTPS (TLS) for all API calls
  ✔ Enforce TLS 1.2+ on server and client
  ✔ Use strong ciphers on server
  ✔ Validate server certificates properly
  ✔ Use certificate pinning for very sensitive apps (prevents MITM)
  ✔ Use HSTS on server and avoid mixed content

Practical: Use a secure HTTP client (axios/fetch) and reject invalid certs.
Example: axios instance with timeout + no auto-redirect (simple)
*/
import axios from "axios";
export const apiClient = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
});
// Add auth header interceptor (example)
apiClient.interceptors.request.use((config) => {
  // const token = await secureStore.getToken() -- use sync-safe patterns or token in memory
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/*
Certificate pinning (concept):
 - Use a native library or platform-specific config (Android okhttp, iOS NSURLSession)
 - Or use community libs that wrap native pinning.
 - Keep pin list updatable (server rotation plan).
*/

/* ===========================================================================
📌 3. AUTHENTICATION & SESSIONS
===============================================================================
Best practices:
  ✔ Use OAuth2 / OpenID Connect or secure token flow (backend issues access tokens)
  ✔ Use short-lived access tokens + long-lived refresh tokens
  ✔ Store tokens in secure storage (Keychain / Android Keystore / MMKV encrypted)
  ✔ Use a refresh token flow on backend with rotate-on-refresh & revoke support
  ✔ Protect refresh tokens with extra checks (device bind, fingerprint)
  ✔ Logout and revoke tokens on sign-out

Do NOT store tokens in AsyncStorage or plain storage for sensitive tokens.
Use secure libraries like react-native-keychain / react-native-sensitive-info / MMKV with encryption.
*/

/* ===========================================================================
📌 4. SECURE STORAGE (DATA AT REST)
===============================================================================
Where to store secrets and sensitive data:

Options:
  - iOS Keychain (secure)
  - Android Keystore + EncryptedSharedPreferences or MMKV with encryption
  - Encrypted DB (SQLCipher, Realm encryption)
  - Files in app-private storage (encrypt them first)

Example approach (conceptual):
  - Use react-native-keychain to store refresh token
  - Use encrypted storage for cached user info
  - Do not save raw passwords or long-lived secrets in plain files
*/

/* ===========================================================================
📌 5. INPUT VALIDATION & SANITATION
===============================================================================
Never trust input (even from app UI).

Rules:
  ✔ Validate on server side always (primary)
  ✔ Validate on client for UX and quick checks
  ✔ Avoid eval, new Function, or executing user-supplied code
  ✔ Escape outputs if injecting into webviews or native components

If you show HTML: sanitize it before rendering (avoid XSS).
*/

/* ===========================================================================
📌 6. PROTECTING THE JS BUNDLE & CODE
===============================================================================
JS code is visible on device and can be inspected. Mitigations:

  ✔ Minify & obfuscate JS (metro minifier, terser)
  ✔ Use Hermes (bytecode) + precompile (makes reverse engineering harder)
  ✔ Remove debug flags and dev tools from release (no Flipper)
  ✔ Avoid including secret keys in JS; put secrets on server
  ✔ Split sensitive logic to native where appropriate (but native is also reverse-engineerable)

Remember: obfuscation slows attackers but does not make code impossible to reverse.
Treat sensitive logic as requiring server-side enforcement.
*/

/* ===========================================================================
📌 7. NATIVE HARDENING (ANDROID & iOS)
===============================================================================
Android:
  ✔ Enable ProGuard/R8 to shrink & obfuscate Java/Kotlin code
  ✔ Enable Android App Bundle (AAB) and resource shrinking
  ✔ Use Network Security Config for pinning & TLS settings
  ✔ Use SafetyNet / Play Integrity for device attestation (check for rooted devices)
iOS:
  ✔ Enable bitcode (if using) and strip debug symbols
  ✔ Use device attestation (DeviceCheck / App Attest)
  ✔ Avoid storing secrets in plist

Both:
  ✔ Code sign properly and manage keys in a secure place (CI secrets)
  ✔ Use secure key management for native keystores and certificates
*/

/* ===========================================================================
📌 8. DETECTION: ROOT / JAILBREAK & EMULATOR CHECKS
===============================================================================
Consider detecting compromised devices if your app is sensitive.

Options:
  - Root/Jailbreak detection libraries (react-native-root-detection, custom checks)
  - Check for common jailbreak files, writable system dirs, su binary
  - Check for debuggers attached or modified runtime

Important:
  - Detection can be bypassed by determined attackers
  - Use detection as additional signal, not the only protection
  - Combine with server-side attestation (Play Integrity, App Attest)
*/

/* ===========================================================================
📌 9. SECURE COMMUNICATION WITH BACKEND
===============================================================================
On the server side (must do, backend team):
  ✔ Validate tokens on each request
  ✔ Rate-limit suspicious endpoints
  ✔ Use per-device binding for sensitive tokens
  ✔ Implement idempotency for critical endpoints
  ✔ Log and alert on unusual behavior (many failed logins, token reuse)
  ✔ Support token revocation & rotation

Client + server together protect the app; rely on server as source of truth.
*/

/* ===========================================================================
📌 10. SANDBOXING & PERMISSIONS
===============================================================================
Limit app permissions to only those needed:
  ✔ Request permissions only when needed (ask at time of use)
  ✔ Explain why permission is needed (privacy)
  ✔ Revoke / reduce permissions in settings if not needed

Avoid broad permissions like background location unless necessary.
*/

/* ===========================================================================
📌 11. SECURE USE OF WEBVIEW
===============================================================================
WebViews are a common attack surface.

Rules:
  ✔ Disable JavaScript injection when not needed
  ✔ Use origin checks and postMessage validation
  ✔ Enable safe browsing flags
  ✔ Avoid exposing native bridges to untrusted web content

If showing remote content, ensure it's from trusted sources only.
*/

/* ===========================================================================
📌 12. LOGGING & ERROR HANDLING (DOs & DON’Ts)
===============================================================================
DO:
  ✔ Log non-sensitive telemetry (events, flow times, error codes)
  ✔ Sanitize logs (no PII, no tokens)
  ✔ Send logs to secure backend (Sentry, analytics) with user consent where needed

DON'T:
  ✘ Log secrets, tokens, or passwords
  ✘ Include personal data in crash reports without consent
*/

/* ===========================================================================
📌 13. DEPENDENCY & SUPPLY CHAIN SAFETY
===============================================================================
Third-party libs can be risky.

Rules:
  ✔ Audit dependencies regularly (npm audit, Snyk, Dependabot)
  ✔ Use only well-maintained libraries
  ✔ Pin dependency versions in CI builds
  ✔ Avoid running untrusted scripts during build

Keep native libs up-to-date and test after upgrades.
*/

/* ===========================================================================
📌 14. CI/CD & SECRETS MANAGEMENT
===============================================================================
Protect signing keys and environment variables:

  ✔ Store secrets in CI secret manager (GitHub Actions secrets, Bitrise secret env)
  ✔ Use Fastlane with encrypted environment for signing
  ✔ Never commit .keystore, .p12, or .env with secrets to repo
  ✔ Rotate keys if compromised
  ✔ Use separate credentials for staging & production

Ensure CI runs lint, tests, static-analysis and security scanning before release.
*/

/* ===========================================================================
📌 15. USER AUTH FLOW (EXAMPLE SECURE DESIGN)
===============================================================================
1) User logs in → app sends credentials over TLS to backend
2) Backend verifies -> returns short-lived access token + refresh token
3) Access token stored in memory (or secure store if needed) and used for API calls
4) Refresh token stored in Keychain/Keystore (secure storage)
5) On token expiry -> refresh flow uses refresh token to get new access token
6) Backend enforces refresh rotation and issues new refresh token; old refresh tokens invalidated
7) On logout -> app removes tokens and tells backend to revoke session
*/

/* ===========================================================================
📌 16. SECURE FILES & MEDIA (downloaded content)
===============================================================================
If you cache sensitive files (PDFs, statements):
  ✔ Store them in app-private directories (not world-readable)
  ✔ Encrypt files at rest before saving
  ✔ Delete files after use or after timeout
  ✔ Use secure viewers or native viewers that respect sandboxing
*/

/* ===========================================================================
📌 17. BACKGROUND TASKS & SENSITIVE WORK
===============================================================================
Background tasks (sync, uploads) should respect security:
  ✔ Run only when network is secure (optional)
  ✔ Use short-lived credentials (rotate tokens)
  ✔ Use WorkManager (Android) / BGTasks (iOS) with secure context
  ✔ Clean up credentials after task finishes
*/

/* ===========================================================================
📌 18. RATE LIMITING, ABUSE & FINGERPRINTING
===============================================================================
Reduce automated abuse:
  ✔ Implement rate limits & throttling on server
  ✔ Add device fingerprinting (non-identifying) to correlate suspicious usage
  ✔ Use CAPTCHA / progressive challenges for suspicious flows
  ✔ Monitor and alert for anomalies
*/

/* ===========================================================================
📌 19. SECURE NATIVE MODULES (BRIDGES)
===============================================================================
If you implement native modules:
  ✔ Validate all input coming from JS in native code
  ✔ Avoid executing untrusted inputs (no eval)
  ✔ Do heavy cryptography in native (platform crypto APIs)
  ✔ Handle permissions & exceptions carefully
*/

/* ===========================================================================
📌 20. TESTING SECURITY (WHAT TO TEST)
===============================================================================
- Static analysis: linting and SAST tools
- Dependency scanning: npm audit / Snyk
- Dynamic analysis: fuzzing inputs, pen-testing
- Runtime checks: ensure secure storage works, certificates validated
- Attestation testing: simulate rooted/jailbroken devices
- E2E flow testing: login, logout, token revoke
- CI checks: ensure no test secrets leaked in artifacts
*/

/* ===========================================================================
📌 21. INCIDENT PLAN (BE PREPARED)
===============================================================================
Have a short plan:
  ✔ How to revoke tokens & block users
  ✔ How to revoke compromised keys (rotate)
  ✔ Contact list for infra & mobile teams
  ✔ Procedure to publish hotfix or require app update
  ✔ Post-incident communication template
*/

/* ===========================================================================
📌 22. SIMPLE CODE EXAMPLES (BEGINNER-FRIENDLY)
===============================================================================
A) Store refresh token using react-native-keychain (conceptual)
*/
import * as Keychain from "react-native-keychain";

export async function saveRefreshToken(token) {
  await Keychain.setGenericPassword("refreshToken", token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getRefreshToken() {
  const creds = await Keychain.getGenericPassword();
  if (creds) return creds.password;
  return null;
}

/*
B) Remove token on logout
*/
export async function clearTokens() {
  await Keychain.resetGenericPassword();
}

/* ===========================================================================
📌 23. CHECKLIST — QUICK (do this for every release)
===============================================================================
✔ HTTPS everywhere + strong TLS on server  
✔ Pin sensitive endpoints if needed  
✔ Secure storage for tokens (Keychain / Keystore)  
✔ Short-lived access tokens + refresh rotation  
✔ No secrets in JS bundle (config via server/CI)  
✔ ProGuard/R8 and strip symbols for native code  
✔ Remove dev tools & debug flags in release builds  
✔ Dependency audit & patch high-risk libs  
✔ Implement server-side checks (rate limit, token validation)  
✔ Test on rooted/jailbroken devices for detection & fail-safe behavior  
✔ Add telemetry & alerts for auth failures / anomalies  
*/

/* ===========================================================================
📌 24. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: Where to store refresh tokens on mobile?
A: Platform secure storage — iOS Keychain or Android Keystore (not AsyncStorage).

Q2: What is certificate pinning?
A: Pinning ensures the app trusts only specific server certificates or public keys, preventing man-in-the-middle attacks.

Q3: Is obfuscation enough to protect secrets?
A: No. Obfuscation helps deter attackers but you must keep secrets on the server and enforce security server-side.

Q4: How to detect jailbroken/rooted devices?
A: Use root/jailbreak detection libraries and device attestation services, but treat detection as advisory only.

Q5: How to handle leaked API keys?
A: Revoke keys, rotate credentials, investigate scope of leak, and push updated config/keys to users via server/CI.

Q6: Should I encrypt local files?
A: Yes for sensitive data. Use platform crypto or encrypted DBs (SQLCipher, Realm with encryption).
*/

/* ===========================================================================
📌 25. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Use HTTPS + TLS 1.2+ and validate certs  
2) Store tokens in secure storage (Keychain/Keystore)  
3) Use short-lived access tokens + refresh rotation  
4) Pin certificates for highly sensitive apps  
5) Obfuscate & precompile JS (Hermes) but keep secrets on server  
6) Harden native builds (ProGuard/R8, strip symbols)  
7) Audit dependencies & CI secrets  
8) Detect compromised devices and combine with server attestation  
9) Encrypt files at rest and limit permissions  
10) Test, monitor, and have an incident response plan
*/

/* ===========================================================================
📌 26. WANT NEXT?
===============================================================================
I can provide in the same simple notes format:
  ✅ Example implementation: secure login + token refresh flow (full code)
  ✅ Step-by-step guide to implement certificate pinning (Android/iOS examples)
  ✅ Root/Jailbreak detection code + server attestation integration
  ✅ CI pipeline example for secure signing and secret rotation

Tell me which one you want and I’ll produce it in this same beginner-friendly single-file JS Notes format.
*/
