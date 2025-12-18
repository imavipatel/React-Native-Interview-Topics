/**
 * react-native-code-quality-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "How to manage code quality & code formatting in a React Native project"
 *
 * - Plain-language goals & principles
 * - Tooling (ESLint, Prettier, TypeScript, stylelint, testing)
 * - Git hooks (Husky, lint-staged, commitlint)
 * - CI checks (lint, typecheck, tests, coverage, security)
 * - Branch/PR/CD workflow & review rules
 * - Sample configs & package.json scripts (copy–paste ready)
 * - Metrics, dependency scanning, and maintenance tips
 * - Interview Q&A + cheat-sheet
 *
 * Copy into your notes repo and adapt to your stack (TypeScript / JS / mono-repo).
 */

/* ===========================================================================
📌 0. GOALS — plain language
===============================================================================
- Keep code consistent and readable (formatting + style)
- Prevent bugs early (lint + types + tests)
- Enforce standards automatically (pre-commit + CI)
- Make PR review faster (pre-merge checks, templates)
- Continuously measure quality (coverage, lint, debt)
- Protect release pipeline from low-quality changes
*/

/* ===========================================================================
📌 1. HIGH-LEVEL STRATEGY — recipe
===============================================================================
1) Formatting: Prettier as single source of truth for formatting.
2) Linting: ESLint for code smells, best practices, and rule enforcement.
3) Types: TypeScript (recommended) with strict settings; run tsc in CI.
4) Pre-commit: Husky + lint-staged to run quick checks locally (format + lint + tests subset).
5) CI: Run full lint, typecheck, unit tests, e2e smoke, coverage thresholds, and security scans.
6) Reviews: PR templates, codeowners, size & complexity limits, pair-review when risky.
7) Monitoring: Coverage, SonarCloud/CodeClimate (optional), dependency scanning (Snyk/Dependabot).
*/

/* ===========================================================================
📌 2. TOOLING & WHY (short)
===============================================================================
• Prettier — deterministic formatting, avoids style debates
• ESLint — enforce rules, catch bugs (airbnb / react-native / plugin:react-hooks)
• TypeScript — static types reduce runtime errors and improve DX
• stylelint — for web + RN web projects or shared stylesheet checks (optional)
• Jest + React Native Testing Library — unit + component tests
• Detox / Appium — E2E tests for navigation/flows
• Husky + lint-staged — local fast checks before commit
• commitlint — enforce conventional commits for changelogs
• Dependabot / Snyk — automated dependency vulnerability detection
• Code coverage (coverage thresholds) — prevent regressions
*/

/* ===========================================================================
📌 3. SAMPLE PACKAGE.JSON SCRIPTS (copy & adapt)
===============================================================================
"scripts": {
  // formatting & linting
  "format": "prettier --write \"src/**.{js,jsx,ts,tsx,json,md}\"",
  "lint": "eslint \"src/**.{js,jsx,ts,tsx}\" --max-warnings=0",

  // types & tests
  "typecheck": "tsc --noEmit",
  "test": "jest --coverage",
  "test:watch": "jest --watch",

  // pre-commit quick checks (fast)
  "precommit:check": "npm run format && npm run lint:staged",
  "lint:staged": "lint-staged",

  // CI pipeline steps (examples)
  "ci:lint": "npm run lint",
  "ci:typecheck": "npm run typecheck",
  "ci:test": "npm run test",
  "ci:all": "npm run ci:lint && npm run ci:typecheck && npm run ci:test"
}

Notes:
• Use --max-warnings=0 in CI to fail on warnings.
• Keep 'format' idempotent; developers run it locally or via pre-commit hook.
*/

/* ===========================================================================
📌 4. SAMPLE ESLINT + PRETTIER CONFIGS (TypeScript + React Native)
===============================================================================
/* .eslintrc.js */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  env: { "react-native/react-native": true, jest: true, node: true },
  settings: { react: { version: "detect" } },
  rules: {
    // project-specific rules — shortlist
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "react/prop-types": "off", // using TS
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "import/order": ["warn", { "newlines-between": "always" }],
  },
  overrides: [{ files: ["*.ts", "*.tsx"], rules: { "no-undef": "off" } }],
};

