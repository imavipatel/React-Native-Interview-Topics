/**
 * react-native-large-project-architecture-notes-with-atomic.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly):
 * "How I would design project architecture for a large React Native app
 *  — now WITH Atomic Architecture (atomic design + clean layered approach)"
 *
 * Very simple language. Everything is easy to read and practical.
 * This is the previous full architecture guide with an added section
 * that explains how to include 'Atomic Architecture' ideas.
 *
 * Sections:
 *  0. Goal
 *  1. High-level principles
 *  2. Top-level folder structure (updated for atomic)
 *  3. Feature modules
 *  4. Navigation & route names
 *  5. State management
 *  6. API layer & services
 *  7. UI components & design system (Atomic Design included)
 *  8. Hooks
 *  9. Assets & theming
 * 10. Native modules
 * 11. Code splitting & lazy-loading
 * 12. Data persistence & offline
 * 13. Testing strategy
 * 14. Storybook & visual tests
 * 15. Linting, formatting, types
 * 16. CI / CD
 * 17. Performance & optimizations
 * 18. Monitoring & observability
 * 19. Docs & onboarding
 * 20. Git & team rules
 * 21. Security & secrets
 * 22. Sample file tree (updated for atomic)
 * 23. Patterns & best practices
 * 24. Migration & upgrades
 * 25. Checklist before starting a feature
 * 26. Interview Q&A
 * 27. Example: feature index
 * 28. Final cheat-sheet
 * 29. Next steps
 *
 * -----------------------------
 * NEW: Sections marked with ⭐ include Atomic Architecture ideas.
 * -----------------------------
 */

/* ===========================================================================
📌 0. GOAL — short & simple
===============================================================================
Make a project structure that:
  • is easy for many developers to work on
  • groups code so it's easy to find and change
  • keeps UI, business logic, and data separate
  • supports tests, fast builds, and safe releases
  • allows swapping implementations (e.g., local storage → remote) easily
*/

/* ===========================================================================
📌 1. HIGH-LEVEL PRINCIPLES (really important)
===============================================================================
Keep these rules in mind:
  1) Single responsibility: each file does one job.
  2) Feature modules: group code by feature (not by type).
  3) Small, focused components and helpers.
  4) Clear public API for each feature (index.js).
  5) Centralize shared things (styles, ui components, utils).
  6) Keep native code separated and minimal in JS.
  7) Automate checks with CI (lint, tests).
  8) Use version control and code owners for big modules.
  9) ⭐ Separate concerns: UI / Domain / Data (Atomic Architecture).
*/

/* ===========================================================================
📌 2. TOP-LEVEL FOLDER STRUCTURE (updated for Atomic Architecture)
===============================================================================
We keep feature modules, but inside each feature we follow a layered idea:
  - presentation (UI)  => React components, screens, hooks
  - domain (business)  => use-cases, small pure functions, interfaces
  - data (infrastructure) => API calls, local storage, mappers

Top-level structure (simple):
/src
  /app          -> App bootstrap, providers, RootNavigator
  /features     -> Feature modules (each uses atomic layers)
  /components   -> Shared atomic UI components (atoms/molecules/organisms)
  /navigation   -> App-level navigation and linking config
  /services     -> Cross-cutting services (apiClient, analytics)
  /stores       -> Global stores (Redux / Zustand)
  /hooks        -> Generic hooks
  /utils        -> Small helpers
  /assets       -> images, fonts, svgs
  /native       -> native wrappers
  /tests        -> e2e & helpers
  index.js
  App.js

Why this change?
  - It helps separate UI code from business rules and data code.
  - Each feature can be tested and changed more safely.
  - Teams can work on domain logic without touching UI.
*/

/* ===========================================================================
📌 3. FEATURE MODULES (what they contain) — with Atomic Layers ⭐
===============================================================================
Each feature folder should be self-contained and follow layers:

/features/<feature>
  /presentation   -> screens, UI components specific to feature, local hooks
  /domain         -> use-cases, pure business logic, interfaces/types
  /data           -> API calls, storage adapters, mappers, repository impl
  /components     -> feature-scoped components (small UI blocks)
  index.js        -> public exports (navigator, route names, top-level API)

Layer roles (simple):
  • presentation: React components, screens, visual behavior
  • domain: real app rules and logic (no React here ideally)
  • data: talks to network, DB, or native — implements interfaces domain expects

Example:
  - domain/useCases/fetchFeed.js  // pure logic: how to transform & validate feed
  - data/feedApi.js               // axios calls to /feed endpoint
  - presentation/FeedScreen.js    // uses useCases via a small hook

Why domain layer?
  - You can run unit tests easily
  - You can replace API with mock or offline DB without changing UI
  - Keeps business rules in one place
*/

