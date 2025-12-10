/********************************************************************
 * 🔁 CI/CD Pipelines — GitHub Actions, Bitrise, CircleCI, Jenkins
 * -----------------------------------------------------------------
 * JS-Style Notes — Detailed, New Architecture Ready (Fabric + TurboModules + JSI)
 * - Covers setup, example pipelines, signing, caching, testing, artifacts,
 *   code signing, secrets, best practices, deployment strategies.
 ********************************************************************/

/**
 * ============================================================
 * 🔹 WHY CI/CD FOR MOBILE APPS?
 * ============================================================
 * - Automate builds (debug/release), tests, linting, and publishing.
 * - Ensure reproducible builds for different architectures (ABIs).
 * - Manage code signing, provisioning, and credentials centrally.
 * - Run unit/integration/E2E tests (Jest, Detox, Appium, Detox).
 * - Roll out releases safely (internal → beta → staged → production).
 *
 * New Architecture notes:
 * - Ensure native libs for all ABIs are built.
 * - Include steps to run Codegen if using TurboModules.
 * - Build with Hermes enabled (if required) and bundle correct JS artifacts.
 */

/* ===================================================================
 * 1) GITHUB ACTIONS — flexible, integrated with GitHub (YAML)
 * ===================================================================
 *
 * ✅ Strengths:
 * - First-class GitHub integration (PR checks, actions marketplace).
 * - Free tiers for OSS; self-hosted runners for custom hardware.
 * - Matrix builds (e.g., API 21/29/33, ABI matrix).
 *
 * ❌ Caveats:
 * - Runner environments ephemeral — configure caching.
 * - macOS runners are paid for larger usage.
 *
 * Example: Android build + run unit tests + upload artifact
 */
//
// .github/workflows/android-release.yml
// name: Android Release
// on:
//   push:
//     branches: [ main ]
// jobs:
//   build:
//     runs-on: ubuntu-latest
//     env:
//       JAVA_HOME: /usr/lib/jvm/java-11-openjdk-amd64
//     steps:
//       - uses: actions/checkout@v4
//       - name: Setup Node
//         uses: actions/setup-node@v4
//         with: { node-version: '18' }
//       - name: Cache Yarn
//         uses: actions/cache@v4
//         with:
//           path: ~/.cache/yarn
//           key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
//       - name: Install deps
//         run: yarn install --frozen-lockfile
//       - name: Run unit tests
//         run: yarn test --ci
//       - name: Generate JS bundle
//         run: yarn bundle:android   # e.g., react-native bundle or gradle task
//       - name: Setup JDK & Gradle cache
//         uses: actions/cache@v4
//         with: { path: ~/.gradle, key: gradle-${{ hashFiles('**/*.gradle*') }} }
//       - name: Build release AAB
//         run: cd android && ./gradlew bundleRelease -PkeystoreProperties=../keystore.properties
//       - name: Upload artifact
//         uses: actions/upload-artifact@v4
//         with: { name: app-aab, path: android/app/build/outputs/bundle/release/app-release.aab }
//

/**
 * Key GitHub Actions patterns:
 * - Use matrix: to test multiple Android SDK levels / ABIs.
 * - Use caching for node_modules, gradle, yarn / npm caches.
 * - Use secrets (GH Secrets) for keystore base64 or fetching from secret manager.
 * - Use self-hosted macOS runners for signing iOS or use hosted macos-latest (paid).
 */

/* ===================================================================
 * 2) BITRISE — mobile-first CI with built-in steps for RN & Expo
 * ===================================================================
 *
 * ✅ Strengths:
 * - Mobile-first workflows, easy Sign & Deploy steps (Google Play, App Store).
 * - GUI + YAML (bitrise.yml) support; many ready-to-use steps (npm, yarn, gradle, cocoapods).
 * - Built-in code signing support via Bitrise Codesignd (certificate / provisioning import).
 *
 * ❌ Caveats:
 * - Paid plans for heavy usage; macOS build minutes cost.
 *
 * Common Bitrise Flow:
 * - Trigger: Push to branch or PR
 * - Steps:
 *   • git-clone
 *   • yarn install / npm install
 *   • yarn test (Jest)
 *   • react-native bundle or metro config
 *   • install-cocoapods (iOS)
 *   • gradle-runner / xcode-archive
 *   • deploy-to-bitrise-io / google-play-deploy / ios-deploy
 *
 * Example: Android & iOS (conceptual steps in bitrise.yml)
 */
