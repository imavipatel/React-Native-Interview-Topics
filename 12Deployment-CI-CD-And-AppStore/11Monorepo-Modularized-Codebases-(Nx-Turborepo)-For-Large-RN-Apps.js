/*********************************************************
 * Monorepo / Modularized Codebases for Large React Native Apps
 * Nx • Turborepo • workspace layout • metro • native handling
 * Copy-ready JS notes file — use as documentation or checklist
 *********************************************************/

/*********************************************************
 * SECTION 0 — CONTEXT & GOALS
 *********************************************************/
/**
 * Goals:
 *  - Support multiple apps (iOS/Android/web) + shared libraries.
 *  - Fast CI via computation/remote caching and affected-only builds.
 *  - Clear boundaries: app vs feature vs native modules vs infra.
 *  - Easy local dev: consistent package manager and metro configuration.
 *
 * Tools commonly used:
 *  - Nx (strong plugin system, Nx Cloud caching & affected detection)
 *  - Turborepo (lightweight orchestration, remote caching, fast pipelines)
 *  - Package managers: pnpm, yarn (berry), npm workspaces
 */

/*********************************************************
 * SECTION 1 — HIGH-LEVEL ARCHITECTURE & WORKSPACE LAYOUT
 *********************************************************/
/**
 * Common repo layout (apps/libraries pattern)
 *
 * root/
 * ├─ apps/
 * │  ├─ mobile-app/          # React Native app (iOS + Android)
 * │  ├─ mobile-app-staging/  # optional variant
 * │  └─ web/                 # React web (shared UI/libs)
 * ├─ packages/
 * │  ├─ ui/                  # shared UI components (React + RN)
 * │  ├─ design-tokens/       # tokens, color system
 * │  ├─ hooks/               # shared hooks and utilities
 * │  ├─ services/            # shared API clients, business logic
 * │  └─ native-modules/      # shared native modules (Android/iOS)
 * ├─ tools/                  # scripts for dev/CI (lint, format, release)
 * ├─ package.json
 * ├─ pnpm-workspace.yaml     # or yarn workspace config
 * └─ turbo.json / nx.json    # turborepo / nx workspace config
 *
 * Principles:
 *  - Keep apps thin; move reusable code to packages/*.
 *  - Use TypeScript with `paths` where appropriate.
 *  - Prefer small focused packages (single responsibility).
 */

/*********************************************************
 * SECTION 2 — CHOOSING A MONOREPO TOOL (Nx vs Turborepo)
 *********************************************************/
/**
 * Considerations:
 *  - Nx:
 *    * Rich plugin ecosystem (React, React Native plugin, builders).
 *    * Graph analysis, affected commands, Nx Cloud caching & orchestration.
 *    * Good for enterprise-scale repos with complex pipelines.
 *    * (Docs & RN plugin: see Nx React Native docs)
 *
 *  - Turborepo:
 *    * Fast, simple task pipeline and remote caching.
 *    * Good starter examples & create-turbo bootstrap.
 *    * Lightweight mental model; integrates with pnpm/yarn.
 *
 * Recommendation pattern:
 *  - If you need deep integrations, generators, and advanced task graph features → Nx.
 *  - If you want a simpler pipeline-focused tool with excellent JS/TS build caching → Turborepo.
 *
 * (Both can work; choose based on team familiarity and existing CI/tooling.)
 */

/*********************************************************
 * SECTION 3 — PACKAGE MANAGER & NODE LINKING
 *********************************************************/
/**
 * Package manager choices:
 *  - pnpm (recommended for monorepos: disk space, unique node_modules layout)
 *  - yarn berry (works well, requires PnP or node-linker config)
 *  - npm workspaces (simpler but fewer workspace features)
 *
 * RN caveat:
 *  - React Native + pnpm historically needed extra steps for Metro and native dependency resolution.
 *  - Use workspace-level node_modules setup and configure Metro (resolver) to handle workspaces.
 *
 * Example pnpm-workspace.yaml:
 * packages:
 *  - 'apps/*'
 *  - 'packages/*'
 */