/* ===========================================================================
📌 4. NAVIGATION & ROUTE NAMES (keep consistent)
===============================================================================
• Use a single place for route name constants to avoid typos.
• Each feature can export its own navigator.
• RootNavigator composes feature navigators.

Example:
export const ROUTES = {
  AUTH: { SIGNIN: 'Auth.SignIn' },
  MAIN: { HOME: 'Main.Home', CHAT: 'Main.Chat' },
  MODAL: { PAYMENT: 'Modal.Payment' }
};

Use navigation helpers:
function safeNavigate(name, params) {
  if (navigationRef.isReady()) navigationRef.navigate(name, params);
}
*/

/* ===========================================================================
📌 5. STATE MANAGEMENT (simple pick & rules)
===============================================================================
Options:
  • Redux Toolkit — good for large apps and predictable flows
  • Zustand / Jotai — simpler, lighter
  • React Query / Apollo — for server cache + sync

Rules:
  - Local UI state with useState/useReducer inside components
  - Global shared data in stores (auth, user)
  - Prefer domain/use-cases to call services, not components directly
  - Keep store shape well-documented and use selectors
  - Use TypeScript types (if using TS) to make contracts clear
*/

/* ===========================================================================
📌 6. API LAYER & SERVICES (clean network layer)
===============================================================================
Centralize API calls and networking logic:
  /src/services/apiClient.js  // axios instance + interceptors (auth/refresh)
  /features/<feature>/data/feedApi.js // feature-specific calls

Rules:
  - Do not call fetch or axios directly inside components
  - Let domain/use-cases call data/repository functions
  - Handle retries, token refresh, and errors centrally
  - Map raw network data into domain models before returning to domain layer
*/

/* ===========================================================================
📌 7. UI COMPONENTS & DESIGN SYSTEM (Atomic Design included) ⭐
===============================================================================
We use Atomic Design to organize shared UI components:

Atomic Design quick summary (simple):
  • Atoms: smallest pieces (Button, Text, Icon, Input)
  • Molecules: small groups of atoms (FormField: Label + Input + Error)
  • Organisms: larger UI blocks (Header, FeedItem)
  • Templates/Pages: screen layouts that combine organisms
  • Screens: final screens that fill routes

Folder example:
/src/components
  /atoms
    Button.js
    Text.js
    Icon.js
  /molecules
    FormField.js
    AvatarWithName.js
  /organisms
    FeedItem.js
    ChatMessageList.js
  /templates
    FeedTemplate.js
  /screens
    HomeScreenShell.js

Why Atomic?
  - Makes components reusable and consistent
  - Easier to test and document each small piece
  - Designers and devs can reason in small building blocks

How Atomic ties with feature modules:
  - Feature presentation uses atoms/molecules from /components
  - Feature-specific small components remain in /features/<feature>/components if they are not reusable

Storybook:
  - Storybook is great for documenting atoms/molecules and visual tests
*/

/* ===========================================================================
📌 8. HOOKS (reusable logic)
===============================================================================
/src/hooks
  useAuth()
  useNetworkStatus()
  useOfflineQueue()
  useFeatureFlag()

Rules:
  - Keep hooks focused
  - Hooks can call domain/use-cases, not the other way round
  - Document inputs and outputs
*/

/* ===========================================================================
📌 9. ASSETS & THEMING
===============================================================================
/src/assets
  /images
  /icons-svg
  /fonts

Theming:
  - Keep tokens in /src/theme (colors, spacing, typography)
  - Support light/dark themes with ThemeContext or library
  - Use consistent spacing and font tokens in atoms
*/

/* ===========================================================================
📌 10. NATIVE MODULES (Android / iOS)
===============================================================================
Keep native code small and organized:
/src/native
  /android        -> Kotlin wrappers
  /ios            -> Swift wrappers

Rules:
  - Use community libraries first
  - Only add native modules when necessary
  - Wrap native calls into data adapters inside the data layer
  - For example: data/deviceInfoAdapter.js calls native DeviceInfo module
*/