//
// bitrise.yml (simplified steps)
// workflows:
//   primary:
//     steps:
//       - git-clone: {}
//       - yarn:
//       - cocoapods-install: {}
//       - run-tests: { script: "yarn test" }
//       - react-native-bundle: { script: "yarn bundle:android && yarn bundle:ios" }
//       - gradle-runner: { inputs: { gradle_task: "bundleRelease" } }
//       - xcode-archive: { inputs: { export_method: "app-store" } }
//       - deploy-to-bitrise-io: {}
//

/**
 * Bitrise notes:
 * - Upload certificates and provisioning profiles via UI or `bitrise-cli`.
 * - Use Workflow Editor to manage env vars (keystore passwords, API keys).
 * - Integrates with CodePush/EAS; can call fastlane lanes.
 */

/* ===================================================================
 * 3) CIRCLECI — flexible, scalable pipelines (orbs)
 * ===================================================================
 *
 * ✅ Strengths:
 * - Powerful concurrency & caching; orbs provide reusable configs.
 * - Docker-based workflows — good for reproducible Linux builds.
 *
 * ❌ Caveats:
 * - macOS builds require macOS executors (paid).
 *
 * Example: CircleCI config (Android)
 */
//
// .circleci/config.yml
// version: 2.1
// jobs:
//   android_build:
//     docker:
//       - image: circleci/android:api-31
//     steps:
//       - checkout
//       - restore_cache:
//           keys: node-deps-{{ checksum "yarn.lock" }}
//       - run: yarn install
//       - run: yarn test
//       - run: cd android && ./gradlew bundleRelease
//       - persist_to_workspace:
//           root: android/app/build/outputs/bundle/release
//           paths: [app-release.aab]
// workflows:
//   build-and-upload:
//     jobs:
//       - android_build
//

/**
 * CircleCI notes:
 * - Use workspaces to pass build artifacts between jobs.
 * - Use caching for gradle & node_modules.
 * - Integrate with Fastlane or upload artifacts to stores via Fastlane.
 */

/* ===================================================================
 * 4) JENKINS — self-hosted, highly customizable
 * ===================================================================
 *
 * ✅ Strengths:
 * - Full control: custom agents, hardware (e.g., specific Android NDK/NDK ABIs).
 * - Good for complex enterprise pipelines & on-prem requirements.
 *
 * ❌ Caveats:
 * - Maintenance overhead (agents, upgrades, plugins).
 *
 * Typical Jenkins Pipeline (Declarative, Groovy):
 */
//
// pipeline {
//   agent any
//   environment {
//     ANDROID_HOME = "/opt/android-sdk"
//   }
//   stages {
//     stage('Checkout') { steps { checkout scm } }
//     stage('Install') { steps { sh 'yarn install' } }
//     stage('Unit Tests') { steps { sh 'yarn test' } }
//     stage('Bundle JS') { steps { sh 'yarn bundle:android' } }
//     stage('Build') {
//       parallel {
//         stage('Android') { steps { sh './gradlew bundleRelease' } }
//         stage('iOS') { steps { sh 'fastlane ios release' } }
//       }
//     }
//     stage('Upload') { steps { sh 'fastlane upload' } }
//   }
//   post {
//     success { archiveArtifacts artifacts: 'android/app/build/outputs/**/*.aab' }
//     failure { mail to: 'devs@example.com', subject: 'Build failed' }
//   }
// }
//

/**
 * Jenkins notes:
 * - Use credential store for keystore/.p12 and provisioning profile management.
 * - Keep Jenkins agents with correct tooling (Xcode on macOS agents).
 * - Use BlueOcean or Jenkinsfiles for pipeline as code.
 */

