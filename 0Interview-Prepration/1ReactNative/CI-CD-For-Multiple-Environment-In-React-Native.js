/**
 * react-native-ci-cd-multienv-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "How to implement CI/CD for multiple environments in a React Native project"
 *
 * - Plain-language strategy & goals
 * - Environment handling (env files, build variants, schemes)
 * - CI choices (GitHub Actions, Bitrise, CircleCI, Azure, GitLab) — examples use GitHub Actions + Fastlane
 * - Fastlane lanes for Android/iOS per-environment + code signing handling
 * - GitHub Actions workflows: build/test/deploy for dev/staging/prod
 * - Release flows: internal QA, staging distribution, Play Console / App Store, EAS / CodePush
 * - Secret management, code signing, artifact storage, and rollback strategy
 * - Tips on release notes, versioning, metrics, and safety gates
 *
 * Copy into your notes repo. Use it as a blueprint and adapt to your infra (Bitrise, EAS, etc).
 */

/* ===========================================================================
📌 0. GOALS — what CI/CD must achieve (plain language)
===============================================================================
- Build reproducible app binaries for multiple environments (dev / staging / prod)
- Run automated checks: lint, typecheck, unit tests, e2e smoke (optional)
- Produce signed artifacts (aab / ipa) using secure credentials
- Distribute builds to testers (internal / QA) and to stores (Play / App Store)
- Deploy JS updates via OTA safely (CodePush / EAS update) where appropriate
- Support rollback, fast hotfix releases, and traceability (build metadata)
- Securely manage secrets (keystore, provisioning profiles, API keys)
*/

/* ===========================================================================
📌 1. ENVIRONMENTS — conventions & build-time decisions
===============================================================================
Common environments:
  - development: local / CI dev preview
  - staging: internal QA (mirror prod backend)
  - production: release to stores

Key choices:
  - Use react-native-config (bare RN) or Expo EAS config for env injection.
  - Android: productFlavors (dev, staging, prod) -> separate applicationId & resources.
  - iOS: Schemes & Configurations (Dev, Staging, Release) -> separate bundle IDs & plist values.
  - Keep .env files out of VCS; commit .env.example only.
  - CI should inject production secrets at build time (CI secrets or secrets manager).
*/

/* ===========================================================================
📌 2. VERSIONING & BUILD METADATA (recommended)
===============================================================================
Strategy:
  - Semantic versioning for releases (MAJOR.MINOR.PATCH).
  - Use build number code (Android versionCode / iOS CFBundleVersion) incremented per CI build.
  - Tag releases in Git (v1.2.3) when releasing to production.
  - Attach build metadata: GIT_COMMIT, GIT_TAG, BUILD_NUM, BUILD_DATE to artifacts and release notes.

Example:
  versionName = "1.2.3"
  versionCode = 20251208.42  (date + build id) OR incremental integer from CI
  iOS CFBundleShortVersionString = "1.2.3"
  iOS CFBundleVersion = "42"
*/

/* ===========================================================================
📌 3. CODE SIGNING & SECRETS — secure handling
===============================================================================
Android:
  - Keystore (upload.keystore) + storePassword + keyAlias + keyPassword.
  - Keep keystore in CI secrets or secure file store (encrypted artifact).
  - For Play Console: use Play App Signing (upload key or manage key in Play).
iOS:
  - Apple Signing: provisioning profiles (dev, ad-hoc, App Store), certificates (p12), or use Fastlane match.
  - Fastlane match recommended: stores certs/profiles in encrypted private Git repo (or use storage).
  - Use App Store Connect API key (recommended) for uploading builds via Fastlane.
Secrets management:
  - Use GitHub Secrets / Bitrise Secrets / Vault to store KEYS, P12 passphrases, env values.
  - Never commit keystores or p12 in repo. Use encrypted storage or CI secret files injection.
*/

/* ===========================================================================
📌 4. PIPELINE STAGES (CI workflow)
===============================================================================
1) PR validation
   - Run: lint, typecheck, unit tests, jest snapshot, static security scan
   - Optional: run fast unit tests for changed packages (monorepo)
   - Report: annotations on PR

2) Merge → main (or release branch) build
   - Build debug/staging artifacts for QA
   - Run integration smoke tests (optional)
   - Upload artifacts to artifact storage (GitHub Releases / S3 / Firebase App Distribution / TestFlight internal)

3) Release (production)
   - Triggered manually (tag vX.Y.Z) or via release branch
   - Build signed prod binaries (aab, ipa)
   - Upload to Play Console / App Store Connect (Fastlane / Google Play API)
   - Create release notes using CHANGELOG from conventional commits or GitHub auto-release

4) Post-release
   - Run post-deploy smoke tests (E2E quick flows)
   - Monitor crashes & metrics (Sentry, Firebase Crashlytics)
   - If problem → rollback (see rollback strategies)
*/