/* .prettierrc.js 
module.exports = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  tabWidth: 2
};

Notes:
• Keep ESLint focused on code quality; use Prettier for formatting.
• Use eslint-config-prettier to turn off conflicting rules.
*/

/* ===========================================================================
📌 5. HUSKY + LINT-STAGED + COMMITLINT (pre-commit & commit policy)
===============================================================================
Install:
  npm i -D husky lint-staged @commitlint/config-conventional @commitlint/cli

Config snippets:

/* package.json 
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
},
"lint-staged": {
  "src/**.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix",
    "git add"
  ],
  "src/**.{json,md}": [
    "prettier --write",
    "git add"
  ]
}

/* commitlint.config.js 
module.exports = { extends: ['@commitlint/config-conventional'] };

Behavior:
• On commit, changed files are formatted & linted automatically; failing lint blocks commit.
• commit-msg enforces Conventional Commits (feat/fix/chore) for automated changelogs.
*/

/* ===========================================================================
📌 6. CI PIPELINE (GitHub Actions example: lint, typecheck, tests, coverage)
===============================================================================
# .github/workflows/ci.yml (concept)
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node
        uses: actions/setup-node@v4
        with: { node-version: '18' }
      - name: Install
        run: npm ci
      - name: Lint
        run: npm run ci:lint
      - name: Typecheck
        run: npm run ci:typecheck
      - name: Tests
        run: npm run ci:test
      - name: Report Coverage
        run: bash <(curl -s https://codecov.io/bash) || true

Notes:
• Fail fast: lint -> types -> tests. Prevent merge if any step fails.
• Optionally: run E2E on dedicated runners or separate job (heavy).
*/

/* ===========================================================================
📌 7. PR & REVIEW RULES (process)
===============================================================================
• Require at least one (or two for critical paths) approving review before merge.
• Use CODEOWNERS to auto-request reviewers for specific folders (features/native).
• Enforce passing CI checks as condition for merge.
• Use PR template with checklist: tests, types, changelog, manual QA steps.
• Limit PR size: aim < 300 LOC for faster review; bigger changes require design doc.
• Require descriptive PR titles and link to ticket; use conventional commit for release automation.
*/

/* ===========================================================================
📌 8. TESTING & QUALITY GATES
===============================================================================
• Unit: Jest + React Native Testing Library (fast, per-file).
• Integration: component/feature tests combining components + stores.
• E2E: Detox (iOS/Android) for critical flows (auth, payments).
• Coverage: set minimum threshold (e.g., 80%) for lines/branches; fail CI if below.
• Flaky tests: isolate and mark unstable tests; investigate root cause.
• Snapshot tests: use selectively for stable UI pieces; avoid brittle snapshots for complex screens.
*/

/* ===========================================================================
📌 9. SECURITY & DEPENDENCY SCANNING
===============================================================================
• Dependabot: automated PRs for dependency updates (configure to ignore noise).
• Snyk / npm audit / GitHub Dependabot alerts: run regularly; block critical CVEs in CI.
• Use pinned versions for critical native libs; test upgrades in canary channel.
• Run static analysis (Snyk, SonarCloud) optionally as part of nightly job.
*/

/* ===========================================================================
📌 10. METRICS & MONITORING (maintain quality over time)
===============================================================================
Track:
• Lint warnings/errors per PR & trend over time
• Test coverage % and trend
• Build pipeline duration & flakiness
• Number of security vulnerabilities
• Code churn (hot spots) — files with frequent edits
Tools:
• SonarCloud / CodeClimate for technical debt & hotspots
• Codecov for coverage visualization
• Sentry for runtime errors (track regressions after merges)
Define SLOs: e.g., > 80% test pass rate, < 5 new critical lint errors/week.
*/

/* ===========================================================================
📌 11. MONOREPO CONSIDERATIONS (if you have many packages)
===============================================================================
• Centralize ESLint/Prettier config at root; share via extends.
• Use root-level husky + lint-staged or per-package where needed.
• CI: run lightweight checks per-PR (changed packages) using affected-packages logic for speed.
• Use TypeScript project references or isolated build per package to keep typecheck fast.
*/

