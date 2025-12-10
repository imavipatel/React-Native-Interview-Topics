/*********************************************************
 * 🍎 Handling iOS App Store Review Rejections & Guidelines
 * File: ios_appstore_review_rejection_notes.js
 *
 * Includes:
 *   - Top rejection reasons
 *   - Guideline summaries
 *   - How to fix & appeal
 *   - Compliance checklist
 *********************************************************/

/*********************************************************
 * SECTION 0 — WHY APPS GET REJECTED
 *********************************************************/
/**
 * Apple reviews apps for:
 *  - Safety, user privacy, no misleading behavior
 *  - Functionality completeness
 *  - UI/UX consistency, iOS-native behaviors
 *  - Policy adherence (IAP, data usage)
 *  - Legal compliance (permissions, content)
 *
 * Rejections fall under:
 *  - Guideline 2.x => Functionality
 *  - Guideline 4.x => Design/UX
 *  - Guideline 5.x => Legal / Policy
 *  - Guideline 1.x => Safety / Objectionable content
 *  - Guideline 3.x => Business (In-app purchases)
 */

/*********************************************************
 * SECTION 1 — MOST COMMON REJECTION CODES & HOW TO FIX
 *********************************************************/

/*********************************************************
 * 1. Guideline 2.1 — App Completeness
 *********************************************************/
/**
 * Meaning:
 *  - App crashed during review
 *  - API keys missing (server unreachable)
 *  - Login required but reviewer cannot access
 *
 * Fix:
 *  - Provide working demo credentials
 *  - Ensure staging servers accessible
 *  - Test app in airplane mode, poor network, first install
 */

/*********************************************************
 * 2. Guideline 2.3 — Accurate Metadata
 *********************************************************/
/**
 * Issues:
 *  - Screenshots not matching app UI
 *  - Misleading description / fake claims
 *  - Promo text unrelated
 *
 * Fix:
 *  - Update screenshots with actual in-app content
 *  - Remove exaggerated claims
 *  - Ensure every screenshot represents final UI
 */

/*********************************************************
 * 3. Guideline 2.5.1 — Software Requirements / Performance
 *********************************************************/
/**
 * Issues:
 *  - App uses private APIs
 *  - Excessive background usage
 *  - Poor performance or battery drain
 *
 * Fix:
 *  - Scan binary using tools to detect private API usage
 *  - Ensure no jailbroken API references
 *  - Optimize slow screens; reduce CPU load
 */

/*********************************************************
 * 4. Guideline 4.2 — Minimum Functionality
 *********************************************************/
/**
 * Issues:
 *  - Webview-only app
 *  - Not enough functionality / content
 *
 * Fix:
 *  - Add native UI components
 *  - Provide user value beyond web browsing
 */

/*********************************************************
 * 5. Guideline 4.0–4.2 — Poor UX / Missing Features
 *********************************************************/
/**
 * Reviewer flags:
 *  - Buttons not tappable
 *  - Inconsistent gestures (back not working)
 *  - Poor iPad layout
 *  - Crashes from unhandled states
 *
 * Fix:
 *  - Test all form states, offline states
 *  - Support safe areas, various screen sizes
 *  - Support landscape if needed
 */

/*********************************************************
 * 6. Guideline 5.0 — Legal & Privacy
 *********************************************************/
/**
 * Common rejections:
 *  - Missing privacy policy link
 *  - Tracking permission not explained correctly
 *  - Using IDFA without App Tracking Transparency prompt
 *
 * Fix:
 *  - Add Privacy Policy URL inside app settings
 *  - Show ATT popup only when needed
 *  - Update Info.plist usage descriptions
 */

/*********************************************************
 * 7. Guideline 3.1 — Payment (In-App Purchases)
 *********************************************************/
/**
 * Issues:
 *  - Selling digital goods without using IAP
 *  - Linking users to external payment pages
 *  - Ads that unlock through external purchases
 *
 * Fix:
 *  - Use StoreKit for digital items
 *  - Remove external links or adjust to allowed patterns
 */

/*********************************************************
 * SECTION 2 — iOS PERMISSIONS & PLIST RULES
 *********************************************************/
/**
 * You must include clear usage descriptions for:
 *    NSCameraUsageDescription
 *    NSLocationWhenInUseUsageDescription
 *    NSMicrophoneUsageDescription
 *    NSPhotoLibraryUsageDescription
 *    NSContactsUsageDescription
 *
 * Apple checks:
 *  - Wording MUST clearly explain WHY the permission is needed
 *  - Vague messages = rejection
 *
 * Example good message:
 *  “We use your location to show nearby stores and offers.”
 */

/*********************************************************
 * SECTION 3 — ATT (App Tracking Transparency)
 *********************************************************/
/**
 * ATT popup required if:
 *  - Using ad-ID
 *  - Facebook SDK, AppsFlyer, Branch, Adjust, Google Ads
 *
 * Rules:
 *  - Must not access IDFA before user grants permission
 *  - Must not gate functionality behind ATT permission
 *  - Must provide purpose string in Info.plist
 */

