/*********************************************************
 * 📘 Play Console Policy Compliance Notes
 * Privacy Policy • Data Safety • Permissions • ad-ID • SDK Risks
 * File: play_console_policy_compliance_notes.js
 *********************************************************/

/*********************************************************
 * SECTION 0 — OVERVIEW (Why Play Compliance Matters)
 *********************************************************/
/**
 * - Google Play requires strict transparency on:
 *      • What data your app collects
 *      • Why you collect it (purpose)
 *      • Whether it’s shared with third parties
 *      • Whether data is encrypted, optional, deletable
 * - Non-compliance => App rejection, removal, warnings, and repeat offender penalties.
 * - You must maintain:
 *      1) Correct Data Safety form
 *      2) Accurate Privacy Policy
 *      3) Proper ad-ID handling
 *      4) Correct permissions declarations
 *      5) User Request obligations (Delete/Export account data)
 */

/*********************************************************
 * SECTION 1 — PRIVACY POLICY REQUIREMENTS
 *********************************************************/
/**
 * Your Privacy Policy must:
 *  - Be publicly accessible (HTTPS-hosted web page)
 *  - Clearly explain:
 *      • What data is collected
 *      • How you collect it (SDKs, APIs)
 *      • Why you use it (purpose)
 *      • Whether it's shared with 3rd parties
 *      • Data retention policy
 *      • User rights (delete, correct, export)
 *  - Match EXACTLY what you declare in Data Safety Form.
 *  - Be linked in:
 *      • Play Console → App Content → Privacy Policy
 *      • Inside the app (settings / about)
 *
 * Red Flags (Automated Rejections):
 *  - Placeholder text ("Lorem ipsum" / sample templates)
 *  - Mismatched claims vs Data Safety form
 *  - Missing disclosures for analytics/ads SDKs
 */

/*********************************************************
 * SECTION 2 — DATA SAFETY FORM (MANDATORY)
 *********************************************************/
/**
 * Google Play Data Safety asks you to declare:
 *
 * 1) Does your app collect data?
 * 2) What categories of data?
 *      • Location
 *      • Personal info (name, email, phone)
 *      • Financial info
 *      • App activity / interactions
 *      • Device IDs
 *      • Crash logs / diagnostics
 *      • Photos/Videos/Audio
 *
 * 3) Why is the data collected? (Purpose)
 *      • App functionality
 *      • Analytics
 *      • Advertising / marketing
 *      • Personalization
 *      • Fraud prevention, security
 *
 * 4) Is data shared with third parties?
 * 5) Is data encrypted in transit?
 * 6) Can the user request deletion?
 * 7) Optional or required for core functionality?
 *
 * RULE:
 *  - If ANY SDK collects data → YOU MUST declare it.
 *  - “We don’t collect data” is only valid if NO code or SDK collects ANYTHING.
 *
 * Common violations:
 *  - Firebase Analytics/Crashlytics not declared
 *  - AdMob / Facebook Ads / Adjust not declared
 *  - Wrong data categories for permissions (e.g., camera used but not declared)
 */

/*********************************************************
 * SECTION 3 — ADVERTISING ID (ad-ID) RULES
 *********************************************************/
/**
 * What is ad-ID?
 *  - A resettable advertising identifier used for ad personalization, attribution.
 *
 * Google Play requires:
 *  - If your app accesses ad-ID (via ads SDK), you MUST declare:
 *      • Data type: Device IDs
 *      • Purpose: Advertising / Marketing
 *
 * ad-ID is considered personal data:
 *  - Must declare data collection and sharing.
 *  - Must honor user deletion / reset.
 *  - If user opts out of Ads Personalization, you MUST NOT track using ad-ID.
 *
 * Android 13+ requires:
 *  - Ad-ID access must follow updated privacy guidelines.
 */

/*********************************************************
 * SECTION 4 — SDK COMPLIANCE (Important!)
 *********************************************************/
/**
 * Many apps get rejected because a third-party SDK collects data silently.
 *
 * You **MUST verify** SDK behavior:
 *  - Firebase Analytics
 *  - Google Mobile Ads (AdMob)
 *  - Facebook SDK
 *  - AppsFlyer, Adjust, Branch
 *  - Sentry / Crashlytics
 *
 * Steps:
 *  1) Review each SDK’s Data Collection documentation.
 *  2) Confirm what data is transmitted automatically.
 *  3) Declare all relevant data in Play Console.
 *  4) Ensure the privacy policy reflects SDK behavior.
 *
 * Best practice:
 *  - Maintain an “SDK Data Matrix” inside your repo describing:
 *      SDK → data collected → shared? → purpose → declared? → privacy updated?
 */

/*********************************************************
 * SECTION 5 — PERMISSIONS COMPLIANCE
 *********************************************************/
