/**
 * react-native-simbinding-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "SIM Binding — What it is, how it works, implementation details,
 *  behind-the-scenes, security & privacy, and best practices for mobile apps"
 *
 * - Very simple language for beginners
 * - Full coverage: concept, Android & iOS APIs, server design, detection,
 *   mitigation of SIM swap, privacy/permissions, code examples, tests, checklist, Q&A
 * - Everything in one file (single-file JS notes)
 *
 * NOTE: Platform APIs & Play Store policies change over time. See cited sources for platform
 * restrictions (Android/iOS) and SIM-swap prevention guidance. (Citations inline.)
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Bind a user's account to their SIM (phone number / SIM identifier) safely so the app can
detect SIM changes, reduce fraud, and improve account security — while protecting privacy.
*/

/* ===========================================================================
📌 1. WHAT IS SIM BINDING? (very simple)
===============================================================================
SIM binding = saving a SIM-related identifier (like IMSI/ICCID/MSISDN) on your server
when the user registers, then later checking that the current SIM matches the one stored.
It helps detect SIM swaps (when fraudsters port a number to a new SIM) and can be a
signal for stronger authentication or blocking risky actions.
*/

/* ===========================================================================
📌 2. WHY USE SIM BINDING? (simple reasons)
===============================================================================
- Detect SIM swap / SIM replacement quickly. (Fraud prevention) :contentReference[oaicite:0]{index=0}  
- Reduce account takeover risk when combined with other checks (OTP + device attestation). :contentReference[oaicite:1]{index=1}  
- Add an extra device-binding factor for sensitive flows (wallets, payments, KYC).
*/

/* ===========================================================================
📌 3. WHAT DATA TO USE (IMSI, ICCID, MSISDN) — short explainer
===============================================================================
- IMSI (Subscriber ID) — uniquely identifies subscriber on network (sensitive).  
- ICCID (SIM serial number) — unique SIM card identifier.  
- MSISDN (phone number) — human-readable; sometimes available from network or via OTP.  

⚠️ Important privacy note: IMSI & ICCID are highly sensitive identifiers. Use minimum data needed,
hash/store them securely, and ask user consent. Android and iOS access to these identifiers is
restricted by OS and store policies — treat them as sensitive. :contentReference[oaicite:2]{index=2}
*/

/* ===========================================================================
📌 4. PLATFORM REALITY: ANDROID VS iOS (key facts)
===============================================================================
- Android: Telephony APIs like TelephonyManager and SubscriptionManager can return IMSI / ICCID
  but require runtime permissions (READ_PHONE_STATE) and behavior changed in recent Android
  versions — many identifiers are restricted and may require privileged permissions. Always
  check current Android docs and Play policy before relying on IMSI. :contentReference[oaicite:3]{index=3}

- iOS: Apple exposes carrier info (CTCarrier) like carrier name, mobileCountryCode (MCC),
  and mobileNetworkCode (MNC) via CoreTelephony, but does **not** provide IMSI/ICCID to apps
  in general. iOS limits access to non-public SIM identifiers for privacy reasons. :contentReference[oaicite:4]{index=4}
*/

/* ===========================================================================
📌 5. HIGH-LEVEL ARCHITECTURE (how SIM binding works end-to-end)
===============================================================================
1) App onboarding:
   - Ask user consent for reading SIM info if you plan to use it.
   - Option A (preferred): Verify phone number via OTP (SMS) and store hash(phoneNumber).
   - Option B (if allowed): Read SIM identifier (IMSI/ICCID) on Android, hash it, and store on server.

2) Server stores:
   - hashed SIM identifier (HMAC or salted SHA256) + device fingerprint metadata + timestamp

3) On each sensitive action / periodic check:
   - App reads current SIM info (or requires fresh OTP) → sends hashed identifier to server
   - Server compares with stored hash → if mismatch, consider SIM changed → trigger flow:
      • ask for re-authentication / OTP
      • lock high-risk actions
      • notify user & support
      • escalate if suspicious (rate-limit, block device)

4) Combine SIM check with:
   - device attestation (Play Integrity / App Attest)
   - IP/geolocation checks
   - device fingerprinting
   - behavioral anomalies
*/

