/* ===========================================================================
📌 7. ANDROID: productFlavors + .env mapping (example snippet)
===============================================================================
android/app/build.gradle (concept)
android {
  ...
  flavorDimensions "env"
  productFlavors {
    dev {
      dimension "env"
      applicationIdSuffix ".dev"
      versionNameSuffix "-dev"
    }
    staging {
      dimension "env"
      applicationIdSuffix ".staging"
    }
    prod {
      dimension "env"
    }
  }
}

Place files:
  android/app/.env.dev
  android/app/.env.staging
  android/app/.env.prod

react-native-config will pick .env.{flavorName} automatically during Gradle build.
*/

/* ===========================================================================
📌 8. iOS: Schemes & Configurations (example steps)
===============================================================================
1) Duplicate the Release configuration in Xcode and name it "Staging".
2) Create Schemes: "MyApp-Staging" and map to Staging configuration.
3) Add .env.staging in project root.
4) Build with scheme: xcodebuild -scheme "MyApp-Staging" -configuration Staging
react-native-config reads the active configuration and loads corresponding .env.
*/

/* ===========================================================================
📌 9. EXPO (managed) approach
===============================================================================
Expo (app.json / app.config.js):
- Use "extra" field: extra: { API_URL: process.env.API_URL }
- Use eas.json build profiles to set env
- Use `expo-constants` to read Constants.manifest.extra at runtime
Example:
app.config.js:
module.exports = ({ config }) => ({
  ...config,
  extra: {
    apiUrl: process.env.API_URL,
  },
});

Runtime:
import Constants from 'expo-constants';
const API_URL = Constants.manifest.extra.apiUrl;
EAS secrets: eas secret:create and reference in build config.
*/

/* ===========================================================================
📌 10. ALTERNATIVE: babel-plugin-inline-dotenv (JS-only)
===============================================================================
- Install dotenv and babel plugin to inline process.env.* into JS at bundle time.
- Simpler but does NOT add native BuildConfig values.
- Example usage in Babel config (less recommended for native integr.):

// babel.config.js
module.exports = {
  plugins: [
    ["inline-dotenv", { "path": ".env" }]
  ]
};
*/

/* ===========================================================================
📌 11. RUNTIME CONFIG & OVERRIDES (CodePush / Remote Config)
===============================================================================
- For emergency toggles or config without rebuild:
  1) Fetch config.json from server on app start
  2) Merge with build-time Config: runtimeConfig = { ...Config, ...remoteConfig }
  3) Persist runtimeConfig locally (MMKV / AsyncStorage) and use in app
- CodePush: deliver small JS bundle update that contains new config (but make sure not to include secrets)
- Firebase Remote Config: provides per-device conditional configuration at runtime
- Always validate and fallback to safe defaults if runtime fetch fails
*/

/* ===========================================================================
📌 12. SECURE SECRETS (do NOT put secrets in .env committed to repo)
===============================================================================
Options:
- CI injects secrets during build (GH Actions secrets, Bitrise secrets)
- Use secret manager (AWS Secrets Manager / Parameter Store, Vault)
- On mobile, avoid storing long-term secrets in app; use backend to mint short-lived tokens
- If you must store: use Keychain (iOS) / Android Keystore (EncryptedSharedPreferences), not AsyncStorage
- Audit repository for accidental secrets using git-secrets or trufflehog in CI
*/

/* ===========================================================================
📌 13. CI / Deployment pattern (typical)
===============================================================================
1) Local dev:
   - Use .env.local or .env.development (gitignored) for dev variables
   - Developer runs: yarn android --variant=devDebug or yarn ios:dev scheme

2) CI build for staging:
   - CI injects STAGING_API_URL and other secrets
   - CI writes a .env.staging to workspace or passes env to Gradle/Xcode
   - Build: ./gradlew assembleStagingRelease or xcodebuild -scheme MyApp-Staging

3) CI build for production:
   - CI reads secrets from secret manager and injects .env.production (never stored)
   - Build and upload

4) Distribute:
   - Staging -> internal testers
   - Prod -> app stores

Note: For fast iteration, use CodePush for JS-only non-secret updates.
*/

