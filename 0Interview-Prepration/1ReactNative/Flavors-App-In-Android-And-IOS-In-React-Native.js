/**
 * react-native-multi-app-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How to build two apps (e.g., Merchant + SalesOfficer) from a single codebase"
 *
 * - Very simple language for beginners
 * - Full coverage: strategies (single app w/ feature-flags vs multi-flavor builds),
 *   folder structure, Android/iOS config (productFlavors / schemes), routing, theming,
 *   environment config, CI/CD, releasing, testing, Storybook, UX & security notes,
 *   checklist and interview Q&A.
 *
 * Copy-paste into your notes repo and adapt to your project.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Ship two different apps (Merchant & SalesOfficer) from the same source so you
reuse code, keep consistency, and manage releases separately.
*/

/* ===========================================================================
📌 1. HIGH-LEVEL STRATEGIES (choose one)
===============================================================================
A) **Single Codebase, Multi-Flavors (recommended for native apps)**  
   - Same repo + same JS code + different native configs (bundleId, icons, names, server env).  
   - Use Android productFlavors + iOS schemes/targets.  
   - Build separate APK/AAB and IPA per flavor.

B) **Single Codebase, Single Binary, Multi-Tenant (feature flags)**  
   - One install; runtime switches show/hide Merchant vs SalesOfficer features.  
   - Use remote feature flags and role-based access.  
   - Good when both users share the same device & account switching is common.

C) **Monorepo with two thin native apps + shared JS package**  
   - Two native app targets (or two RN apps) in one repo that import the same shared UI/business packages (via workspaces).  
   - Useful for large divergence between apps.

Pick A if you need separate app store listings, bundle ids, icons, or separate native permissions. Pick B if you want single build and runtime switching.
*/

/* ===========================================================================
📌 2. PROPOSED FOLDER STRUCTURE (single-flavor approach A)
===============================================================================
/repo-root
  /android
  /ios
  /src
    /app             // app bootstrap, navigation, feature-flag bootstrap
    /components      // atoms / molecules (atomic design)
    /screens
      /merchant
      /salesOfficer
    /features
      /merchant
      /salesOfficer
    /services
    /hooks
    /theme
    /config          // env configs per flavor
  /fastlane          // lanes for both apps
  package.json
  metro.config.js

If using monorepo/workspaces, create /packages/shared-ui and /apps/mobile (RN wrapper).
*/

/* ===========================================================================
📌 3. NAVIGATION & APP BOOTSTRAP (single binary with flavors)
===============================================================================
- Create top-level router that chooses initial screen based on build-time flavor
  OR runtime role if using feature-flag approach.

Example: flavor injection via global or env (simple)
*/
export const APP_FLAVOR = process.env.APP_FLAVOR || 'merchant'; // set at build time

// in AppRoot.js (conceptual)
import React from 'react';
import MerchantStack from './screens/merchant/stack';
import SalesStack from './screens/salesOfficer/stack';

export default function AppRoot() {
  if (APP_FLAVOR === 'merchant') return <MerchantStack />;
  return <SalesStack />;
}

/* ===========================================================================
📌 4. FEATURE FLAGS & RUNTIME SWITCHING (if you prefer single binary)
===============================================================================
- Use flags for features behind remote config (LaunchDarkly, Unleash, Firebase Remote Config).
- Role-check + feature flags let you enable merchant-only features.

Simple client-side feature check (local fallback):
*/
export function isFeatureEnabled(key, user) {
  // pseudo: read cached remote config OR fallback to build-time flags
  return /* boolean */;
}

/* ===========================================================================
📌 5. ANDROID: productFlavors (concrete example)
===============================================================================
- Edit android/app/build.gradle to declare flavors:
*/
/// android/app/build.gradle (snippet)
const android_build_gradle_snippet = `
android {
  ...
  flavorDimensions "app"
  productFlavors {
    merchant {
      dimension "app"
      applicationId "com.mycompany.merchant"
      resValue "string", "app_name", "MyApp Merchant"
    }
    sales {
      dimension "app"
      applicationId "com.mycompany.sales"
      resValue "string", "app_name", "MyApp Sales"
    }
  }
}
`;

/*
- For flavor-specific resources: create src/merchant/res/ and src/sales/res/ (icons, strings).
- Build commands:
  // merchant debug
  ./gradlew assembleMerchantDebug
  // sales release (AAB)
  ./gradlew bundleSalesRelease
*/

/* ===========================================================================
📌 6. iOS: Schemes, Targets & xcconfig (concrete)
===============================================================================
- Create two targets or use single target + multiple schemes with different build settings.
- Steps (summary):
  1) Duplicate existing target (or create new one) in Xcode (Merchant / Sales).
  2) Set "Bundle Identifier" per target (com.mycompany.merchant, com.mycompany.sales).
  3) Add separate App Icons asset catalogs per target.
  4) Use separate xcconfig files or build settings to load different environment files.

Example xcconfig keys:
  APP_DISPLAY_NAME = MyApp Merchant
  BUNDLE_ID = com.mycompany.merchant
Load these via Info.plist `${APP_DISPLAY_NAME}` or a script.
*/