/* ===========================================================================
📌 12. SAMPLE ESLINT RULES TO ENFORCE (recommended)
===============================================================================
- Enforce hooks rules: 'react-hooks/rules-of-hooks': 'error'
- Ban console.log in production: 'no-console': ['error', { allow: ['warn', 'error'] }]
- Prefer explicit exports & avoid default exports (team preference)
- Enforce import order / no absolute paths without aliases
- Prevent large functions: eslint-plugin-sonarjs rules or complexity thresholds
- Enforce consistent naming conventions with @typescript-eslint/naming-convention
*/

/* ===========================================================================
📌 13. ONBOARDING & DOCUMENTATION (keep quality culture)
===============================================================================
• Document coding standards in repo (CONTRIBUTING.md).
• Provide pre-configured editor settings (settings.json, .vscode) and EditorConfig.
• Share a "How to run local checks" quick guide for devs.
• Maintain PR templates and code review checklist.
• Run periodic "code-health" days: reduce tech debt, update dependencies, tighten rules.
*/

/* ===========================================================================
📌 14. SAMPLE .vscode SETTINGS (recommended)
===============================================================================
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": true }
}
Note: Team should agree on editor integration (Prettier + ESLint auto-fix on save).
*/

/* ===========================================================================
📌 15. QUICK TROUBLESHOOTING (common issues)
===============================================================================
Q: ESLint slow on big repo?
A: Run eslint only on staged files (lint-staged) locally; configure CI to run full lint; use caching and max-warnings=0 in CI.

Q: Prettier conflicts with ESLint?
A: Use eslint-config-prettier to disable formatting rules in ESLint.

Q: TypeScript too strict for quick prototyping?
A: Use 'strict: true' on main branches; allow looser settings in experimental branches but create a debt ticket.

Q: Flaky CI tests?
A: Isolate flaky tests, add retries with backoff on CI runner for infra-related flakiness, and fix root cause.
*/

/* ===========================================================================
📌 16. INTERVIEW Q&A (high-value)
===============================================================================
Q1: What tools enforce code formatting and style?
A: Prettier for formatting; ESLint for linting; Husky + lint-staged for pre-commit checks.

Q2: How do you prevent broken code being merged?
A: Require CI passing (lint, typecheck, tests), code reviews, and branch protection rules.

Q3: How to ensure consistent developer environment?
A: Provide editor settings (.vscode), pre-commit hooks, and npm scripts. Use a dev container if needed.

Q4: What is lint-staged used for?
A: Run linters/formatters only on staged files for fast local checks.

Q5: How to handle dependency vulnerabilities automatically?
A: Use Dependabot + Snyk and block merges for critical CVEs until fixed.

Q6: How to measure technical debt?
A: Use SonarCloud/CodeClimate, track code smells, duplicate code, complexity, and coverage trends.
*/

/* ===========================================================================
📌 17. CHEAT-SHEET (actionable checklist)
===============================================================================
✔ Install Prettier + ESLint + TypeScript (if using TS)
✔ Configure Prettier first, then ESLint (use eslint-config-prettier)
✔ Add Husky + lint-staged to auto-run format & lint on commit
✔ Add commitlint for Conventional Commits
✔ Add CI job to run lint, typecheck, tests, coverage threshold
✔ Protect main branches (require PR approvals & passing CI)
✔ Add codeowners & PR templates (mandatory checklist)
✔ Add dependency scanning (Dependabot/Snyk) and fix critical issues promptly
✔ Add coverage & code quality dashboards (Codecov + SonarCloud)
✔ Educate team: keep CONTRIBUTING.md and run onboarding sessions
*/

/* ===========================================================================
📌 18. SAMPLE QUICK START (commands)
===============================================================================
# Install base tooling
npm install --save-dev prettier eslint husky lint-staged @commitlint/cli @commitlint/config-conventional jest
# initialize husky
npx husky install
# set up commit-msg hook (example)
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
# add lint-staged config and scripts (see above)

Adapt for TypeScript:
npm i -D typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin

*/

/* ===========================================================================
📌 19. WANT NEXT?
===============================================================================
I can produce (single-file JS Notes):
  ✅ Full boilerplate: ESLint + Prettier + Husky + lint-staged + commitlint with TypeScript + sample .github/ci.yml
  ✅ SonarCloud & Codecov integration guide + example badges for README
  ✅ PR template + CODEOWNERS + CONTRIBUTING.md tailored to your repo
  ✅ Lint rules recommendation file tuned for React Native projects

Tell me which and I’ll return it in this same JS Notes style.
*/