/* ===========================================================================
📌 6. ANDROID: HOW TO READ SIM IDENTIFIERS (example)
===============================================================================
Notes:
 - Must request runtime READ_PHONE_STATE (dangerous permission).
 - On Android 10+ many identifiers are restricted; some APIs return null unless privileged.
 - Use SubscriptionManager to support multi-SIM devices.
 - Always check for null and exceptions.

Example (conceptual, plain JS style for RN NativeModule or React Native plugin):
*/
/// Android-native conceptual code (Java/Kotlin pseudo)
/*
TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);

// get SIM serial (ICCID)
String simSerial = tm.getSimSerialNumber(); // Requires READ_PHONE_STATE

// get IMSI (subscriber id)
String imsi = tm.getSubscriberId(); // restricted on newer Android versions

// Better: use SubscriptionManager for multi-SIM
SubscriptionManager sm = (SubscriptionManager) context.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE);
List<SubscriptionInfo> subs = sm.getActiveSubscriptionInfoList();
for (SubscriptionInfo s : subs) {
  String iccid = s.getIccId(); // available on many devices with proper permission
  int subId = s.getSubscriptionId();
  TelephonyManager tmForSub = tm.createForSubscriptionId(subId);
  String imsiForSub = tmForSub.getSubscriberId();
}
*/

// React Native (JS) — use an existing well-maintained native module or write a small native bridge.
// Always request permissions using react-native-permissions or similar and explain why.

/* ===========================================================================
📌 7. iOS: WHAT YOU CAN ACCESS (limitations)
===============================================================================
- iOS apps can read carrier metadata (carrier name, mobileCountryCode, mobileNetworkCode)
  via CoreTelephony (CTCarrier) — helpful signal but not unique per SIM. :contentReference[oaicite:5]{index=5}

- iOS does **not** expose IMSI/ICCID to third-party apps as a rule. Attempting to access low-level
  SIM identifiers will generally fail or require private APIs (which will be rejected by App Store).
- Recommended approach on iOS: use phone number verification (OTP) + App Attest / DeviceCheck for attestation.
*/

/* ===========================================================================
📌 8. PRIVACY, PERMISSIONS & STORE POLICIES (must-read)
===============================================================================
- READ_PHONE_STATE is a dangerous permission; accessing device identifiers may trigger Play Store
  requirements (privacy policy, justification). On modern Android versions access to non-resettable
  identifiers (IMEI, IMSI) is more restricted and often unavailable to normal apps. Check Android docs. :contentReference[oaicite:6]{index=6}

- On iOS, attempting to use private APIs for SIM identifiers will lead to App Store rejection.
- Always show clear user consent UI explaining why you need SIM info and how it helps the user.
- Minimize data collection: store hashed identifiers, not raw values; document retention & deletion policies.
*/

/* ===========================================================================
📌 9. HOW TO STORE IDENTIFIERS SECURELY (server + app)
===============================================================================
Client side:
  - Never send raw IMSI/ICCID in plain text. If you must, send over TLS and immediately hash server-side.
  - Better: hash (HMAC-SHA256) the identifier with a server-known salt or ephemeral key before sending.

Server side:
  - Store only salted/HMACed hashes of identifiers (not plain text).
  - Store metadata: firstSeen, lastSeen, device fingerprint, app version, ip, geo (coarse).
  - Keep audit logs for changes and alerts.
  - Apply rate limits and monitoring for suspicious activity.

Example hashing (conceptual):
  const serverSalt = getServerSalt(); // rotate occasionally
  const hash = HMAC_SHA256(serverSalt, imsi || iccid || msisdn);
  // store hash in DB, never store plain IMSI/ICCID
*/

