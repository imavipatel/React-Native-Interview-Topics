/*********************************************************
 * 🛑 Git pre-push hooks — Block Faulty Builds (copy-ready JS notes)
 * Filename: git_prepush_hooks_block_faulty_builds.js
 *
 * - Covers: raw git hook, Husky, lint-staged, sample scripts
 * - Goals: prevent pushes that would break CI or ship broken code
 * - Principle: Client-side hooks improve developer feedback, but DO NOT replace server-side CI checks
 *********************************************************/

/*********************************************************
 * SECTION 1 — WHY PRE-PUSH HOOKS?
 *********************************************************/
/**
 * - Prevents simple mistakes from reaching CI/main branch (failing tests, linting errors, failing builds).
 * - Saves CI time and developer context switching.
 * - Improves developer feedback loop (local fast failures).
 *
 * ⚠️ Important: Client-side hooks can be bypassed (e.g. `--no-verify`) and can't be fully trusted.
 * Always enforce critical checks in CI as the final gate.
 */

/*********************************************************
 * SECTION 2 — HIGH-LEVEL STRATEGY
 *********************************************************/
/**
 * 1) Fast, local checks in pre-commit or pre-push (lint, unit tests, typecheck).
 * 2) More expensive checks (integration tests, full Android/iOS debug builds) optionally gated:
 *    - run only on branches targeting release/main, OR
 *    - run in CI as the authoritative gate.
 * 3) Provide clear bypass options and "how to fix" messages.
 * 4) Use caching & parallelism to keep hooks snappy.
 */

/*********************************************************
 * SECTION 3 — SIMPLE RAW GIT pre-push HOOK (POSIX shell)
 *********************************************************/
/**
 * Place this file as .git/hooks/pre-push (make executable: chmod +x .git/hooks/pre-push)
 *
 * This example:
 *  - Runs lint, typecheck, unit tests (fast)
 *  - Fails the push if any command exits non-zero
 *
 * Notes:
 *  - Keep commands fast (use --silent/--maxWorkers appropriately)
 *  - If a command is expensive, gate it behind branch checks
 */

//
// .git/hooks/pre-push
//
/*
#!/bin/sh
# abort on error
set -e

# Only run on pushes to protected branches (example)
protected_branches="main master release"
refname=$(git rev-parse --abbrev-ref HEAD)

echo "Running pre-push checks on branch: $refname"

# Optional: only run on protected branches to avoid developer friction
if echo "$protected_branches" | grep -wq "$refname"; then
  echo "Running full checks for protected branch..."
  # 1) lint
  echo "→ linting"
  npm run lint --silent

  # 2) types
  echo "→ type checking"
  npm run typecheck --silent

  # 3) unit tests (fast pattern - only changed tests)
  echo "→ running unit tests (fast)"
  npm run test:changed --silent

  # Optional: run a lightweight Android sanity build on Linux/macOS with Gradle (slow; use sparingly)
  # echo "→ android sanity build (assembleDebug)"
  # (cd android && ./gradlew assembleDebug --no-daemon)
else
  echo "Non-protected branch — running lightweight checks..."
  npm run lint --silent
fi

echo "Pre-push checks passed. Proceeding with push."
exit 0
*/

/*********************************************************
 * SECTION 4 — HUSKY + npm scripts (recommended, cross-platform)
 *********************************************************/
/**
 * Husky makes wiring hooks easy and reproducible for teams.
 * Example flow:
 *  - Install: `npm install --save-dev husky`
 *  - Enable: `npx husky install`
 *  - Add hook: `npx husky add .husky/pre-push "npm run prepush:ci"`
 *
 * package.json scripts example:
 *
 *
 * "scripts": {
 *   "lint": "eslint 'src/***.{js,ts,tsx}'",
 *   "typecheck": "tsc --noEmit",
 *   "test:ci": "jest --runInBand --ci",
 *   "test:changed": "jest --findRelatedTests", // example wrapper, see below
 *   "prepush:ci": "node ./scripts/prepush-runner.js"
 * }
 *
 * .husky/pre-push content:
 * #!/bin/sh
 * . "$(dirname "$0")/_/husky.sh"
 *
 * npm run prepush:ci
 *
 * The `prepush-runner.js` script can implement logic: changed-files detection, caching, parallel steps, skip on tags, etc.
 */

/*********************************************************
 * SECTION 5 — sample Node prepush-runner.js (fast, customizable)
 *********************************************************/
/**
 * scripts/prepush-runner.js
 * - More complex logic is easier in JS (cross-platform).
 * - Use execa/child_process to run shell commands and control timeouts.
 *
 * NOTE: Keep this script fast and cache-friendly.
 */

//
// Example snippet (place in scripts/prepush-runner.js)
//
/*
#!/usr/bin/env node
const { execSync } = require('child_process');

function run(cmd, opts = {}) {
  console.log('> ' + cmd);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

try {
  // 1) Lint (fast)
  run('npm run lint');

  // 2) Types (fast)
  run('npm run typecheck');

  // 3) Run only changed tests (fast) - implement according to your test tool
  // Example: use `git diff --name-only origin/main...HEAD` to detect changed files and feed to jest --findRelatedTests
  run('node ./scripts/run-changed-tests.js');

  // 4) Optionally skip heavy checks unless pushing to main
  const branch = process.env.GIT_BRANCH || execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  if (['main', 'release'].includes(branch)) {
    console.log('Protected branch — running additional checks');
    // run('npm run test:ci'); // expensive: consider CI instead
  }

  console.log('All pre-push checks passed.');
  process.exit(0);
} catch (err) {
  console.error('Pre-push checks failed. Fix failures and try again. To bypass: git push --no-verify (not recommended).');
  process.exit(1);
}
*/

