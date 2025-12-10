/*********************************************************
 * 📦 Fastlane — Automating Metadata & Screenshot Uploads
 * deliver (App Store) • snapshot / capture_screenshots • frameit • supply (Play)
 *
 * File: fastlane_deliver_screenshots_metadata_notes.js
 * Copy-ready notes, code snippets, CI examples, pitfalls, and Q&A
 *********************************************************/

/*********************************************************
 * SECTION 0 — HIGH-LEVEL OVERVIEW
 *********************************************************/
/**
 * - fastlane `deliver` uploads App Store metadata, screenshots, attachments, and can submit for review.
 *   Use it to fully automate App Store Connect updates from CI or local scripts. :contentReference[oaicite:1]{index=1}
 * - Use `snapshot` / `capture_screenshots` to generate screenshots programmatically (iOS / Android).
 * - Use `frameit` to add device frames, captions or branding to screenshots before upload. :contentReference[oaicite:2]{index=2}
 * - For Google Play, equivalent Fastlane action is `supply` / `upload_to_play_store`. :contentReference[oaicite:3]{index=3}
 *
 * Security note:
 * - Treat metadata & screenshots as source-controlled assets; review PRs that change them.
 */

/*********************************************************
 * SECTION 1 — REPO STRUCTURE (fastlane metadata / screenshots)
 *********************************************************/
/**
 * Recommended structure (root of repo):
 *
 * fastlane/
 * ├─ Appfile
 * ├─ Fastfile
 * ├─ Deliverfile (optional)
 * ├─ metadata/
 * │  ├─ en-US/
 * │  │  ├─ description.txt
 * │  │  ├─ keywords.txt
 * │  │  ├─ release_notes.txt
 * │  │  └─ screenshots/
 * │  │     ├─ 5.5-in-1.png
 * │  │     └─ ...
 * │  ├─ fr-FR/
 * │  └─ ...
 * ├─ screenshots/          // (optional) output from snapshot/capture_screenshots
 * │  ├─ en-US/
 * │  └─ ...
 * └─ Framefile.json (frameit config, optional)
 *
 * `fastlane deliver init` will create a metadata/template structure for you. :contentReference[oaicite:4]{index=4}
 */

/*********************************************************
 * SECTION 2 — FASTFILE LANES (core examples)
 *********************************************************/

//////////////////////////////////////////////////////////////
// 1) Download latest metadata & screenshots (bootstrap)
//////////////////////////////////////////////////////////////
/*
lane :fetch_metadata do
  # Downloads current app metadata and screenshots into fastlane/metadata
  deliver(download_metadata: true, download_screenshots: true)
end
*/

//////////////////////////////////////////////////////////////
// 2) Generate screenshots (iOS) — using snapshot
// Note: configure snapshot in Snapfile and UI tests
//////////////////////////////////////////////////////////////
/*
lane :generate_ios_screenshots do
  # runs UI tests / snapshot to generate screenshots into ./screenshots
  capture_screenshots(
    devices: ["iPhone 14", "iPad Pro (12.9-inch) (6th generation)"], # example
    scheme: "YourAppUITests",
    reinstall_app: true
  )
  # Optionally frame screenshots
  frame_screenshots # frameit alias
end
*/

//////////////////////////////////////////////////////////////
// 3) Upload metadata + screenshots + binary, and submit for review
//////////////////////////////////////////////////////////////
/*
lane :release do
  # build your ipa (example using gym or build_app)
  build_app(scheme: "AppProd") # produces .ipa

  deliver(
    ipa: "./build/MyApp.ipa",          # optional - deliver can upload the ipa too
    force: true,                       // skip confirmation prompts (use carefully)
    skip_screenshots: false,           // set true if you don't want to overwrite screenshots
    skip_metadata: false,              // set true to keep metadata as-is on ASC
    submit_for_review: true,           // optionally submit app after upload
    automatic_release: false,          // set as per your release policy
    app_review_information: {
      contact_first_name: "Avi",
      contact_last_name: "Patel",
      contact_phone: "000-000-0000",
      contact_email: "team@example.com",
      demo_user: "demo@example.com",
      demo_password: "pass"
    }
  )
end
*/

//////////////////////////////////////////////////////////////
// 4) Upload only screenshots (safe pattern)
//////////////////////////////////////////////////////////////
/*
lane :upload_screenshots do
  deliver(
    screenshots_path: "./screenshots",  // path to your generated screenshots (optional)
    skip_binary_upload: true,
    skip_metadata: true,
    submit_for_review: false
  )
end
*/