/* ===================================================================
 * 5) COMMON PIPELINE CONCERNS (all platforms)
 * ===================================================================
 *
 * 1) CODE SIGNING & CREDENTIALS
 *    - Android: keystore file + passwords (storeFile, storePassword, keyAlias, keyPassword)
 *    - iOS: .p12 certificate + provisioning profile or use fastlane match
 *    - Store secrets in platform secret stores (GitHub Secrets, Bitrise Secrets, CircleCI context, Jenkins credentials)
 *    - Avoid committing .keystore/.p12 in repo. Use encrypted storage or secret managers.
 *
 * 2) CACHING
 *    - Cache node_modules, gradle caches (~/.gradle/caches), cocoapods (~/.cocoapods)
 *    - Use action/cache or CircleCI cache keys based on lockfile checksum
 *
 * 3) PARALLEL / MATRIX BUILDS
 *    - Use matrix for Android SDK versions, ABIs, or variant flavors
 *    - Example matrix: [armeabi-v7a, arm64-v8a] × [api29, api33]
 *
 * 4) ARTIFACTS & DISTRIBUTION
 *    - Upload AAB/APK/IPA to artifact storage or distribution services:
 *      • Google Play internal track (Fastlane supply / Google Play API)
 *      • App Store Connect (Fastlane deliver)
 *      • Firebase App Distribution / Microsoft App Center / TestFlight
 *
 * 5) TESTING
 *    - Unit tests: Jest (node)
 *    - Integration: React Native Testing Library
 *    - E2E: Detox (preferred), Appium (alternative)
 *    - Run Detox on CI with emulators (Android) or Simulators (macOS)
 *
 * 6) RELEASE STRATEGIES
 *    - Internal → Alpha/Beta → Staged Rollout → Production
 *    - Canary builds to subset of users
 *    - Use feature flags & remote config for safe rollouts
 *
 * 7) MONITORING & OBSERVABILITY
 *    - Upload ProGuard mapping.txt & native symbol files (NDK .so debug symbols) to Play Console / Sentry
 *    - Integrate crash/RUM (Sentry, Crashlytics) release tracking in pipeline
 *
 * 8) SECURITY SCANNING
 *    - Run static analysis (ESLint, security linters)
 *    - Run dependency scans (npm audit, snyk)
 *    - Scan APK for exposed keys (danger, custom scripts)
 *
 * 9) IDENTITY & ACCESS
 *    - Restrict who can trigger release workflows (protect main branch)
 *    - Use branch protections & require PR reviews
 *    - Approvals for release workflows (manual approval step)
 */

/* ===================================================================
 * 6) EXAMPLES: FASTLANE + EAS integrated in CI
 * ===================================================================
 *
 * - Example: GitHub Actions triggers EAS build and then runs Fastlane to submit
 */
//
// name: Build & Submit
// on: [push]
// jobs:
//   eas-build:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - run: yarn && yarn test
//       - run: eas build --platform android --non-interactive --profile production
//   submit:
//     needs: eas-build
//     runs-on: macos-latest
//     steps:
//       - uses: actions/checkout@v4
//       - name: Fastlane upload to App Store
//         run: bundle exec fastlane ios upload
//

/* ===================================================================
 * 7) BEST PRACTICES & RECOMMENDATIONS
 * ===================================================================
 *
 * ✅ Infrastructure:
 *   - Use hosted builds for convenience (Bitrise, EAS) or self-hosted for compliance.
 *   - Use macOS runners only for iOS builds; consolidate iOS jobs to reduce cost.
 *
 * ✅ Secrets:
 *   - Use secret manager (GitHub Secrets, Bitrise Secrets, Vault).
 *   - Keep keystore credentials in secure storage; decrypt at runtime (avoid plain text).
 *
 * ✅ Speed:
 *   - Cache aggressively (node, gradle, cocoapods).
 *   - Use incremental builds (Gradle build cache).
 *   - Use matrix for unit tests only; run heavy E2E tests in nightly pipelines.
 *
 * ✅ Reproducibility:
 *   - Pin Android SDK, NDK, Node versions.
 *   - Lock dependencies (yarn.lock / package-lock.json).
 *   - Use containerized builds where possible.
 *
 * ✅ Quality Gates:
 *   - Require tests & lint to pass on PRs before merging.
 *   - Use code owners to ensure critical files reviewed.
 *
 * ✅ Rollout:
 *   - Use staged rollouts (Google Play).
 *   - Monitor crash & analytics after release; rollback if necessary.
 *
 * ✅ Codegen & New Arch:
 *   - Add step to run codegen for TurboModules (usually before native build):
 *       yarn run codegen
 *   - Ensure generated files are included in the native project or run codegen inside CI.
 *
 * ✅ Hermes & JSI:
 *   - If using Hermes, ensure CI installs correct Hermes build & bundles generated artifacts.
 *   - Include hermes-enabled build matrix if needed.
 */

/* ===================================================================
 * 8) QUICK Q&A (INTERVIEW READY)
 * ===================================================================
 *
 * Q: When to use Bitrise vs GitHub Actions?
 * A: Bitrise is mobile-first with easy code-signing steps and UI; GitHub Actions is highly flexible and ideal if you want native GitHub integration & custom workflows.
 *
 * Q: How to securely store keystore and provisioning?
 * A: Use platform secret stores (GitHub Secrets / Bitrise Secrets), or fastlane match to encrypt certificates in Git.
 *
 * Q: Where to run E2E tests (Detox)?
 * A: Run on CI agents with emulators; prefer dedicated runners or nightly pipelines for long E2E suites.
 *
 * Q: How to speed up Android builds on CI?
 * A: Cache Gradle, use parallel workers, use build cache, split heavy E2E to separate pipelines.
 *
 * Q: How to handle multiple ABIs / native libs?
 * A: Prefer AAB (Play will split ABIs). If producing APKs, configure ABI splits and unique versionCode per APK.
 *
 * ===================================================================
 */