/* ===========================================================================
📌 11. CODE SPLITTING & LAZY LOADING
===============================================================================
Why: reduce app startup time and JS bundle size.

How:
  - Lazy-load feature navigators with React.lazy + Suspense
  - Lazy-load heavy libs (maps, video players)
  - Use Hermes for faster startup where possible
*/

/* ===========================================================================
📌 12. DATA PERSISTENCE & OFFLINE
===============================================================================
Store options:
  - MMKV for small fast key/value
  - SQLite / Realm for large relational data
  - WatermelonDB for big lists

Rules:
  - Data layer implements repository interface used by domain/use-cases
  - Use migrations for DB schema updates
  - Encrypt sensitive local data if needed
  - Persist queue for offline actions in data layer
*/

/* ===========================================================================
📌 13. TESTING STRATEGY
===============================================================================
Unit tests:
  - Test domain use-cases and pure functions
  - Test reducers and store logic

Component tests:
  - Test atoms/molecules/organisms with RTL (React Native Testing Library)

Integration:
  - Test feature flows (mock data layer)

E2E:
  - Detox or Appium for main flows (login, payments)

Why test domain layer separately?
  - Domain logic has no React, so tests are fast and clear
  - You can verify rules without rendering UI
*/

/* ===========================================================================
📌 14. STORYBOOK & VISUAL TESTS
===============================================================================
Use Storybook for:
  - Building atoms and molecules in isolation
  - Visual regression testing (Chromatic / Loki)
  - Quick UI reviews with designers
*/

/* ===========================================================================
📌 15. LINTING, FORMATTING, TYPES (quality)
===============================================================================
Tools:
  - Prettier for formatting
  - ESLint for lint rules
  - TypeScript for types (recommended)
  - Husky + lint-staged for pre-commit checks

Rules:
  - Run lint + typecheck in CI
  - Keep ESLint rules moderate; use Prettier for formatting
*/

/* ===========================================================================
📌 16. CI / CD (quick)
===============================================================================
CI steps:
  - Lint, typecheck, unit tests
  - Build JS bundle for staging
  - Build staging binary and upload to testers
  - On release, build signed production binaries and upload to stores

Use:
  - GitHub Actions / Bitrise / CircleCI
  - Fastlane for signing & upload
  - CI secrets for keystore and provisioning
*/

/* ===========================================================================
📌 17. PERFORMANCE & OPTIMIZATIONS
===============================================================================
Common concerns:
  • Startup time, memory use, JS thread blocking

Tips:
  - Use Hermes for better startup
  - Keep components small; memoize heavy lists
  - Move heavy work off JS thread (native or background)
  - Use FlatList optimization for long lists
  - Profile with Flipper / Instruments
*/

/* ===========================================================================
📌 18. MONITORING & OBSERVABILITY
===============================================================================
Track:
  - Crashes (Sentry or Crashlytics)
  - Slow screens and key flows
  - Release health metrics (crash rate, startup time)

Add:
  - Error boundaries and global error handler
  - Telemetry for slow network and large failures
*/

/* ===========================================================================
📌 19. DOCUMENTATION & ONBOARDING
===============================================================================
Keep docs:
  - README.md (run app)
  - CONTRIBUTING.md (rules)
  - ARCHITECTURE.md (explain atomic layers & folder)
  - Setup scripts and local dev checklists
Create onboarding checklist for new hires
*/

/* ===========================================================================
📌 20. GIT & TEAM RULES
===============================================================================
• Small PRs, descriptive titles
• Require passing CI before merge
• Use CODEOWNERS for module reviewers
• Use feature branches and feature flags for big work
*/

/* ===========================================================================
📌 21. SECURITY & SECRETS
===============================================================================
• Don’t commit secrets (.env ignored)
• Use CI secret manager for builds
• Store tokens in secure storage (Keychain/Keystore/MMKV encrypted)
• Validate inputs and limit privileges
*/