//////////////////////////////////////////////////////////////
// 5) Upload only metadata (safe)
//////////////////////////////////////////////////////////////
/*
lane :upload_metadata do
  deliver(
    metadata_path: "./fastlane/metadata",
    skip_screenshots: true,
    skip_binary_upload: true,
    force: true
  )
end
*/

//////////////////////////////////////////////////////////////
// 6) Android equivalent (supply)
//////////////////////////////////////////////////////////////
/*
lane :upload_playstore do
  upload_to_play_store(
    aab: "./app/build/outputs/bundle/release/app-release.aab",
    track: "internal",
    rollout: 0.5,
    skip_upload_metadata: false
  )
end
*/

/*********************************************************
 * SECTION 3 — METADATA FILES (fields & formats)
 *********************************************************/
/**
 * Under fastlane/metadata/<locale>/:
 * - description.txt        -> long app description
 * - name.txt               -> app name (if you want to override)
 * - keywords.txt           -> comma-separated keywords
 * - promotional_text.txt   -> short promo text
 * - release_notes.txt      -> what's new text for a particular version (deliver will read this)
 * - privacy_url.txt        -> privacy url override
 * - support_url.txt        -> support url override
 *
 * Screenshots: place ordered PNG/JPG files into metadata/<locale>/screenshots.
 * File naming is not strictly required — ordering is based on alphabetical order,
 * so prefix files with numbers if you need specific screen ordering.
 *
 * Tip: keep images in source control and generate them via CI to keep deterministic.
 */

/*********************************************************
 * SECTION 4 — SCREENSHOT GENERATION (iOS & Android)
 *********************************************************/
/**
 * iOS:
 * - Use `snapshot` (or `capture_screenshots`) to run UI tests that capture
 *   screenshots for different devices / locales. Configure in Snapfile.
 * - After generating, use `frameit` (`frame_screenshots` alias) to add device frames
 *   and overlay localized text or branding. :contentReference[oaicite:5]{index=5}
 *
 * Android:
 * - Use `screengrab` (capture_screenshots alias) to run instrumentation tests that produce screenshots.
 * - Screenshots for Play go under fastlane/metadata/android/images/....
 *   Supply docs explain image sizes & upload behavior. :contentReference[oaicite:6]{index=6}
 *
 * Example Snapfile (iOS) – minimal:
 * devices:
 *  - iPhone 14
 *  - iPad Pro (12.9-inch)
 * languages:
 *  - en-US
 * scheme: "YourAppUITests"
 * output_directory: "./screenshots"
 *
 * After generating screenshots:
 * - Run `frameit` to add frames and adjust sizes.
 * - Verify sizes to match App Store requirements (fastlane may reject unknown sizes; see issues historically). :contentReference[oaicite:7]{index=7}
 */

/*********************************************************
 * SECTION 5 — FRAMEIT (styling screenshots)
 *********************************************************/
/**
 * frameit (frame_screenshots) can:
 *  - Place device frames around screenshots
 *  - Add titles, text overlays and background fill
 *  - Support iOS, Android, and macOS frames
 *
 * Usage:
 * - Configure Framefile.json for title and background settings.
 * - Run `frameit` or `frame_screenshots` after snapshot.
 *
 * Caveats:
 * - Keep generated image resolutions aligned with App Store accepted sizes,
 *   otherwise `deliver` might fail to upload them (or App Store may place them in different device buckets). :contentReference[oaicite:8]{index=8}
 */

/*********************************************************
 * SECTION 6 — FASTLANE CONFIG & AUTH (best practices)
 *********************************************************/
/**
 * Appfile (example minimal):
 * app_identifier("com.example.app")
 * apple_id("team@example.com")
 *
 * Authentication:
 * - Use App Store Connect API Keys (recommended) instead of username/password.
 * - Set FASTLANE_APPLE_APPLICATION_PASSWORD or use environment variables for sensitive data.
 *
 * Deliver options:
 * - `force: true` bypasses confirmation (dangerous if used carelessly).
 * - `skip_screenshots`, `skip_metadata`, `skip_binary_upload` available to scope uploads.
 *
 * Init helpers:
 * - `fastlane deliver init` scaffolds metadata & optionally downloads existing metadata; run locally to create baseline. :contentReference[oaicite:9]{index=9}
 */

/*********************************************************
 * SECTION 7 — CI / GITHUB ACTIONS EXAMPLE
 *********************************************************/