/*********************************************************
 * SECTION 4 — LOGIN & ACCOUNT REQUIREMENTS
 *********************************************************/
/**
 * Apple requires:
 *  - Demo account if login required
 *  - “Sign in with Apple” if you support third-party login (Google/Facebook)
 *
 * Fixes:
 *  - Provide test credentials on App Store Connect
 *  - If using Google/Facebook login → must also support Sign in with Apple unless login is “enterprise-only”
 */

/*********************************************************
 * SECTION 5 — HOW TO RESPOND TO REJECTIONS (APPEAL WORKFLOW)
 *********************************************************/
/**
 * Proper response strategy:
 * 1) Read rejection carefully.
 * 2) Reproduce the issue on a clean simulator/device.
 * 3) Provide a polite, concise explanation.
 * 4) Attach a short video showing fix / behavior.
 * 5) If reviewer misunderstood:
 *      - Provide clear steps to access feature.
 *      - Provide test credentials.
 *
 * Appeal:
 *  - Use “Request Review” or “Challenge this decision”
 *  - Provide evidence, steps, and reasoning
 *
 * “We fixed the issue. Please review again.”
 * “Here is a video demonstrating correct behavior.”
 */

/*********************************************************
 * SECTION 6 — REJECTION TYPES WITH FIX PATTERNS
 *********************************************************/

/*** A. Crash During Review ***/
/**
 * Common reasons:
 *  - API keys missing in Release build
 *  - Using debug-only configuration
 *  - Feature flags missing
 *
 * Fix:
 *  - Test Release mode on real device
 *  - Test offline conditions, location disabled, notifications disabled
 */

/*** B. Incomplete App ***/
/**
 * Reviewer cannot:
 *  - Register (OTP not delivered)
 *  - Login (backend restricts)
 *  - Access main features
 *
 * Fix:
 *  - Provide bypass test modes
 *  - Provide universal demo account
 */

/*** C. Guideline 4.0 — “Your app looks like a beta/test app” ***/
/**
 * Issues:
 *  - Placeholder text
 *  - Debug UI, test labels
 *  - Minimal UX, broken flows
 *
 * Fix:
 *  - Polish UI, add loading states, remove debug prints
 */

/*** D. Guideline 1.2 — Objectionable content ***/
/**
 * Fix:
 *  - Add reporting/removal mechanism
 *  - Add user-blocking, content moderation
 */

/*********************************************************
 * SECTION 7 — WHAT APPLE EXPECTS FROM GOOD UX
 *********************************************************/
/**
 * - Smooth navigation (Back gestures must work)
 * - Consistent layout for all iPhones/iPads
 * - No clipped UI near notch / safe areas
 * - Meaningful loading indicators
 * - No hard-coded text → use localization frameworks
 */

/*********************************************************
 * SECTION 8 — PRE-SUBMISSION CHECKLIST
 *********************************************************/
/**
 * ✔ Test in RELEASE mode
 * ✔ All permissions have proper Info.plist strings
 * ✔ No preloaded test data visible
 * ✔ Screenshots match real UI
 * ✔ ATT implementation correct
 * ✔ In-app purchases use StoreKit
 * ✔ App works offline or handles errors gracefully
 * ✔ Demo login credentials added
 * ✔ App adheres to 5.1 privacy guidelines
 */

/*********************************************************
 * SECTION 9 — TIPS TO AVOID REJECTION
 *********************************************************/
/**
 * - Record a demo video and add it in App Store Connect “Notes for Review”
 * - Provide steps to login, navigate, and test main features
 * - Use TestFlight logs to pre-catch crashes
 * - Use Firebase Crashlytics to detect issues before submission
 * - Avoid marketing claims like "best ever" → misleading
 * - Check UI on small devices (iPhone SE) + large devices (iPad)
 */

/*********************************************************
 * SECTION 10 — INTERVIEW Q&A
 *********************************************************/
/**
 * Q1: What is the #1 reason apps get rejected?
 * A1: App incompleteness — reviewer cannot access main features or app crashes in review.

 * Q2: How do you prepare for ATT compliance?
 * A2: Don’t access IDFA before user consent, add tracking description, show ATT prompt responsibly.

 * Q3: When must you implement “Sign in with Apple”?
 * A3: When the app supports third-party consumer login like Google/Facebook.

 * Q4: What belongs in “Notes for Review”?
 * A4: Demo credentials, feature explanation, steps to reproduce, video proof.

 * Q5: What triggers “Guideline 4.2 Minimum Functionality”?
 * A5: Webview-only apps, apps with minimal interactivity, or apps lacking native capabilities.

 * Q6: How do you handle metadata rejections?
 * A6: Update screenshots, remove misleading claims, ensure description aligns with app content.

 * Q7: How do you appeal rejections?
 * A7: Provide evidence, video walkthrough, clear explanation; use polite & factual tone.
 */

/*********************************************************
 * END OF FILE
 *********************************************************/