/* ===========================================================================
📌 7. ENV CONFIGURATION (share code, different backends)
===============================================================================
Options:
  - react-native-config (env files per flavor .env.merchant, .env.sales)  
  - Build-time replacement using Gradle / Xcode run script to copy config.js  
  - Use native resources (resValue in Gradle / Info.plist entries) and read via NativeModules

Example using react-native-config:
  .env.merchant
    API_URL=https://merchant-api.example.com
    APP_FLAVOR=merchant

  .env.sales
    API_URL=https://sales-api.example.com
    APP_FLAVOR=sales

At build time set which file to use (CI picks correct env file).
*/

/* ===========================================================================
📌 8. ASSETS & ICONS (separate branding)
===============================================================================
- Keep separate assets for each flavor (icons, splash screens, colors).
- Android: place in src/merchant/res/mipmap- and src/sales/res/mipmap- 
- iOS: use Asset Catalog variants assigned to target membership (select target in Xcode).
- Use automated scripts (Fastlane or node scripts) to inject correct assets in CI.


/* ===========================================================================
📌 9. PUSH NOTIFICATIONS & APP IDENTIFIERS
===============================================================================
- Each flavor must have its own push certificate / Firebase app config / APNs key.
- Setup separate Firebase projects or use multiple apps within one Firebase project (preferred).
- Keep push keys/secrets in CI secret manager and use Fastlane to upload provisioning profiles / certificates per flavor.
*/

/* ===========================================================================
📌 10. DEEP LINKS & UNIVERSAL LINKS
===============================================================================
- Configure intent filters on Android per flavor (different host or path) or same host with different path.
- iOS: setup Associated Domains for each app id if using universal links.
- Make sure server can respond to both types or route via path.
*/

/* ===========================================================================
📌 11. CI/CD: Build & Release (Fastlane + GitHub Actions pattern)
===============================================================================
- Create separate lanes for each flavor:
  fastlane/Fastfile snippet (conceptual)
*/
const fastlane_snippet = `
lane :build_merchant do
  match(type: "appstore", app_identifier: "com.mycompany.merchant")
  gradle(task: "bundleMerchantRelease")
  # upload to Play Store / App Store Connect
end

lane :build_sales do
  match(type: "appstore", app_identifier: "com.mycompany.sales")
  gradle(task: "bundleSalesRelease")
end
`;

/*
- GitHub Actions: parameterized workflow build.yml that takes matrix flavor: [merchant, sales]
- Keep secrets in GH secrets or CI secret manager (keys per flavor).
*/

/* ===========================================================================
📌 12. SHARED & FLAVOR-SPECIFIC CODE PATTERN
===============================================================================
- Keep shared code in /src. For flavor-specific overrides use:
  /src/config/flavor.js (generated at build time) OR
  conditional imports:
    import MerchantHome from './screens/merchant/Home';
    import SalesHome from './screens/sales/Home';

- Avoid scattering Platform.checks; centralize flavor-based condition in a small helper:
*/
export const isMerchant = APP_FLAVOR === 'merchant';

/* ===========================================================================
📌 13. EXAMPLE: FLAVOR-BASED SCREEN REGISTRATION
===============================================================================
/* navigation/index.js (concept) */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MerchantHome from './screens/merchant/Home';
import SalesHome from './screens/sales/Home';

const Stack = createStackNavigator();
export default function RootStack() {
  if (isMerchant) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="MerchantHome" component={MerchantHome} />
        {/* merchant screens */}
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator>
      <Stack.Screen name="SalesHome" component={SalesHome} />
      {/* sales screens */}
    </Stack.Navigator>
  );
}

/* ===========================================================================
📌 14. PERMISSION & NATIVE DIFFERENCES
===============================================================================
- Different flavors may need different native permissions (camera, location). Keep AndroidManifest.xml and Info.plist per flavor/target.
- Use Gradle product flavor source sets to override AndroidManifest entries or use manifest placeholders.
*/

/* ===========================================================================
📌 15. STORYBOOK & COMPONENT LIBRARY
===============================================================================
- Run Storybook in dev; show both flavors by mocking flavor config in stories:
  - stories can render Merchant vs Sales components with different props.
- Keep shared components story-driven so both teams can preview variants.
*/

/* ===========================================================================
📌 16. TESTING STRATEGY
===============================================================================
- Unit tests: test logic independent of flavor (shared).  
- Integration: run separate E2E suites per flavor (Detox/Appium) using flavor-specific builds.  
- Visual tests: storybook snapshots for both themes/branding.  
- CI: matrix build & test per flavor (parallelize).
*/