/* ===========================================================================
📌 10. SIM-SWAP DETECTION & RESPONSE (what to do when SIM changes)
===============================================================================
Detection:
  - SIM identifier hash mismatch
  - New phone number verified by OTP on a different device
  - Sudden change in carrier MCC/MNC + login from new IP/region

Response patterns (in order of strictness):
 1) Soft action: force step-up auth (OTP, biometric)
 2) Medium: block critical actions (bank transfers, withdrawals) until manual verification
 3) Hard: lock account & require identity verification via support
 4) Notify user via alternate channels (email, previous device) about SIM change

Best advice: combine SIM-swap signal with other signals (device attestation, geo, behavior) before auto-locking to avoid false positives. OWASP and security guides recommend layered defenses. :contentReference[oaicite:7]{index=7}
*/

/* ===========================================================================
📌 11. UX & CONSENT (how to ask users)
===============================================================================
- Tell users clearly why you ask for SIM info: "We use this to detect SIM swap and protect your account."  
- Offer fallback: if user denies permission, fall back to phone-number OTP verification.  
- Allow users to unlink SIM or re-bind after proper re-authentication.  
- Provide clear support/appeal flow for false positives (user legitimately changed SIM).
*/

/* ===========================================================================
📌 12. SAMPLE RN FLOW (single-file conceptual code)
===============================================================================
- This is a high-level example mixing JS + pseudocode for native bridge.
- Uses: OTP fallback, consent prompt, secure hash upload.

*/
import { Alert } from "react-native";
// PSEUDO-NATIVE module — implement native bridge to access SIM details on Android only
// iOS will return limited carrier info.
const NativeSIM = {
  // returns { iccid: '...', imsi: '...', carrier: { mcc, mnc, name } } or nulls
  async getSimInfo() {
    // native bridge implementation required
    return null;
  },
};