/* ===========================================================================
📌 22. SAMPLE FILE TREE (updated for Atomic Architecture)
===============================================================================
/src
  /app
    App.js
    bootstrap.js
    Providers.js
    RootNavigator.js
  /components
    /atoms
      Button.js
      Text.js
      Icon.js
    /molecules
      FormField.js
      AvatarWithName.js
    /organisms
      Header.js
      FeedItem.js
  /features
    /auth
      /presentation
        screens/SignInScreen.js
        components/AuthHeader.js
      /domain
        useCases/loginUser.js
        validators.js
      /data
        authApi.js
        authRepository.js
      index.js
    /feed
      /presentation
        FeedStack.js
        screens/FeedScreen.js
        components/FeedFilters.js
      /domain
        useCases/fetchFeed.js
        models/feedItem.js
      /data
        feedApi.js
        feedRepository.js
      index.js
  /navigation
    routeNames.js
    linking.js
  /services
    apiClient.js
    analytics.js
    storageAdapter.js
  /stores
    store.ts
    authSlice.ts
  /hooks
    useNetworkStatus.js
    useOfflineQueue.js
  /utils
    formatDate.js
  /assets
    fonts/
    images/
  /native
    android/
    ios/
  /tests
  index.js

Notes:
  - Each feature has presentation/domain/data folders — this is the Atomic/Layered idea.
  - Shared atoms/molecules live under /components so many features can reuse them.
*/

/* ===========================================================================
📌 23. PATTERNS & BEST PRACTICES (quick)
===============================================================================
• Feature-first + layered inside feature (presentation/domain/data)  
• Use components/atoms for UI building blocks  
• Let domain use-cases be pure functions where possible  
• Data layer implements repository interface consumed by domain code  
• Keep side-effects (network, storage) in data/services layer  
• Use dependency injection when useful (pass adapters to use-cases)  
• Use TypeScript interfaces for contracts between layers
*/

/* ===========================================================================
📌 24. MIGRATION & UPGRADES (how to plan)
===============================================================================
• Keep an upgrade plan for RN and native libs
• Test upgrades in canary builds
• Automate dependency checks (Dependabot)
• Keep migration notes in ARCHITECTURE.md
*/

/* ===========================================================================
📌 25. CHECKLIST BEFORE STARTING A NEW LARGE FEATURE
===============================================================================
✔ Create /features/<feature> folder with presentation/domain/data  
✔ Add route name in routeNames.js  
✔ Add use-case functions in domain/useCases  
✔ Add repository adapters in data/ (api + storage)  
✔ Add UI atoms/molecules if needed or reuse shared ones  
✔ Add tests for domain & api layer  
✔ Add story in Storybook for new UI components  
✔ Add codeowners + reviewer for the feature
*/

/* ===========================================================================
📌 26. INTERVIEW Q&A (simple)
===============================================================================
Q1: What is Atomic Architecture here?
A: It's a small set of rules: UI is built from atoms -> molecules -> organisms, and each feature is split into presentation (UI), domain (business rules), and data (API & storage). This keeps code clear and testable.

Q2: Why separate domain from data?
A: So your business rules don't depend on network or local DB. You can test logic without talking to network.

Q3: Where do components live?
A: Reusable UI pieces live in /components (atoms/molecules/organisms). Feature-specific UI lives in the feature's presentation folder.

Q4: How do features talk to API?
A: Presentation calls domain use-cases -> use-cases call data/repository -> repository calls apiClient. This gives clear boundaries.

Q5: How does this help large teams?
A: Teams can own features, change data implementation (mock or different backend) without touching UI, and test domain logic easily.
*/

/* ===========================================================================
📌 27. EXAMPLE: Simple Feature index.js (what to export)
===============================================================================
/*
 // features/feed/index.js
 import FeedStack from './presentation/FeedStack';
 export { FeedStack };
 export const FEED_ROUTES = { LIST: 'Feed.List', ITEM: 'Feed.Item' };
*/

/* ===========================================================================
📌 28. FINAL CHEAT-SHEET (one-page)
===============================================================================
- Use feature modules with layers: presentation / domain / data  
- Build UI from atoms -> molecules -> organisms (Atomic Design)  
- Let domain use-cases be pure and tested without React  
- Keep API & storage code inside data layer (adapters/repositories)  
- Reuse atoms/molecules from /components across features  
- Run CI: lint, typecheck, tests, build  
- Use Storybook for UI components and visual tests
*/

/* ===========================================================================
📌 29. NEXT STEPS (practical offers)
===============================================================================
I can create (all beginner-friendly):
  ✅ Starter repo scaffold that implements this structure (with sample feed & auth feature)
  ✅ Template feature module with presentation/domain/data and tests
  ✅ Storybook setup for atomic components + sample stories
  ✅ Example of dependency injection pattern for use-cases and repositories

Tell me which one you want and I'll make it in the same single-file JS Notes beginner-friendly format.
*/