/**
 * Example: GitHub Actions lane to generate screenshots & upload metadata on main branch
 *
 * name: Release automation
 * on:
 *   push:
 *     branches: [ main ]
 * jobs:
 *   release:
 *     runs-on: macos-latest
 *     steps:
 *       - uses: actions/checkout@v4
 *         with:
 *           fetch-depth: 0
 *       - name: Set up Ruby
 *         uses: ruby/setup-ruby@v1
 *         with:
 *           ruby-version: '3.1'
 *       - name: Install fastlane
 *         run: gem install fastlane
 *       - name: Install CocoaPods
 *         run: cd ios && pod install
 *       - name: Build & generate screenshots
 *         run: |
 *           fastlane generate_ios_screenshots
 *       - name: Frame screenshots
 *         run: fastlane frame_screenshots
 *       - name: Upload screenshots & metadata
 *         env:
 *           FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD: ${{ secrets.APP_SPECIFIC_PASSWORD }}
 *           FASTLANE_SESSION: ${{ secrets.FASTLANE_SESSION }} # if using sessions
 *           APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}
 *         run: fastlane upload_screenshots
 *
 * Notes:
 * - Use App Store Connect API key for authentication on CI where possible.
 * - Cache CocoaPods and derived data between runs to speed up builds.
 */

/*********************************************************
 * SECTION 8 — COMMON PITFALLS & TROUBLESHOOTING
 *********************************************************/
/**
 * 1) Screenshots missing after upload
 *    - Fastlane will overwrite screenshots for locales it uploads; check skip flags.
 *    - Use `deliver` output log to see whether screenshots were uploaded. (community threads show timing/500 issues). :contentReference[oaicite:10]{index=10}
 *
 * 2) Wrong image sizes / unknown sizes
 *    - App Store adds screenshots to device buckets by size; if size is unexpected, upload may fail.
 *    - Update frameit config or adjust generation sizes. See community issues for new device sizes (e.g., iPad 13"). :contentReference[oaicite:11]{index=11}
 *
 * 3) `deliver` can be destructive
 *    - By default deliver may overwrite metadata/screenshots — use `download_metadata` to bootstrap and review before pushing. :contentReference[oaicite:12]{index=12}
 *
 * 4) CI concurrency & rate limits
 *    - App Store Connect has rate limits; batch or stagger uploads if you run many parallel jobs.
 *
 * 5) Localized screenshots order
 *    - Alphabetical order of filenames determines order in App Store — prefix with numbers.
 *
 * 6) Frameit/device mapping issues
 *    - If frameit does not recognize a device size, it may leave unframed assets or warn — customize the device list or skip framing for that resolution.
 */

/*********************************************************
 * SECTION 9 — VERIFICATION (post-upload checks)
 *********************************************************/
/**
 * - After upload, verify via App Store Connect web UI or use `deliver`'s summary logs.
 * - `fastlane deliver` prints a metadata summary before uploading; use it to confirm what will change.
 * - For automated verification, call App Store Connect API to fetch current metadata and compare to repo state.
 * - Keep CI artifact (screenshots zip) and logs to aid audits and rollbacks.
 * :contentReference[oaicite:13]{index=13}
 */

/*********************************************************
 * SECTION 10 — ANDROID BRIEF (supply)
 *********************************************************/
/**
 * - For Play Store, use `supply` or `upload_to_play_store` to upload AAB/APK, metadata, and screenshots.
 * - `screengrab` generates Android screenshots; place them under fastlane/metadata/android.
 * - supply supports tracks, rollouts, and changelogs; consult supply docs for size and localization rules. :contentReference[oaicite:14]{index=14}
 */

/*********************************************************
 * SECTION 11 — INTERVIEW Q&A & CHECKLIST
 *********************************************************/
/**
 * Q1: How do you prevent accidental metadata overwrite?
 * A1: Use `deliver download_metadata` to bootstrap, use code review on metadata changes, and set skip flags in deliver lanes. :contentReference[oaicite:15]{index=15}
 *
 * Q2: How do you generate localized screenshots?
 * A2: Use UI tests (snapshot/screengrab) configured for different locales, or generate programmatically and store under fastlane/metadata/<locale>. :contentReference[oaicite:16]{index=16}
 *
 * Q3: How to add device frames & overlay text?
 * A3: Use `frameit` (frame_screenshots) with Framefile.json to configure titles/backgrounds. :contentReference[oaicite:17]{index=17}
 *
 * Q4: What are safe CI practices for deliver?
 * A4: Use App Store Connect API keys, avoid force flags in PR jobs, push screenshots from trusted release pipelines, and keep artifact logs for audits.
 *
 * Quick checklist:
 *  - [ ] `fastlane deliver init` -> create metadata baseline. :contentReference[oaicite:18]{index=18}
 *  - [ ] Generate screenshots via snapshot/screengrab.
 *  - [ ] Frame screenshots (optional).
 *  - [ ] Review metadata in PR.
 *  - [ ] Upload with deliver/supply in release pipeline.
 */

/*********************************************************
 * END OF FILE
 *********************************************************/
