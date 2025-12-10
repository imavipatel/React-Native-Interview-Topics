/**
 * react-native-large-navigation-architecture-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "How to handle large-scale navigation in big React Native projects"
 *
 * - High-level architecture & folder structure
 * - Patterns: feature modules, lazy-loading, native stacks, deep linking, permissions
 * - Performance: virtualization, detach/unmount, native stack vs JS stack
 * - Routing strategies: nested navigators, URL-style routes, dynamic routes
 * - State & side-effect management for navigation
 * - Testing, analytics, observability, and migration tips
 * - Copy-pasteable patterns and checklist
 *
 * Use this as a reference / interview cheat-sheet / implementation guide.
 */

/* ===========================================================================
📌 0. PROBLEM SUMMARY — why large navigation is hard
===============================================================================
• Hundreds of screens, many nested flows (auth, onboarding, main app, admin)
• Multiple teams owning features → merge conflicts & inconsistent patterns
• Performance issues: many mounted screens, heavy transitions, memory pressure
• Deep linking & universal links across nested flows
• Shared modal/overlay flows (payments, OTPs, onboarding)
• Version upgrades & migration (React Navigation, native modules, Fabric)
Goal: design navigation that is modular, performant, testable, and scalable.
*/

/* ===========================================================================
📌 1. HIGH-LEVEL ARCHITECTURE (recommended)
===============================================================================
App Root
 ├─ Auth Module (auth stack)                // feature module
 ├─ Onboarding Module (wizard stack)
 ├─ Main Module (tab navigator)
 │    ├─ Feed Feature (stack)
 │    ├─ Search Feature (stack)
 │    ├─ Chat Feature (stack + native stack for 1:1)
 │    └─ Profile Feature (stack)
 ├─ Admin Module (separate feature shell)
 └─ Global Modals / Overlays (portal / root-level)
Key idea: split into feature modules each exposing a navigator. The App Root composes them.
*/

/* ===========================================================================
📌 2. FOLDER & FILE ORGANIZATION (example)
===============================================================================
/src
  /navigation
    /rootNavigator.js               // composes top-level navigators + providers
    /AppNavigator.js                // main entry (handles deep linking & auth gating)
    /navigationConfig.js            // linking config, nav middleware
  /features
    /feed
      /FeedStack.js                 // stack navigator for feed
      /screens
        FeedListScreen.js
        FeedDetailScreen.js
      /index.js                     // exports navigator + route names
    /chat
      /ChatStack.js
      /nativeTransitions.js
      /index.js
    /profile
      ...
  /common
    /navigation
      routeNames.js                 // centralized route name constants
      navigationHelpers.js          // typed helpers, param builders
*/

/* ===========================================================================
📌 3. ROUTE NAMES & TYPES — centralize constants
===============================================================================
Why: avoid string typos, easy refactor, better TypeScript types.

Example:
export const ROUTES = {
  AUTH: {
    SIGNIN: 'Auth.SignIn',
    SIGNUP: 'Auth.SignUp',
  },
  MAIN: {
    HOME: 'Main.Home',
    SEARCH: 'Main.Search',
    CHAT: 'Main.Chat',
  },
  MODAL: {
    PAYMENT: 'Modal.Payment',
  },
};

Use typed navigation helpers:
navigateToProfile(userId) => navigation.navigate(ROUTES.MAIN.PROFILE, { userId })
*/

/* ===========================================================================
📌 4. FEATURE MODULES & Lazy Loading
===============================================================================
Pattern:
• Each feature exports a navigator (stack/tab) and its route constants.
• App Root lazy-loads feature navigators using dynamic import / React.lazy
Benefits:
• Faster cold start (bundle split)
• Teams can work independently
• Smaller initial JS memory

Example (concept):
const FeedNavigator = React.lazy(() => import('../features/feed/FeedStack'));
...
<Suspense fallback={<Loading />}>
  <FeedNavigator />
</Suspense>

Notes:
• For native-stack heavy transitions, prefer createNativeStackNavigator (react-native-screens).
• Ensure bundler supports dynamic imports. For TypeScript, keep types with `import()` types.
*/

/* ===========================================================================
📌 5. NATIVE STACK vs JS STACK — when to use which
===============================================================================
Native Stack (react-native-screens / native transitions)
  • Use for performance-critical, modal-heavy flows and many screen transitions
  • Pros: native transitions, less JS overhead
  • Cons: native integration complexity, fewer JS-driven transition customizations

JS Stack (react-navigation + Reanimated)
  • Use for flexible, animated flows and cross-platform parity
  • Pros: fully JS-customizable transitions, shared code
  • Cons: more JS work, can be heavier for huge screen sets

Rule: mix and match. Use native stack for main heavy flows (chat, feed) and JS stacks for feature-level flows that need complex custom animation.
*/