/* ===========================================================================
📌 5. SAMPLE FASTLANE (Fastfile) — lanes for multi-env
===============================================================================
# Put this in ios/fastlane/Fastfile and android/fastlane/Fastfile as appropriate
# High-level lanes: beta (staging), release (prod), build_debug

// Fastfile (Ruby pseudocode - use exact syntax in your Fastfile)
/*
default_platform(:ios)

platform :ios do
  desc "Build & upload Staging to TestFlight (internal)"
  lane :staging do
    match(type: "appstore", readonly: true)  # or use type: "development" for beta
    capture_screenshots # optional
    build_app(
      scheme: "MyApp-Staging",
      export_method: "ad-hoc", # or app-store for internal TestFlight
      output_directory: "./build/ios",
      clean: true
    )
    upload_to_testflight(skip_waiting_for_build_processing: true)
  end

  desc "Build & upload Production to App Store"
  lane :release do |options|
    version = options[:version] || get_version_number(xcodeproj: "ios/MyApp.xcodeproj")
    build_number = increment_build_number
    match(type: "appstore")
    build_app(
      scheme: "MyApp-Release",
      export_method: "app-store",
      output_directory: "./build/ios",
      clean: true
    )
    upload_to_app_store(submit_for_review: false, skip_metadata: true)
    add_git_tag(tag: "v#{version}")
  end
end

platform :android do
  desc "Assemble staging APK/AAB"
  lane :staging do
    gradle(task: "clean")
    gradle(task: "bundleStagingRelease") // ensure productFlavor 'staging' exists
    upload_to_play_store(track: "internal", aab: "android/app/build/outputs/bundle/stagingRelease/app-staging-release.aab")
  end

  desc "Assemble release AAB and push to Play"
  lane :release do |options|
    gradle(task: "clean")
    gradle(task: "bundleProdRelease")
    upload_to_play_store(track: "production", aab: "android/app/build/outputs/bundle/prodRelease/app-prod-release.aab")
    add_git_tag(tag: "v#{options[:version]}")
  end
end

NOTE:
 - Use fastlane match or Google Play API JSON key for uploads.
 - For Android prefer Play App Signing; upload AAB instead of APK.
*/

/* ===========================================================================
📌 6. GITHUB ACTIONS WORKFLOW — CI example for multi-env
===============================================================================
- PR workflow: .github/workflows/pr-check.yml
- Release workflow: .github/workflows/release.yml
Below are simplified templates. Adapt secrets & runners to your environment.
*/

/* ========== .github/workflows/pr-check.yml ========== */
/*
name: PR Checks
on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Node setup
        uses: actions/setup-node@v4
        with: { node-version: 18 }
      - name: Install
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Typecheck
        run: npm run typecheck
      - name: Tests
        run: npm run test -- --coverage --maxWorkers=50%
      - name: Build (JS bundle only)
        run: |
          # Build JS bundles for staging to validate packaging
          ENVFILE=.env.staging npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/main.jsbundle
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: pr-artifacts
          path: /tmp/main.jsbundle
*/

/* ========== .github/workflows/release.yml ========== */
/*
name: Release Pipeline
on:
  push:
    tags:
      - 'v*.*.*'   # trigger on semantic version tag e.g., v1.2.3

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    env:
      ENVFILE: .env.production
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with: { node-version: 18 }
      - name: Install
        run: npm ci
      - name: Lint & Test
        run: |
          npm run ci:lint
          npm run ci:typecheck
          npm run ci:test
      - name: Decrypt Android Keystore
        if: runner.os == 'Linux'
        run: |
          echo "$ANDROID_KEYSTORE_BASE64" | base64 --decode > android/upload-keystore.jks
        env:
          ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
      - name: Decrypt iOS certs (using Fastlane match or secure files)
        run: |
          mkdir -p ~/certs && echo "$MATCH_PASSWORD" > ~/certs/match_password
        env:
          MATCH_PASSWORD: ${{ secrets.FASTLANE_MATCH_PASSWORD }}
      - name: Build Android AAB
        run: |
          cd android
          ./gradlew bundleProdRelease -PENVFILE=.env.production
      - name: Upload Android to Play
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_JSON }}
          packageName: com.myapp.prod
          releaseFiles: android/app/build/outputs/bundle/prodRelease/app-prod-release.aab
          track: production
      - name: Build & Upload iOS (Fastlane)
        uses: maierj/fastlane-action@v2
        with:
          lane: ios release
          workdir: ios
        env:
          MATCH_PASSWORD: ${{ secrets.FASTLANE_MATCH_PASSWORD }}
          APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}
*/

