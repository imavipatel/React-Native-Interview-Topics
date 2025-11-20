/*

✅ SECTION 1 — React Native (FULLY DETAILED WITH SUBTOPICS + QUESTIONS + ANSWERS)

This is the first section.
After this, I will generate Section 2 (JavaScript/TypeScript), Section 3 (Redux), Section 4 (Performance), etc.

------------------------------------------
📍 SECTION 1: REACT NATIVE
------------------------------------------

Below are all important subtopics, interview questions, and fully detailed senior-level answers based on your experience.

1.1 React Native Architecture
Q1 — Explain the architecture you used in AU 0101 Business App.

Answer:
Our architecture followed a Clean + Modular + Scalable architecture, optimized for a large enterprise fintech app.

🧱 Architecture Layers (Explained in Detail)
1️⃣ Presentation Layer (UI + Components)

Built with Atomic Design

50+ reusable components documented via Storybook

Highly reusable: Buttons, Input, MenuSheet, QRScanner, Modals

Component props enforced with TypeScript interfaces

Why this matters:

Ensures UI consistency

Reduces development time by 30%

Shared across Merchant + Sales Officer + Admin flavors

2️⃣ State Management Layer (Redux Toolkit)

Per-module slices (UPI, BBPS, Loans, Deposits, Limits, Auth)

createAsyncThunk for async API calls

Reselect for memoized selectors

Redux Persist for offline caching

Why useful:

Predictable flows

Easy debugging

Offline-friendly experience

Scalable to 50+ modules

3️⃣ Business Logic / Services Layer

This layer contains:

Data validation

Encryption

SIM binding checks

Authentication logic

API request transformers

Response normalizers

Why:
This avoids business logic inside screens → increasing reusability and testability.

4️⃣ Data Layer (API + Network + Storage)

Axios instance with interceptors

Auto token refresh

Error classification (network, validation, server, auth errors)

Retry mechanism with exponential backoff

Local caching via AsyncStorage

5️⃣ Navigation Layer

Dynamic navigation based on role

Multi-flavor support

Deep-linking support (Firebase Dynamic Links)

Nested navigators (Stack + Drawer + Tab)

6️⃣ Configuration & Environment Management

Each environment had unique:

API base URL

Security keys

Feature flags

Logging rules

Environments: Dev → SIT → UAT → CUG → Prod

Automated using:

yarn build:uat
yarn build:prod

7️⃣ Security Layer

SSL pinning

Jail/root detection

SIM binding

Certificate pinning

Session timeouts

Face authentication

Built using native modules (Java/Kotlin, Swift/Objective-C).

8️⃣ Build & Release Layer

Jenkins CI/CD

Fastlane (iOS)

Gradle flavors (Android)

Automated signing

Auto increment versioning

Summary:

The architecture ensured:

✔ 40% faster releases
✔ 4× user engagement
✔ <2s app loading
✔ 99.8% uptime
✔ 50% faster development speed

1.2 React Native Bridge & JSI
Q2 — Explain the React Native Bridge.

Answer:
React Native runs JS on a separate thread and communicates with native code using a Bridge.

JS Thread → runs React code

Native Thread → renders UI / calls native APIs

Bridge → JSON-based async messaging layer

This causes:

Async communication

Possible bottlenecks if overused

Q3 — What is JSI and why is it used?

Answer:
JSI (JavaScript Interface) is a major improvement replacing the old bridge.

JSI Features:

No JSON serialization

Direct memory access

Sync native method calls

Enables TurboModules

Enables Fabric Renderer

We used JSI for:

Encryption

Device integrity checks

Faster biometric authentication

Face detection
All implemented via custom native modules.

1.3 Navigation System
Q4 — Explain complex navigation you implemented.

Answer:
AU Bank required role-based dynamic navigation.

Implemented Features:

Navigation guard (auth + SIM + device checks)

Dynamic menus loaded from backend

Feature-flag-based screen access

Deep linking with Firebase Dynamic Links

Reset navigation after login/logout

Nested navigators for modules

Example flow:

Splash → DeviceCheck → Auth → RoleBasedHome → ModuleStack


Impact:
Smooth navigation with strong security logic.

1.4 Multi-Flavour Apps
Q5 — How did you implement multiple flavors (Merchant, Admin, Sales)?

Answer:

Android:

Used Gradle productFlavors:

flavorDimensions "default"
productFlavors {
    merchant { applicationId "com.au.merchant" }
    admin    { applicationId "com.au.admin" }
    sales    { applicationId "com.au.sales" }
}

iOS:

Used:

Schemes

Build Configurations

Info.plist per flavor

JS Level:

Feature flags:

import { FLAVOR } from '@env';


Dynamic components loaded based on role.

Automation:

Created custom CLI:

yarn create-module <name>
yarn generate-rn-icons assets/


👉 Reduced build & setup time by 50%.

1.5 Performance Optimization
Q6 — What performance issues did you solve?

Answer:
I improved the AU Bank app startup time to under 2 seconds.

Techniques:

Enabled Hermes Engine

Lazy loading feature modules

Memoization (useMemo, useCallback, React.memo)

Optimized FlatList:

getItemLayout

maxToRenderPerBatch

windowSize

Cached APIs using Redux Persist

Used InteractionManager to delay heavy operations

Reduced re-rendering using selectors

Code-split feature modules

Result:
✔ Faster UI
✔ Smooth scrolling
✔ Lower memory usage

1.6 Device Features & Native Modules
Q7 — What native modules have you built?

Answer:

I built the following modules in Java/Kotlin & Objective-C/Swift:

SIM card info module

Device integrity module

Jailbreak/root detection

Face detection module

Encryption/Decryption module

SSL certificate pinning

Storage encryption module

Why native modules?
React Native plugins weren’t secure enough for fintech requirements.

1.7 Security Layer (Fintech Standard)
Q8 — Explain SSL Pinning in React Native.

Answer:
SSL Pinning ensures your app connects only to your own server.

Implementation:

Using react-native-ssl-pinning

Bundled certificate fingerprints in the app

Request fails if certificate mismatch

Added retry & fallback logic

Prevents MITM attacks.

Q9 — Explain SIM Binding.

Answer:
Used to check if:

Same SIM

Same IMEI

Same user

Process:

Get SIM serial via native module

Store encrypted SIM ID

While login, compare SIM ID

Block access if mismatch

Used heavily in banking security.

Q10 — How did you implement Jailbreak and Root Detection?

Answer:
Techniques:

JailMonkey library

Native OS checks

Binary checks

Suspicious file path checks

Developer mode detection

SU binary presence

System partition checks

If detected → app blocks critical modules.

1.8 Real-time Features
Q11 — Explain real-time implementation in SportGuruji.

Answer:

Used:

WebSockets

Event emitter pattern

Throttled UI updates

Data normalization before updating Redux

Loading skeletons for smooth transition

1.9 Offline First Apps
Q12 — How did you implement offline support?

Answer:

Used:

Redux Persist

AsyncStorage

Conditional UI if offline

API response caching

Background sync

Result:
✔ User retention improved by 30%
✔ Seamless experience for low-internet users

*/