/* ===========================================================================
📌 6. ROOT-LEVEL OVERLAYS & PORTALS
===============================================================================
Problem: Modals or onboarding flows must appear above any navigator.
Solution: Root-level modal host (single source of truth), render using Portal pattern.

Example root composition:
<NavigationContainer>
  <RootNavigator />        // handles auth gating & main tabs
  <GlobalModalHost />     // renders payment, language picker, global alerts
</NavigationContainer>

GlobalModalHost uses context to open/close modals from anywhere.
*/

/* ===========================================================================
📌 7. DEEP LINKING & URL ROUTING (scale-friendly)
===============================================================================
• Maintain a centralized linking config mapping URL paths to nested routes.
• Use path params for deeper routes: '/feed/:feedId/item/:itemId'
• Support fallback routes & guarded routes (auth guard)
• Versioned links: include app-version or route-version if needed

Linking config example:
const linking = {
  prefixes: ['myapp://', 'https://app.example.com'],
  config: {
    Main: {
      screens: {
        Home: 'home',
        Feed: {
          path: 'feed/:feedId',
          parse: { feedId: Number },
          screens: { Item: 'item/:itemId' }
        },
        Chat: 'chat/:threadId',
      }
    }
  }
};

Always test nested deep links and cold-start deep links.
*/

/* ===========================================================================
📌 8. NAVIGATION STATE MANAGEMENT & Persistence
===============================================================================
• Keep navigation state inside NavigationContainer (React Navigation).
• For very large apps, persist minimal nav state (last route) instead of full tree.
• When supporting multi-window or multi-surface, snapshot surfaces independently.
• Use state persistence for: restoring last visited tab, unfinished flows.

Caveat: serialized nav state can be large; persist only required keys.
*/

/* ===========================================================================
📌 9. PARAMS, CONTRACTS & Param Validation
===============================================================================
• Use typed params (TypeScript generics) per navigator to avoid runtime errors.
• Centralize param validators for deep links: parse & validate URL params.
• Defensive: If param missing/invalid, navigate to a safe fallback (e.g., home) or show error.
*/

/* ===========================================================================
📌 10. PERFORMANCE STRATEGIES (must-have)
===============================================================================
1) Detach or unmount inactive screens:
   - use react-navigation option `detachInactiveScreens` or `unmountOnBlur`
   - only keep what you need mounted to reduce memory

2) Windowing / Virtualization:
   - For lists, use FlatList/SectionList with getItemLayout & initialNumToRender
   - Avoid rendering heavy lists in tabs that remain mounted

3) Code-splitting & Lazy loading:
   - Lazy-load big feature bundles or rarely-used screens

4) Native stacks for heavy transitions:
   - Use createNativeStackNavigator for main flows

5) Use shouldComponentUpdate / React.memo on heavy screens:
   - Avoid re-renders from unrelated navigation state changes

6) Profile:
   - Use Flipper / React DevTools / native profilers to find JS thread and UI thread bottlenecks
*/

/* ===========================================================================
📌 11. BACK HANDLING & ANDROID ENTRIES
===============================================================================
• Centralize hardware back handling:
  - React Navigation handles back by default
  - For custom behavior, add listeners at screen-level and use navigation.canGoBack
• Ensure deep link & notification entry points map correctly to navigation state
• Prevent multiple handlers by using navigation listeners and returning unsubscribe
*/

/* ===========================================================================
📌 12. AUTH GATING & Multi-flow (pattern)
===============================================================================
Common pattern: AuthGate at root.

<App>
  <NavigationContainer>
    {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
  </NavigationContainer>
</App>

For SSO / multiple account types:
• Use separate stacks or flows per account type
• Keep auth state in central store (Redux / Zustand) and derive navigation from that state
• Avoid putting heavy logic inside NavigationContainer render to prevent re-renders
*/

/* ===========================================================================
📌 13. ROUTE GUARDS & Permission Checks
===============================================================================
• Use higher-order screen wrappers or navigation middleware to check permissions
• Example: before navigating to camera flow, check camera permission; if not granted, request first
• Do not let route params or deep link bypass permission checks — validate at entry
*/