export async function bindSimToAccount(userToken) {
  // 1) Ask for consent (UI)
  const consent = true; // show UI to user asking permission
  if (!consent) {
    // fallback to OTP-based binding
    return await requestPhoneOtpAndBind(userToken);
  }

  // 2) Try to get sim info (Android may succeed; iOS likely limited)
  const simInfo = await NativeSIM.getSimInfo();
  if (!simInfo || (!simInfo.iccid && !simInfo.imsi)) {
    // Fallback: verify phone number by sending OTP
    return await requestPhoneOtpAndBind(userToken);
  }

  // 3) Hash locally (optional) and send minimal payload to server
  // Server should still re-hash/verify.
  const payload = {
    simHash: await hashClientSide(simInfo.iccid || simInfo.imsi),
    carrier: simInfo.carrier,
    timestamp: Date.now(),
  };

  // 4) Send to backend to store binding
  await fetch("https://api.example.com/auth/bind-sim", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return true;
}

async function requestPhoneOtpAndBind(userToken) {
  // standard phone verification flow: send OTP -> verify -> backend stores phone hash
  Alert.alert("We will send an SMS to verify your phone number.");
  // ... implement OTP UI & backend verify
  return true;
}

async function hashClientSide(value) {
  // Simple example: use SHA-256 in RN (crypto lib) — server should still validate
  return "sha256-hash-placeholder";
}

/* ===========================================================================
📌 13. TESTING & MONITORING
===============================================================================
Tests:
 - Unit test: hash comparisons, migrate/rotate salt logic
 - Integration: simulate SIM change and ensure server triggers expected flow
 - E2E: onboarding with SIM present vs. SIM removed/replaced -> check app behavior

Monitoring:
 - Track SIM-change events per user
 - Alerts for spikes in SIM change (possible mass SIM swap)
 - Keep audit trail for manual investigation
 - Use anomaly detection (sudden geographic jumps, many SIM binds from same IP)
*/

/* ===========================================================================
📌 14. LIMITATIONS & RISKS (be honest)
===============================================================================
- SIM binding is only one signal — false positives possible (user legitimately changes SIM).  
- Android API access to identifiers is limited and may be null on newer Android versions or require privileged access. :contentReference[oaicite:8]{index=8}  
- iOS does not expose IMSI/ICCID to third-party apps — rely on OTP & attestation there. :contentReference[oaicite:9]{index=9}  
- Over-reliance on SIM binding without fallback will create UX/availability problems.
*/

/* ===========================================================================
📌 15. PRIVACY & LEGAL (must do)
===============================================================================
- Update privacy policy to explain what you read and why (Play Store & App Store expect this). :contentReference[oaicite:10]{index=10}  
- Use data minimization: store hashes, not raw identifiers.  
- Allow users to remove binding and request human review.  
- Keep retention periods and deletion policy documented.
*/

/* ===========================================================================
📌 16. CHECKLIST — IMPLEMENTATION (quick)
===============================================================================
✔ Design consent screen for SIM access & explain reasons  
✔ Implement OTP fallback if SIM info not available  
✔ Use native bridge or trusted library for SIM info on Android (SubscriptionManager / TelephonyManager) :contentReference[oaicite:11]{index=11}  
✔ Hash identifiers (HMAC-SHA256) before storing; rotate salts as needed  
✔ Add server-side logic: compare hashes, step-up auth, notifications  
✔ Combine with device attestation (Play Integrity / App Attest) for strong signal  
✔ Monitor SIM-change events & create alerting rules (fraud ops)  
✔ Add unit/integration/E2E tests for binding and swap flows  
✔ Publish privacy policy & justify READ_PHONE_STATE usage if requested by Play Console. :contentReference[oaicite:12]{index=12}
*/

/* ===========================================================================
📌 17. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: What is SIM binding?  
A: Saving a SIM identifier (or verified phone number) to detect SIM changes and protect accounts.

Q2: Which SIM identifiers can apps read?  
A: Android can read IMSI/ICCID via Telephony APIs with permissions but modern Android restricts access; iOS does not expose IMSI/ICCID to third-party apps. :contentReference[oaicite:13]{index=13}

Q3: Should we store raw IMSI/ICCID on server?  
A: No. Always hash (HMAC) and store hashes. Keep raw identifiers out of logs.

Q4: What to do when SIM swap is detected?  
A: Step-up authentication (OTP/biometric), block sensitive operations, notify user and support team, and investigate.

Q5: Is SIM binding enough to stop fraud?  
A: No — use it as one signal among many (attestation, geo, behaviour) to make decisions. OWASP recommends layered defenses. :contentReference[oaicite:14]{index=14}
*/

/* ===========================================================================
📌 18. RESOURCES & REFERENCES (quick links)
===============================================================================
- Android TelephonyManager & SubscriptionManager docs. :contentReference[oaicite:15]{index=15}  
- Android privacy changes (restrictions for identifiers from Android 10+). :contentReference[oaicite:16]{index=16}  
- Apple CoreTelephony CTCarrier docs (carrier info, limitations). :contentReference[oaicite:17]{index=17}  
- OWASP SIM swapping prevention guidelines. :contentReference[oaicite:18]{index=18}  
- SIM swap overview & prevention articles (industry posts). :contentReference[oaicite:19]{index=19}
*/

/* ===========================================================================
📌 19. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) SIM binding = store hashed SIM identifier or verified phone to detect changes.  
2) Android can provide SIM IDs but with permissions and platform limits; iOS is limited. :contentReference[oaicite:20]{index=20}  
3) Always get user consent and publish privacy policy. :contentReference[oaicite:21]{index=21}  
4) Store only hashes, combine SIM signal with attestation + behavior checks. :contentReference[oaicite:22]{index=22}  
5) On mismatch: step-up auth, block sensitive ops, notify user, investigate.  
6) Test flows: normal SIM change, SIM swap fraud simulation, permission denial fallback.

*/

/* ===========================================================================
📌 20. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Android native implementation: exact Java/Kotlin code + RN native module example  
  ✅ Server-side binding API: endpoints, DB schema, hash rotation, webhooks for alerts  
  ✅ SIM swap playbook: automated detection rules, alert thresholds, support scripts
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