/*********************************************************
 * SECTION 6 — lint-staged & pre-commit vs pre-push
 *********************************************************/
/**
 * - lint-staged is useful for pre-commit to keep commits clean (format, lint staged files).
 * - pre-push is better for project-wide checks (unit tests, build sanity).
 * - Recommended combo:
 *   - pre-commit: lint-staged (fast formatting / small lint fixes)
 *   - pre-push: unit tests, typecheck, small build checks
 */

/*********************************************************
 * SECTION 7 — FAST VS SLOW CHECKS (UX tradeoffs)
 *********************************************************/
/**
 * Fast checks (do on every push):
 *  - ESLint on staged or full project (fast)
 *  - TypeScript `tsc --noEmit` (fast-ish if incremental)
 *  - Unit tests limited to changed code / affected tests
 *
 * Slow checks (better in CI or gated for protected branches):
 *  - Full test suite (E2E, integration)
 *  - Full Android/iOS release build
 *  - Detox e2e
 *
 * Strategies to keep hooks fast:
 *  - Run only affected/changed tests using git diffs or test-runners' changed-file flags
 *  - Use persistent test runners or snapshots cache
 *  - For Gradle/Xcode, run a lightweight sanity / assembleDebug instead of full release build
 */

/*********************************************************
 * SECTION 8 — CACHING & SPEEDUP TACTICS
 *********************************************************/
/**
 * - Use local caches: jest cache, tsserver incremental build cache, Gradle daemon/local cache, CocoaPods cache.
 * - Reuse dev machine build artifacts (avoid full clean).
 * - Use tools like `bazel` or focused build runners in large repos if needed.
 * - Parallelize independent steps (lint + typecheck + tests) with background processes in the hook runner.
 *
 * Example (simple concurrency in shell):
 * (npm run lint & npm run typecheck) && wait
 */

/*********************************************************
 * SECTION 9 — SECURITY, BYPASS & POLICY
 *********************************************************/
/**
 * - Bypass: `git push --no-verify` exists — document policy when it is acceptable.
 * - For critical checks, enforce in server-side CI (protected branch rules).
 * - Deny force pushes and require PR checks (GitHub branch protection).
 * - Use repo templates and bootstrap scripts to ensure developers install Husky/hooks (postinstall script).
 *
 * Example package.json snippet to ensure hooks installed:
 * "scripts": {
 *   "prepare": "husky install"  // runs on npm/yarn install
 * }
 */

/*********************************************************
 * SECTION 10 — EXAMPLES: Android/iOS minimal build checks
 *********************************************************/
/**
 * Android sanity assemble (fast-ish):
 * cd android && ./gradlew assembleDebug --no-daemon -x lint -x test

 * iOS minimal build (macOS CI/dev):
 * xcodebuild -workspace ios/MyApp.xcworkspace -scheme MyApp -configuration Debug -sdk iphonesimulator -destination "platform=iOS Simulator,name=iPhone 14" build
 *
 * Note: These are slow. Prefer using them only on protected branches or in CI.
 */

/*********************************************************
 * SECTION 11 — CI & SERVER-ENFORCED GATES
 *********************************************************/
/**
 * - Never rely solely on client hooks; CI must run full test / build pipelines.
 * - Recommended flow:
 *   1) Pre-push hooks for quick feedback (lint, types, changed tests)
 *   2) CI for heavy checks (full tests, builds, E2E)
 *   3) Branch protection: require successful CI runs before merge
 */

/*********************************************************
 * SECTION 12 — TROUBLESHOOTING COMMON ISSUES
 *********************************************************/
/**
 * Q: Hook not executing after clone?
 * A: Ensure `npm run prepare` (husky install) ran or instruct devs to run `npx husky install`. Ensure .husky folder is checked in.

 * Q: Hook too slow?
 * A: Move expensive checks to CI or gate by branch. Implement changed-tests only.

 * Q: Developers bypass hooks frequently?
 * A: Educate team, optimize hook latency, and protect branches with server-side rules.

 * Q: Different OS dev environments?
 * A: Use Node-based runners for cross-platform behavior (avoid shell specifics). Test on Linux/macOS/Windows.
 */

/*********************************************************
 * SECTION 13 — INTERVIEW Q&A (flashcards)
 *********************************************************/
/**
 * Q1: Why use pre-push instead of pre-commit for tests?
 * A1: Pre-commit should remain fast (format/lint staged files). Pre-push has more time to run broader checks since developers expect longer for a push.

 * Q2: How to avoid slowing down developer workflow while preventing faulty builds?
 * A2: Run only fast checks locally (lint, types, changed tests) and enforce heavy checks in CI with branch protections.

 * Q3: How to make hooks reliable and reproducible across team?
 * A3: Commit the hook configuration (Husky), add "prepare" script to install hooks on npm/yarn install, document required global tools, and use containerized dev environments if needed.

 * Q4: How to prevent bypassing hooks?
 * A4: Can't fully prevent bypass (developers can use `--no-verify`), so enforce final checks in CI and protect branches with required checks.
 */

/*********************************************************
 * SECTION 14 — CHECKLIST (ready to copy to README)
 *********************************************************/
/**
 * - [ ] Add Husky and `.husky/pre-push` or .git/hooks/pre-push executable
 * - [ ] Create npm scripts for lint/typecheck/test:changed and a node runner
 * - [ ] Ensure `prepare` script runs husky install on `npm install`
 * - [ ] Gate heavy checks to protected branches or CI
 * - [ ] Add docs: "How to bypass (git push --no-verify) and when it's allowed"
 * - [ ] Add branch protection rules to enforce CI checks
 */

/*********************************************************
 * END OF NOTES
 *********************************************************/