/* ===========================================================================
📌 17. DEPLOYMENT & PLAY STORE / APP STORE (notes)
===============================================================================
- Each flavor -> separate app listing in stores (different package id / bundle id).  
- Separate store metadata, screenshots, and release tracks.  
- Manage app signing separately (keystores / provisioning profiles).
*/

/* ===========================================================================
📌 18. MONITORING & RELEASE MANAGEMENT
===============================================================================
- Use separate analytics keys / Sentry DSNs per flavor to isolate telemetry.  
- Tag releases by flavor in release notes.  
- Keep crash grouping by app id to avoid mixing merchant and sales data.
*/

/* ===========================================================================
📌 19. SECURITY & PRIVACY NOTES
===============================================================================
- Each flavor must have its own API keys & secrets where appropriate (do not share production secrets across flavors unless intended).  
- Keep secrets per flavor in CI secret manager and inject at build time.  
- Ensure permissions and attestation flow account for flavor differences.
*/

/* ===========================================================================
📌 20. MIGRATION & UPDATES (data model)
===============================================================================
- If both apps use same backend database, design multi-tenant schemas or include appType/tenantId fields.  
- Use feature flags and migrations that are backward compatible for both apps.
*/

/* ===========================================================================
📌 21. CHECKLIST — QUICK (before shipping both apps)
===============================================================================
✔ Define flavor requirements (bundleId, icon, server, permissions)  
✔ Configure Android productFlavors and iOS schemes/targets  
✔ Create env files per flavor and wire react-native-config or build script  
✔ Provide flavor-specific assets & assign to native targets  
✔ Setup separate push credentials & analytics for each flavor  
✔ CI pipeline builds/releases each flavor (Fastlane lanes)  
✔ E2E tests run for each flavor/build variant  
✔ Storybook stories include flavor previews  
✔ Monitor & separate telemetry by flavor/app id  
✔ Write a runbook for releasing & rotating secrets per flavor
*/

/* ===========================================================================
📌 22. COMMON PITFALLS & HOW TO AVOID
===============================================================================
✘ Scattering flavor checks across code — use central helper.  
✘ Sharing a single production API key among flavors — avoid; use distinct keys.  
✘ Forgetting to assign assets to correct iOS target — check target membership.  
✘ Not testing both flavors on low-end devices — do it.  
✘ Not isolating analytics/crash data by flavor — will mix signals.
*/

/* ===========================================================================
📌 23. SIMPLE INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: Why use productFlavors instead of runtime flags?  
A: Flavors give separate native metadata (bundle id, icons, provisioning). Runtime flags keep single binary but cannot change bundle id or native permissions.

Q2: How do you inject environment variables per flavor?  
A: Use react-native-config with separate .env files or configure Gradle/Xcode to copy correct config file at build time.

Q3: How do you manage push notifications across flavors?  
A: Each app flavor must have its own APNs certificate / Firebase app; configure in native project and CI.

Q4: How to avoid code duplication between Merchant & Sales screens?  
A: Keep shared UI and logic in common modules; only place differing screens under /screens/merchant and /screens/sales.

Q5: How to test both apps in CI?  
A: Use a build matrix (GitHub Actions / CircleCI) to build & run tests per flavor in parallel.
*/

/* ===========================================================================
📌 24. EXAMPLES & SNIPPETS (quick references)
===============================================================================
1) set build env for Android:  
   export APP_FLAVOR=merchant && ./gradlew assembleMerchantDebug

2) set build env for iOS using xcodebuild:  
   xcodebuild -scheme "MyAppMerchant" -configuration Release

3) runtime config read: (react-native-config)
   import Config from 'react-native-config';
   const apiUrl = Config.API_URL; // each flavor's .env provides value

4) feature-based import with dynamic require:
   const Home = isMerchant ? require('./screens/merchant/Home').default : require('./screens/sales/Home').default;
   // avoids bundling both heavy modules eagerly (Metro may still include both unless inline-requires used)
*/

/* ===========================================================================
📌 25. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Decide strategy: multi-flavor builds (separate apps) vs single binary + runtime flags.  
2) Use Android productFlavors + iOS schemes/targets for separate native metadata.  
3) Centralize flavor logic in small helper (APP_FLAVOR).  
4) Separate assets, API endpoints, push credentials per flavor.  
5) CI: build matrix + Fastlane lanes per flavor. 6) Test & monitor each flavor separately. 7) Keep shared code DRY and flavor-specific code limited and well-organized.
*/

/* ===========================================================================
📌 26. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Full android/app/build.gradle productFlavor example + resource layout + Gradle tasks  
  ✅ Full iOS step-by-step: creating targets, xcconfig, and asset catalogs + fastlane lanes  
  ✅ Monorepo approach with workspaces: shared-ui package + two RN apps example
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