/*********************************************************
 * SECTION 4 — Metro (packager) IN A MONOREPO
 *********************************************************/
/**
 * Metro must resolve modules across workspaces. Common techniques:
 * 1) Use a single root-level metro.config.js that adds watchFolders and resolver extraNodeModules.
 * 2) Add project roots for shared packages and symlinked node_modules resolution.
 *
 * Example metro.config.js (skeleton):
 */
//
// const path = require('path');
// const { getDefaultConfig } = require('metro-config');
//
// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig();
//   return {
//     resolver: {
//       // map workspace packages to node resolution
//       extraNodeModules: new Proxy({}, {
//         get: (target, name) => path.resolve(__dirname, `node_modules/${name}`),
//       }),
//       // optionally include sourceExts and assetExts
//     },
//     watchFolders: [
//       path.resolve(__dirname, 'packages'),
//     ],
//     transformer: {
//       // Hermes, inlineRequires etc. (project-specific)
//     },
//   };
// })();
//

/**
 * Notes:
 *  - Add shared packages to watchFolders so Metro rebuilds on change.
 *  - For Windows/mac differences, ensure paths are normalized.
 *  - When using pnpm, set nodeLinker: node-modules in .npmrc or follow pnpm RN workarounds.
 */

/*********************************************************
 * SECTION 5 — SHARING UI CODE (React + React Native)
 *********************************************************/
/**
 * Two main patterns for shared components:
 * 1) Platform-specific files: Button.native.tsx, Button.web.tsx
 * 2) Single component with platform-specific implementations (Platform.OS checks)
 *
 * Packaging:
 *  - packages/ui package exports components; configure build (babel/tsc) to output both cjs/esm.
 *  - Use `react-native` field in package.json for RN-specific entry if needed.
 *
 * Example package.json for shared UI:
 * {
 *  "name": "@org/ui",
 *  "version": "0.0.0",
 *  "main": "dist/index.js",
 *  "react-native": "dist/index.native.js",
 *  "types": "dist/index.d.ts"
 * }
 */

/*********************************************************
 * SECTION 6 — NATIVE MODULES & Linking
 *********************************************************/
/**
 * Native modules in monorepo:
 *  - Keep native code in packages/native-modules/<module>-android / -ios or in apps/<app>/android
 *  - For local native modules, ensure Gradle includes the project as an included build or composite build.
 *
 * Android (settings.gradle):
 * include ':app', ':shared-module'
 * project(':shared-module').projectDir = new File(rootProject.projectDir, '../packages/native-modules/mylib/android')
 *
 * iOS:
 * - Use CocoaPods workspace and add local podspecs pointing to package paths.
 * - Podfile example:
 *   pod 'mylib', :path => '../packages/native-modules/mylib/ios'
 *
 * Keep native build scripts small and avoid heavy configuration inside top-level build files.
 */

/*********************************************************
 * SECTION 7 — BUILD & CI STRATEGY
 *********************************************************/
/**
 * Goals:
 *  - Fast incremental builds.
 *  - Only build/test affected apps/packages on PRs.
 *  - Use remote cache (Nx Cloud or Turborepo remote cache) to skip repeated tasks.
 *
 * CI tips:
 *  - Use workspace-level cache for node_modules + Gradle caches.
 *  - Use `nx affected:build/test` or `turbo run build --filter=...` patterns to run only changed targets.
 *  - Push cache only from main/release pipelines; use read-only pulls for PRs for safety.
 *
 * Example Nx commands (affected):
 * nx affected:apps --base=origin/main --head=HEAD
 * nx affected --target=build --parallel
 *
 * Example Turborepo:
 * turbo run build --filter=... (use pipeline caching + remote store)
 */

/*********************************************************
 * SECTION 8 — TESTING, LINTING & E2E IN MONOREPO
 *********************************************************/
/**
 * Unit tests:
 *  - Keep per-package jest configs or a root jest config that maps package paths.
 *  - Use projectName or projects array in jest.config.js to target packages.
 *
 * E2E:
 *  - Centralize e2e tests in e2e/ using Detox / Appium.
 *  - Trigger e2e only for apps affected by changes to app/native code.
 *
 * Linting/Formatting:
 *  - Run ESLint/Prettier across workspace or per-package; use affected detection to reduce CI time.
 */

