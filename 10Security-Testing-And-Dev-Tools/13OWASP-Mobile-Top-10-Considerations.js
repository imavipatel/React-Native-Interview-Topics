/********************************************************************
 * 📘 OWASP Mobile Top 10 Considerations (2023/2024)
 * - OWASP = Open Web Application Security Project
 * - Provides guidelines for the **Top-10 risks in mobile applications**.
 * - Following these helps improve security posture of mobile apps.
 ********************************************************************/

/********************************************
 * 🔟 OWASP Mobile Top 10 Risks
 ********************************************/
/**
 * 1️⃣ M1: Improper Platform Usage
 *    - Misusing iOS/Android platform features.
 *    - Examples:
 *      ❌ Storing sensitive data in SharedPreferences/UserDefaults
 *      ❌ Ignoring platform permissions model
 *    - Mitigation:
 *      ✅ Use Secure Storage (Keychain/Keystore)
 *      ✅ Follow Android/iOS security best practices
 *      ✅ Use platform APIs correctly (Clipboard, Camera, etc.)
 *    - 📦 RN Tools:
 *      → react-native-keychain
 *      → expo-secure-store
 *
 * 2️⃣ M2: Insecure Data Storage
 *    - Storing sensitive data insecurely → attackers can extract data.
 *    - Examples:
 *      ❌ Tokens/passwords in AsyncStorage or SQLite in plaintext
 *    - Mitigation:
 *      ✅ Use Encrypted-Storage, SecureStore, MMKV (encrypted mode)
 *      ✅ Encrypt data before saving (AES-256, libsodium)
 *    - 📦 RN Tools:
 *      → react-native-encrypted-storage
 *      → react-native-mmkv
 *
 * 3️⃣ M3: Insecure Communication
 *    - Data intercepted during transmission.
 *    - Examples:
 *      ❌ Using HTTP instead of HTTPS
 *      ❌ Not validating SSL certificates
 *    - Mitigation:
 *      ✅ Always use HTTPS/TLS 1.2+
 *      ✅ Implement Certificate Pinning (TrustKit, react-native-pinch)
 *      ✅ Disable cleartext traffic (Android Manifest)
 *    - 📦 RN Tools:
 *      → react-native-pinch (SSL Pinning)
 *      → axios + httpsAgent config
 *
 * 4️⃣ M4: Insecure Authentication
 *    - Weak or broken authentication implementation.
 *    - Examples:
 *      ❌ Storing JWT in AsyncStorage → stolen via XSS/injection
 *      ❌ No session timeout / re-authentication
 *    - Mitigation:
 *      ✅ Use OAuth2 / OpenID Connect flows
 *      ✅ Store tokens securely (SecureStore/Keychain)
 *      ✅ Enforce biometric/pin re-auth for sensitive actions
 *    - 📦 RN Tools:
 *      → react-native-app-auth
 *      → expo-local-authentication
 *
 * 5️⃣ M5: Insufficient Cryptography
 *    - Weak/insecure cryptographic usage.
 *    - Examples:
 *      ❌ Using MD5/SHA1 for password hashing
 *      ❌ Hardcoding encryption keys in app
 *    - Mitigation:
 *      ✅ Use strong algorithms (AES-256, SHA-256, PBKDF2, Argon2)
 *      ✅ Use platform Keychain/Keystore for key management
 *      ✅ Don’t hardcode secrets → use env variables / remote config
 *    - 📦 RN Tools:
 *      → react-native-simple-crypto
 *      → libsodium.js
 *
 * 6️⃣ M6: Insecure Authorization
 *    - Not properly validating user permissions.
 *    - Examples:
 *      ❌ Client-only role enforcement
 *      ❌ API accepts requests without server-side access control
 *    - Mitigation:
 *      ✅ Always enforce authorization on the server
 *      ✅ Use role-based access control (RBAC) or ABAC
 *      ✅ Validate JWT claims on backend
 *    - 📦 RN Tools:
 *      → redux / zustand for role management (frontend)
 *      → backend validation libraries
 *
 * 7️⃣ M7: Client Code Quality
 *    - Poor coding practices → exploitable vulnerabilities.
 *    - Examples:
 *      ❌ Hardcoded API keys in JS bundle
 *      ❌ Using eval(), insecure dynamic code execution
 *    - Mitigation:
 *      ✅ Use ESLint, TypeScript for safer code
 *      ✅ Apply ProGuard/R8, Hermes minification
 *      ✅ Don’t expose secrets in source
 *    - 📦 RN Tools:
 *      → babel-plugin-transform-remove-console
 *      → react-native-dotenv
 *
 * 8️⃣ M8: Code Tampering
 *    - Attackers modifying app code.
 *    - Examples:
 *      ❌ Reverse engineering APK/IPA, injecting malicious code
 *    - Mitigation:
 *      ✅ Enable ProGuard/R8 (Android), Bitcode/strip symbols (iOS)
 *      ✅ Use Code Obfuscation & Integrity Checks
 *      ✅ Detect tampering at runtime (checksum validation)
 *    - 📦 RN Tools:
 *      → react-native-fs (checksum validation)
 *      → ProGuard/R8 configs
 *
 * 9️⃣ M9: Reverse Engineering
 *    - Attackers decompile app to understand internals.
 *    - Examples:
 *      ❌ Extracting API endpoints, business logic
 *    - Mitigation:
 *      ✅ Obfuscate Java/Kotlin/JS code
 *      ✅ Encrypt sensitive assets (strings, config)
 *      ✅ Use JSI/Native code for sensitive logic instead of JS
 *    - 📦 RN Tools:
 *      → hermes (compiled bytecode)
 *      → proguard / R8 obfuscation
 *
 * 🔟 M10: Extraneous Functionality
 *    - Debug/test code left in production.
 *    - Examples:
 *      ❌ Debug logs exposing sensitive info
 *      ❌ Hidden endpoints or admin screens in production
 *    - Mitigation:
 *      ✅ Strip debug logs in release builds
 *      ✅ Use environment-based feature toggles
 *      ✅ Security review before production release
 *    - 📦 RN Tools:
 *      → babel-plugin-transform-remove-console
 *      → react-native-config
 */

/********************************************
 * 🔍 Best Practices for OWASP in React Native
 ********************************************/
/**
 * - Secure Data:
 *   → Never store tokens in AsyncStorage (use Keychain/SecureStore).
 * - Network Security:
 *   → Enforce HTTPS, add SSL Pinning.
 * - Authentication:
 *   → Use short-lived tokens + refresh mechanism.
 * - Logging:
 *   → Remove debug logs in production (console.log, Flipper).
 * - Obfuscation:
 *   → Use ProGuard/R8 (Android), enable Hermes, JS minification.
 * - Permissions:
 *   → Request only required permissions, and explain usage.
 * - Tamper Detection:
 *   → Add Root/Jailbreak detection (e.g., jail-monkey).
 * - Dependency Security:
 *   → Regularly audit dependencies (npm audit, Snyk).
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: How is OWASP Mobile Top 10 different from Web Top 10?
 *   → Mobile-specific risks: secure storage, reverse engineering, root detection.
 *
 * Q2: What’s the most common OWASP issue in RN apps?
 *   → Insecure Data Storage (tokens in AsyncStorage).
 *
 * Q3: How do you mitigate reverse engineering?
 *   → Obfuscation, Hermes, move logic to native/JSI modules.
 *
 * Q4: Why is SSL pinning important?
 *   → Prevents MITM (Man-in-the-Middle) attacks even if user trusts bad certs.
 */