/* ===========================================================================
📌 14. VERSIONING & TRACKING (tips)
===============================================================================
- Include BUILD_ENV and BUILD_DATE in env to identify which build runs in crash reports
- Add Config.BUILD_TAG or Config.SENTRY_ENV (e.g., "staging", "production")
- Use these values in telemetry to filter environments
*/

/* ===========================================================================
📌 15. SAMPLE SCRIPT TASKS (package.json scripts)
===============================================================================
"scripts": {
  "start": "react-native start",
  "android:dev": "ENVFILE=.env.development react-native run-android --variant=devDebug",
  "android:staging": "ENVFILE=.env.staging react-native run-android --variant=stagingRelease",
  "ios:dev": "ENVFILE=.env.development npx pod-install && react-native run-ios --scheme MyApp-Dev",
  "build:android:prod:ci": "ENVFILE=.env.production ./gradlew assembleProdRelease",
  "build:ios:prod:ci": "ENVFILE=.env.production xcodebuild -scheme MyApp -configuration Release"
}

Explanation:
- react-native-config supports ENVFILE variable to pick a .env file at build time.
- CI sets ENVFILE or writes the file before build.
*/

/* ===========================================================================
📌 16. MIGRATION & BACKWARD-COMPAT (if converting existing project)
===============================================================================
1) Audit current config usage: search for process.env.* and hard-coded endpoints.
2) Decide on library: react-native-config vs Expo approach
3) Add .env.example, update README with local dev steps
4) Migrate build scripts and CI to use new env approach
5) For runtime overrides (CodePush / remote config) implement fallback merge logic
6) Review secrets handling and rotate any keys that were previously committed
*/

/* ===========================================================================
📌 17. INTERVIEW Q&A (short)
===============================================================================
Q1: Where should you store API keys in RN?
A: Do NOT commit them in .env to repo. Use CI secret injection and store runtime secrets in Keychain/Keystore or obtain via backend.

Q2: What's react-native-config and why use it?
A: Library that exposes .env values to native and JS code at build time (Android BuildConfig / iOS Info.plist constants) — good for environment-specific build-time values.

Q3: How to change API endpoint without rebuilding?
A: Use runtime config fetched from server or remote config (Firebase Remote Config / hosted config JSON), or use CodePush to update JS bundle.

Q4: How to manage env for Expo?
A: Use app.json/app.config.js extra + EAS build profiles and EAS secrets.

Q5: Is it safe to include production secrets in .env.production committed to repo?
A: No. Never commit production secrets. Use secret managers and CI injection.
*/

/* ===========================================================================
📌 18. QUICK CHEAT-SHEET (actionable)
===============================================================================
✔ Use react-native-config for native + JS build-time envs (bare RN)
✔ Keep .env.example in repo; add .env.* to .gitignore
✔ Use CI to inject production secrets; never commit them
✔ Use Keychain/Keystore for long-lived secrets on-device
✔ Use remote config / CodePush for runtime toggles & emergency fixes
✔ For Expo managed apps, use app.config.js extra + EAS secrets
✔ Add BUILD_ENV and BUILD_TAG to every build for traceability
✔ Audit repo & CI for accidental secrets leakage
*/

/* ===========================================================================
📌 19. WANT NEXT?
===============================================================================
I can provide (single-file JS Notes):
  ✅ Fully worked example project scaffold using react-native-config + Gradle/iOS scheme setup
  ✅ GitHub Actions / Bitrise CI example that injects env and builds Android/iOS
  ✅ CodePush + runtime config merge pattern + sample code
  ✅ Secure secret injection tutorial using AWS Secrets Manager and GitHub Actions

Tell me which one and I will return it in this same JS Notes format.
*/