/*********************************************************
 * SECTION 9 — VERSIONING, PUBLISHING & DEPLOYMENT
 *********************************************************/
/**
 * Approaches:
 *  - Independent versioning: each package has own version and release cadence.
 *  - Monorepo (single) versioning: bump everything together (easier for small teams).
 *
 * Tools:
 *  - Changesets, Lerna (classic), or Nx/Turbo workflows for publish pipelines.
 *
 * Recommendation:
 *  - For large teams and independent libraries use changesets / independent versioning.
 */

/*********************************************************
 * SECTION 10 — MAINTENANCE, UPGRADES & RN UPGRADES
 *********************************************************/
/**
 * Upgrading RN:
 *  - Upgrade strategy should include isolation: upgrade in a feature branch and run affected:build/test for all RN apps.
 *  - Maintain a small "canary" app in workspace to validate new RN versions if you have many apps.
 *
 * Dependency hygiene:
 *  - Keep shared dep versions in sync where possible (peerDependencies).
 *  - Use renovate/Dependabot with package grouping to avoid conflicting upgrades.
 */

/*********************************************************
 * SECTION 11 — PERFORMANCE & DEV DX TIPS
 *********************************************************/
/**
 * - Use caching (Nx Cloud / Turbo remote cache) aggressively for builds and tests.
 * - Configure local dev to use watch mode for shared libs (watchFolders + babel).
 * - Provide scripts: `yarn dev:mobile`, `yarn dev:web`, `yarn build:ui` to simplify commands.
 * - Add `yarn workspace <pkg> <cmd>` wrappers or root-level runner scripts.
 */

/*********************************************************
 * SECTION 12 — COMMON PITFALLS & TROUBLESHOOTING
 *********************************************************/
/**
 * 1) Metro can't find modules from workspace -> ensure watchFolders + extraNodeModules configured.
 * 2) pnpm + RN native modules issues -> prefer node-modules linking or specific pnpm config.
 * 3) Native path resolution for Android/iOS -> use relative projectDir includes in Gradle/Podfile.
 * 4) Caching returns stale artifacts -> pin cache keys to commit or branch rules and clear when upgrading toolchains.
 * 5) Too-large packages -> split responsibilities; avoid huge shared packages that cause rebuilds across apps.
 */

/*********************************************************
 * SECTION 13 — EXAMPLE SCRIPTS (root package.json snippets)
 *********************************************************/
/**
 * "scripts": {
 *   "dev:mobile": "cd apps/mobile-app && react-native start",
 *   "android": "cd apps/mobile-app && react-native run-android",
 *   "ios": "cd apps/mobile-app && react-native run-ios",
 *   "build:ui": "pnpm -w -r run build --filter @org/ui...",
 *   "lint": "pnpm -w -r run lint",
 *   "test": "pnpm -w -r run test"
 * }
 */

/*********************************************************
 * SECTION 14 — INTERVIEW Q&A (flashcards)
 *********************************************************/
/**
 * Q1: Why use a monorepo for React Native + web?
 * A1: Share code, enforce consistency, reduce duplication, and enable cross-project refactors with tools that compute affected targets.
 *
 * Q2: How do you make Metro work across workspace packages?
 * A2: Configure root-level metro.config.js with watchFolders and extraNodeModules so Metro resolves packages outside the app directory.
 *
 * Q3: Should I use pnpm or yarn in RN monorepos?
 * A3: pnpm is popular for space & speed, but RN may need node-modules style linking; test and choose the least friction approach for native toolchains.
 *
 * Q4: How do you run only affected builds in CI?
 * A4: Use `nx affected` commands for Nx, and Turborepo filtering (`--filter`) to run pipelines only for changed projects.
 *
 * Q5: What are key native-module handling patterns?
 * A5: Keep native code in package directories and include them into Gradle/CocoaPods using relative paths; avoid fragile symlink assumptions.
 */

/*********************************************************
 * END OF NOTES
 *********************************************************/