/* ===========================================================================
📌 14. NAVIGATION MIDDLEWARE & ANALYTICS
===============================================================================
• Hook into navigation state changes to emit analytics:
  navigationRef.addListener('state', () => { ... })
• Centralize telemetry (screen view timing, duration)
• Use background batching to send analytics to server to reduce impact on nav performance
• Avoid heavy work inside navigation listeners — offload to background task or throttle
*/

/* ===========================================================================
📌 15. TESTING STRATEGIES (unit & integration)
===============================================================================
Unit tests:
  • Test route helpers, param builders, and linking config
  • Mock navigation object for screen unit tests

Integration tests:
  • E2E with Detox / Appium:
     - Test major flows: login -> onboarding -> main tab -> deep link -> share flow
     - Test back behavior and multi-window scenarios

Snapshot tests:
  • Avoid large UI snapshots on large navigators; prefer component-level snapshots

CI:
  • Run route-linting script (detect duplicate route names, missing params)
*/

/* ===========================================================================
📌 16. TEAM & CODE OWNERSHIP (scale concerns)
===============================================================================
• Assign team-owned feature modules with clear boundaries
• Create navigation style guide (route naming, params, modal vs stack decisions)
• PR template: include navigation tests and performance notes for new screens
• Centralize shared components (headers, back handlers, modal host)
*/

/* ===========================================================================
📌 17. MIGRATION & VERSIONING (when upgrading nav lib/arch)
===============================================================================
• Canaries: roll new navigator versions to small percentage of users / internal builds
• Maintain backward-compatible linking config for old app versions
• Use feature flags to enable new nav flows gradually
• Keep a migration plan: tests, flipper checks, memory profiling for each RN upgrade
*/

/* ===========================================================================
📌 18. SAMPLE PATTERNS & SNIPPETS
===============================================================================

1) Feature module export (index.js)
export { default as FeedNavigator } from './FeedStack';
export const FEED_ROUTES = { LIST: 'Feed.List', DETAIL: 'Feed.Detail' };

2) Root composition (rootNavigator.js)
function RootNavigator() {
  const isAuth = useSelector((s) => s.auth.isLoggedIn);
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {isAuth ? <MainModule /> : <AuthModule />}
      <GlobalModalHost />
    </NavigationContainer>
  );
}

3) Lazy load feature
const ProfileNavigator = React.lazy(() => import('../features/profile/ProfileStack'));
<Suspense fallback={<Loading />}>
  <ProfileNavigator />
</Suspense>

4) Safe navigate helper
export function safeNavigate(name, params) {
  if (navigationRef.isReady()) navigationRef.navigate(name, params);
}

*/

/* ===========================================================================
📌 19. CHECKLIST (actionable)
===============================================================================
✔ Centralize route names & linking config
✔ Organize features as independent navigators
✔ Use lazy loading / code-splitting for heavy features
✔ Use native stack for performance-critical flows
✔ Minimize mounted screens (detachInactiveScreens / unmountOnBlur)
✔ Persist minimal nav state if needed; avoid large serializations
✔ Centralize global modals & portals
✔ Implement thorough deep linking tests (cold start + warm start)
✔ Throttle analytics and avoid heavy work on nav listeners
✔ Add CI checks and navigation linting
✔ Profile memory and JS/UI thread for navigation flows
✔ Create team style guide for navigation patterns

/* ===========================================================================
📌 20. INTERVIEW Q&A (short)
===============================================================================
Q: How to scale navigation with 200 screens?
A: Use feature module navigators, lazy-load large modules, use native-stack for heavy flows, detach inactive screens, and centralize route names.

Q: How to handle deep links to nested flows?
A: Use a centralized linking config that maps URL paths to nested screens; ensure parsing & param validation; test cold start paths.

Q: Native stack vs JS stack — pick?
A: Mix: native stack for fluid system-like transitions, JS stack for flexible/custom animations. Use native where performance matters.

Q: How to avoid memory issues with many screens?
A: Detach/unmount inactive screens, avoid keeping heavy state in mounted inactive screens, use FlatList virtualization, profile regularly.

Q: How to enable independent team development?
A: Feature modules with exported navigators, code ownership, route contracts, and PR rules for navigation changes.

*/

/* ===========================================================================
📌 21. WANT NEXT?
===============================================================================
I can produce (single-file JS Notes):
  ✅ Full example repo structure + code-splitting config (Metro / Babel)
  ✅ "Nav lint" script to validate route names & params
  ✅ Native-stack performance benchmarks & tuning tips
  ✅ E2E test suite (Detox) examples for complex navigation flows

Tell me which one and I’ll provide it in this same format.
*/