/* ===========================================================================
IMPORTANT:
 - Provide secrets: GOOGLE_PLAY_JSON, FASTLANE_MATCH_PASSWORD, ANDROID_KEYSTORE_BASE64, APP_STORE_CONNECT_API_KEY
 - For Bitrise: use "Secrets" tab and native workflows for code signing
*/

/* ===========================================================================
📌 7. OTA (CodePush / EAS Update) — how to include in pipeline
===============================================================================
Use OTA for JS-only fixes but not for native changes.

Flow:
  - After CI builds & tests pass, create a release bundle (jsbundle) and upload to CodePush/EAS Update channel (staging/prod).
  - Tag the release, push OTA to a staged cohort first (canary) then progressively to all users.
  - Maintain mapping of app-version -> compatible JS bundle; do not push bundle that requires a newer native binary.
Safety:
  - Associate minimumNativeVersion with CodePush releases.
  - Always test OTA on internal QA group before broad rollout.
Example (CodePush cli):
  appcenter codepush release-react -a <owner>/<app> -d Staging --target-binary-version "1.2.3"
Or with EAS:
  eas update --branch staging --message "hotfix" --wait
*/

/* ===========================================================================
📌 8. ARTIFACT STORAGE & RELEASE NOTES
===============================================================================
- Store signed artifacts in:
  - GitHub Releases (upload AAB/IPA), or
  - S3 bucket with lifecycle rules, or
  - Internal distribution systems (Firebase App Distribution, TestFlight)
- Generate release notes automatically using Conventional Commits and standard changelog tools:
  - semantic-release, standard-version, or changelog generator.
- Attach changelog + build metadata to release artifacts for traceability.
*/

/* ===========================================================================
📌 9. ROLLBACK STRATEGIES (native & OTA)
===============================================================================
Native rollback:
  - If Release causes severe issues, unpublish or roll back via Play Console (decrease rollout % or halt) and App Store (remove release or submit hotfix).
  - Use hotfix release (new native build) with higher priority.

OTA rollback:
  - CodePush / EAS allow rollout rollback to previous JS bundle.
  - For critical failures introduced by JS, release previous stable bundle to the same channel immediately.
  - Keep production "pinned" bundles per version, and only allow OTAs that are compatible.

Safety net:
  - Feature flags + remote config to disable problematic features without redeploy.
  - Canary populations: release to 1-5% first, monitor errors, then increase rollout percent.
*/

/* ===========================================================================
📌 10. MONITORING & SLOs (post-deploy)
===============================================================================
- Integrate Crashlytics / Sentry / Bugsnag for runtime errors.
- Track key metrics: crash-free users, ANR, slow screen renders, adoption rate.
- Set SLOs: e.g., crash rate < 0.5% on new release, CPU/memory thresholds.
- Alerting: Slack + PagerDuty integration on high-severity errors.
- Automated smoke tests: run E2E quick flows after release (Detox/filter).
*/

/* ===========================================================================
📌 11. QUALITY GATES (prevent bad releases)
===============================================================================
- Require: PR checks pass (lint, typecheck, tests)
- Require: Nightly E2E integration pipeline success for main branch
- Use manual approval step for production release job (GitHub Actions workflow_dispatch with approvers)
- Use staged rollouts: internal -> alpha -> beta -> production
- Use feature flags/kill-switch for risky features
*/

/* ===========================================================================
📌 12. SAMPLE DEVOPS CHECKLIST (pre-release)
===============================================================================
✔ All PR checks green
✔ Release branch built with staging env and distributed to QA
✔ QA sign-off for release candidate (issue tracker approval)
✔ Crash & performance baseline captured before release
✔ App signing keys available and tested in CI
✔ Release notes & changelog generated
✔ Rollout plan & monitoring dashboard ready
✔ Canary rollout configured if possible
*/