/**
 * Sensitive permissions require justification:
 *
 * 1) LOCATION (fine/coarse)
 *      - Must declare why you use it (maps, GPS, geofencing).
 *      - Cannot collect unnecessarily in background.
 *
 * 2) CAMERA / MICROPHONE
 *      - Must declare in privacy policy + Data Safety.
 *      - For scanning, recording, video calls → declare clearly.
 *
 * 3) STORAGE / MEDIA ACCESS
 *      - For Android 13+, new granular permissions: READ_MEDIA_IMAGES, etc.
 *      - Must match Data Safety categories (Photos/videos/audio).
 *
 * 4) CONTACTS, CALENDAR (HIGH-RISK)
 *      - Must justify strongly.
 *
 * 5) SMS / CALL LOG (RESTRICTED PERMISSIONS)
 *      - Allowed only for core default apps. Most apps cannot use them.
 *
 * Good practice:
 *  - MINIMIZE permissions; explain exactly why each is required.
 */

/*********************************************************
 * SECTION 6 — USER DATA RIGHTS (Play Requirements)
 *********************************************************/
/**
 * Apps must allow:
 *  1) User data deletion (account deletion mandatory for apps with accounts)
 *  2) Data export upon user request
 *  3) Revoking consent where applicable
 *
 * Account Deletion:
 *  - Must delete data both inside app & backend.
 *  - Must provide a link to request deletion even outside the app (web page).
 */

/*********************************************************
 * SECTION 7 — POLICY-DRIVEN REQUIREMENTS FOR SPECIFIC FEATURES
 *********************************************************/
/**
 * 1) Ads & Attribution
 *    - Must show consent if required by local region laws (GDPR).
 *    - Must declare data collection done via Ads SDKs.
 *
 * 2) Analytics
 *    - Declare crash logs, diagnostics, app interactions, device identifiers.
 *
 * 3) Kids Apps (Designed for Families)
 *    - Strict: NO ad-ID, limited data collection, no profiling.
 *
 * 4) Background location
 *    - Must provide FAQ inside app.
 *    - Must prove feature requires continuous tracking.
 */

/*********************************************************
 * SECTION 8 — INTERNAL PROCESS (HOW TO MAINTAIN COMPLIANCE)
 *********************************************************/
/**
 * 1) Maintain a “Policy Compliance Checklist” document inside the repo.
 * 2) Every release:
 *      - Re-check Data Safety form against new SDK updates.
 *      - Revalidate permissions.
 *      - Re-generate privacy policy if behavior changes.
 * 3) For major features:
 *      - Run a Policy Impact Assessment.
 * 4) Automation:
 *      - CI step to scan Gradle dependencies against known risks.
 */

/*********************************************************
 * SECTION 9 — HOW GOOGLE CATCHES VIOLATIONS
 *********************************************************/
/**
 * Google uses:
 *  - Automated scanners
 *  - Static code analysis (permissions, APIs)
 *  - Network traffic behavior analysis
 *  - SDK signatures & known data-collecting modules
 *  - Manual review (random sampling)
 *
 * Common rejection messages:
 *  - “Your Data Safety form is inaccurate.”
 *  - “Your app collects data but your form states otherwise.”
 *  - “ad-ID used but not declared.”
 *  - “Unclear or missing Privacy Policy.”
 */

/*********************************************************
 * SECTION 10 — COMPLIANCE WORKFLOW (DO THIS EVERY RELEASE)
 *********************************************************/
/**
 * ✔ Step 1: Identify all data your app + SDKs collect
 * ✔ Step 2: Map each data type → Purpose
 * ✔ Step 3: Declare everything in Data Safety
 * ✔ Step 4: Update privacy policy accordingly
 * ✔ Step 5: Validate permissions match declarations
 * ✔ Step 6: Ensure ad-ID usage is declared
 * ✔ Step 7: Provide account deletion flow
 * ✔ Step 8: Run internal audit before uploading to Play Console
 */

/*********************************************************
 * SECTION 11 — PLAY CONSOLE REJECTION FIXING GUIDE
 *********************************************************/
/**
 * If rejected:
 * 1) Read the exact flagged area (Data Safety? Permissions? Privacy?)
 * 2) Re-scan network logs (Charles Proxy / mitmproxy)
 * 3) Check if any SDK sends data silently
 * 4) Update:
 *      • Privacy policy
 *      • Data Safety form
 *      • In-app disclosures
 * 5) Add evidence in the Appeal:
 *      • Screenshots of disclosures
 *      • Explanations of data flow
 */

/*********************************************************
 * SECTION 12 — INTERVIEW Q&A (copy for prep)
 *********************************************************/
/**
 * Q1: What is the purpose of Google Play Data Safety section?
 * A1: To disclose what data is collected, why it’s used, how it’s shared, and whether users can delete it.
 *
 * Q2: What is considered a violation?
 * A2: When the app collects/shares data not declared in Data Safety or privacy policy.
 *
 * Q3: Does using Firebase Analytics require Data Safety disclosures?
 * A3: YES — Firebase automatically collects device info, analytics, crash logs.
 *
 * Q4: How does Google detect undeclared data collection?
 * A4: Automated scans, SDK signature detection, network traffic analysis.
 *
 * Q5: What is required for ad-ID usage?
 * A5: Must declare collection of Device ID + purpose: Advertising/Marketing.
 *
 * Q6: What is mandatory for apps with login/accounts?
 * A6: Account deletion + user data deletion option.
 *
 * Q7: What happens if privacy policy & Data Safety mismatch?
 * A7: Immediate rejection or removal from Play Store.
 */

/*********************************************************
 * END OF FILE
 *********************************************************/