/* ===========================================================================
📌 13. CI FOR MONOREPO OR MULTI-APP SETUPS
===============================================================================
- Use affected packages detection in CI to run only relevant builds/tests.
- Create per-app pipelines or a matrix job for multiple flavors / targets.
- Cache node_modules, Gradle, Cocoapods caches to speed builds.
- Use artifact promotion: build once, promote artifact through channels (QA -> Staging -> Prod) rather than rebuilding.
*/

/* ===========================================================================
📌 14. BITRISE / CIRCLECI / FASTLANE INTEGRATION NOTES
===============================================================================
Bitrise:
  - Ready-made RN steps (yarn install, Gradle assemble, Xcode archive)
  - Store keystore/p12 as secret & deploy via Bitrise deploy to testers
CircleCI:
  - Use orbs for Fastlane; manage macOS runners for iOS builds
Fastlane:
  - Central place to script builds + uploads + version bumps; use match for signing
EAS (Expo):
  - Use eas build --profile staging/production and eas submit to stores; eas update for OTA
Choose tools based on team familiarity and available macOS runner capacity.
*/

/* ===========================================================================
📌 15. EXAMPLE: workflow_dispatch manual release with approval (GitHub Actions)
===============================================================================
- Use a job with "workflow_dispatch" trigger and environment protection rules in GitHub
- Require manual approval by specified reviewers before the job runs
This helps to prevent accidental production pushes.
*/

/* ===========================================================================
📌 16. Troubleshooting common CI/CD issues
===============================================================================
- Code signing fails on CI:
  -> Validate keystore/p12 passphrase, ensure correct key alias, check fastlane match sync.
- Build times too long:
  -> Use caching (Gradle, CocoaPods), build only affected modules, parallelize matrix jobs.
- OTA incompatibility:
  -> Enforce minimum native version for OTA updates, block CodePush releases if native binary required.
- Flaky E2E:
  -> Isolate non-deterministic tests, use stable selectors, run headless/CI-specific builds.
*/

/* ===========================================================================
📌 17. INTERVIEW Q&A (short)
===============================================================================
Q1: How do you handle multiple environments in RN CI?
A: Use productFlavors (Android) and Schemes/Configurations (iOS) + env files (react-native-config) and let CI inject secrets; create separate build lanes in Fastlane and CI jobs per env.

Q2: Where to store signing keys?
A: In CI secrets (encrypted) or secure storage service; never commit keys to repo. Use Fastlane match or Play App Signing.

Q3: How to do fast hotfixes?
A: Use OTA (CodePush/EAS) for JS-only fixes if compatible; otherwise produce a patch native build and push via CI fastlane lane.

Q4: How to ensure safe rollout?
A: Canary/staged rollouts, feature flags, monitoring, manual approval gates in CI.

Q5: How to avoid rebuilding artifacts multiple times?
A: Build once and promote artifacts across environments; store artifacts in S3/GitHub Releases and reuse them for distribution.
*/

/* ===========================================================================
📌 18. FINAL CHEAT-SHEET (copyable checklist)
===============================================================================
 - Use env files + native flavors/schemes for per-env builds
 - Keep .env.* out of VCS; use CI secrets for production values
 - Use Fastlane lanes for android/ios staging & prod builds
 - GitHub Actions (or Bitrise) to run lint/type/tests and build pipelines
 - Sign keys stored securely, use match / Play App Signing
 - Upload artifacts to TestFlight / Play (internal) and production channels
 - Use CodePush/EAS for safe JS hotfixes with version compatibility checks
 - Canary rollouts + monitoring (Sentry/Crashlytics) before full rollout
 - Manual approvals for production jobs and automatic changelog generation
 - Promote artifacts instead of rebuilding for reliability
*/

/* ===========================================================================
📌 19. WANT NEXT?
===============================================================================
I can produce (single-file JS Notes):
  ✅ Full example repo with GitHub Actions + Fastlane configured and example env files
  ✅ Bitrise workflow YAML & steps + secret setup instructions
  ✅ EAS (Expo) pipeline + CodePush/EAS update examples
  ✅ Fastlane match guide with encrypted storage & rotation best practices

Tell me which one and I’ll return it in this same JS Notes format.
*/
