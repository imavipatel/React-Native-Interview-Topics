/*********************************************************
 * ⚡ Gradle Performance Tuning & Build Caching — JS Notes
 * Copy-ready reference file for Android / multi-module projects
 *
 * Includes:
 *  - Key concepts (daemon, parallel, config cache, build cache)
 *  - Example config snippets (gradle.properties, settings.gradle)
 *  - CI tips for remote cache + cache pushing
 *  - JVM / daemon tuning, parallelization, dependency caching
 *  - Troubleshooting, measurement & interview Q&A
 *********************************************************/

/*********************************************************
 * SECTION 0 — QUICK SUMMARY (copy these 3 lines to gradle.properties)
 *********************************************************/
/**
 * Recommended quick toggles (place in gradle.properties)
 *
 * org.gradle.daemon=true                  // keep Gradle background process alive
 * org.gradle.parallel=true                // build independent modules in parallel
 * org.gradle.caching=true                 // enable Gradle build cache
 *
 * Note: configuration cache and other flags below require validation.
 * See references for deeper behaviour and caveats. (Daemon + cache docs).
 */

/*********************************************************
 * SECTION 1 — WHY TUNE GRADLE?
 *********************************************************/
/**
 * - Gradle build time affects dev velocity and CI cost.
 * - Small improvements multiply: shaving seconds off local builds
 *   and minutes off CI builds saves significant time across the team.
 * - Key levers: avoid JVM startups, cache outputs, parallelize independent work,
 *   reduce configuration time, and minimize unnecessary tasks.
 */

/*********************************************************
 * SECTION 2 — CORE CONCEPTS (short)
 *********************************************************/

/**
 * 1) Gradle Daemon
 *    - A long-lived JVM process that avoids JVM startup on every build.
 *    - Speeds up repeated builds (recommended for local dev & CI agents where appropriate).
 *
 * 2) Build Cache (local & remote)
 *    - Stores task outputs (artifacts) keyed by task inputs.
 *    - Reuses outputs to skip re-execution of expensive tasks on other machines or CI.
 *
 * 3) Configuration Cache
 *    - Caches the configuration phase so subsequent builds can skip re-running it.
 *    - Highly effective for multi-module projects when configuration is expensive.
 *
 * 4) Parallel Builds & Configure-on-demand
 *    - org.gradle.parallel=true allows building independent modules in parallel.
 *    - org.gradle.configureondemand=true restricts configuration to needed projects.
 *
 * 5) JVM tuning
 *    - Set appropriate heap (Xmx) and GC options for the daemon to avoid OOM/GC stalls.
 *
 * Sources for details: Gradle docs (build cache, daemon, configuration & performance guides). :contentReference[oaicite:1]{index=1}
 */

/*********************************************************
 * SECTION 3 — SAMPLE CONFIG SNIPPETS
 *********************************************************/

/********************************************
 * gradle.properties (project root or ~./gradle/gradle.properties)
 ********************************************/
/**
 * Copy / adapt these into your repo gradle.properties
 *
 * Note: some flags can be global (user-level) or project-level depending on policy.
 */
//
// ===== Basic performance toggles =====
/*
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.configureondemand=true
org.gradle.jvmargs=-Xmx4g -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8

# Optional - reduce Gradle's logging noise
org.gradle.logging.level=warn
*/

//
// ===== Configuration Cache (opt-in careful testing) =====
// To use configuration cache safely, validate your build with --configuration-cache and fix warnings.
// Be conservative: certain plugins/tasks are not yet compatible with configuration cache.
// Recommended: enable per-team after remediation.
/*
org.gradle.configuration-cache=true
*/

/********************************************
 * settings.gradle(.kts) — buildCache config (remote + local)
 ********************************************/
/**
 * JS-style pseudocode snippet to illustrate how to configure
 * a remote cache block in settings.gradle (KTS or Groovy similar).
 *
 * Replace url/credentials with your cache server (Artifactory, Depot Cache, Gradle Enterprise, etc.)
 */
//
// settings.gradle (Groovy)
/*
buildCache {
    local {
        enabled = true
        // directory = "${rootDir}/.gradle/build-cache" // optional local path
    }
    remote(HttpBuildCache) {
        url = 'https://gradle-cache.example.com/cache/'
        push = true // allow clients to push cache entries (enable on CI)
        credentials {
            username = "${gradleCacheUser}"
            password = "${gradleCachePassword}"
        }
        allowUntrustedServer = false // set true only for self-signed certs in testing
    }
}
*/

/*********************************************************
 * SECTION 4 — CI CONFIG: push vs pull & safe practice
 *********************************************************/
/**
 * Checklist for CI:
 *  - Enable local cache for developers; enable remote cache for CI to share outputs.
 *  - On CI: set `-Pgradle.cache.push=true` (or set env/gradle property) when you want to push
 *    artifacts into the remote cache (usually on successful main/build pipeline).
 *  - CI agents should mount a shared gradle user home or restore dependency caches to reduce download time.
 *  - Secure credentials: use CI secrets to supply cache username/password or tokens.
 *
 * Example GitHub Actions step (pseudocode):
 *
 * - name: Gradle build with cache
 *   env:
 *     GRADLE_USER_HOME: ${{ github.workspace }}/.gradle
 *   run: |
 *     ./gradlew --no-daemon clean assembleDebug \
 *       -Dorg.gradle.caching=true \
 *       -Pgradle.cache.push=true
 *
 * Important: Only push trusted builds into remote cache (e.g., main branch, signed builds).
 */

/*********************************************************
 * SECTION 5 — JVM / Daemon TUNING
 *********************************************************/
/**
 * Tips:
 *  - Set org.gradle.daemon=true for local dev to avoid JVM startup cost. Gradle Daemon docs explain
 *    the tradeoffs (memory footprint vs startup savings). :contentReference[oaicite:2]{index=2}
 *  - Set org.gradle.jvmargs in gradle.properties to tune heap: e.g. -Xmx4g for large projects.
 *  - Consider G1 GC flags for modern JVMs if builds do a lot of object churn:
 *     -XX:+UseG1GC -XX:MaxGCPauseMillis=200
 *  - For CI where many builds may run ephemeral containers, prefer no-daemon or reuse containers
 *    that keep Gradle user home between runs (cache benefit).
 */

/*********************************************************
 * SECTION 6 — PARALLELIZATION & CONFIGURATION
 *********************************************************/
/**
 * - org.gradle.parallel=true allows executing independent tasks/projects in parallel.
 *   Use in multi-module builds where modules have minimal cross-deps.
 * - org.gradle.configureondemand=true reduces configuration time by configuring only necessary projects.
 *
 * Caveats:
 *  - Some plugins/tasks assume single-threaded execution; thoroughly test.
 *  - Configure-on-demand may not be compatible with all build setups; validate.
 *
 * See Gradle docs for configure-on-demand & parallel execution behavior. :contentReference[oaicite:3]{index=3}
 */

/*********************************************************
 * SECTION 7 — CONFIGURATION CACHE (advanced)
 *********************************************************/
/**
 * - Configuration cache saves the results of the configuration phase and reuses it.
 * - Enable with `org.gradle.configuration-cache=true` (gradle.properties) or via CLI `--configuration-cache`.
 * - Run builds with `--configuration-cache` and fix warnings Gradle prints — only after your build is compatible
 *   should you persist this flag; some plugins are not yet compatible. See Gradle's configuration cache guide. :contentReference[oaicite:4]{index=4}
 *
 * Typical steps:
 *  1) Run: ./gradlew assembleDebug --configuration-cache
 *  2) Address warnings/errors and rerun until clean
 *  3) Enable flag in gradle.properties for team-wide usage
 */

/*********************************************************
 * SECTION 8 — DEPENDENCY & DOWNLOAD CACHING
 *********************************************************/
/**
 * - Cache dependency artifacts between CI runs: mount ~/.gradle or use CI cache action (e.g., GitHub Actions cache)
 * - Prefer repository managers (Artifactory/Nexus) close to CI runners to reduce latency.
 * - Use `--refresh-dependencies` only when necessary; otherwise Gradle uses local cache.
 */

/*********************************************************
 * SECTION 9 — TASK-LEVEL OPTIMIZATIONS
 *********************************************************/
/**
 * - Avoid expensive file system scans at configuration time; prefer lazy task definitions.
 * - Avoid top-level side effects (initialization logic) in build.gradle files; defer to doFirst/doLast or task actions.
 * - Use incremental tasks and mark inputs/outputs correctly so Gradle can skip tasks when inputs unchanged.
 * - Disable unused tasks on CI (e.g., lint/checkstyle) when not needed for the pipeline.
 */

/*********************************************************
 * SECTION 10 — MEASURING & TROUBLESHOOTING
 *********************************************************/
/**
 * Useful flags:
 *  - --profile                 => generates HTML report in build/reports/profile (bottleneck analysis)
 *  - --scan (Gradle build scan) => upload a build scan for deep diagnostics (requires plugin/service)
 *  - --info / --debug for more logs
 *
 * Typical workflow:
 *  1) Run a slow build with `--profile` and inspect the report.
 *  2) Identify long configuration/initialization tasks.
 *  3) Apply targeted optimization (lazy configuration, cache, parallelization).
 */

/*********************************************************
 * SECTION 11 — EXAMPLE: enabling build cache & safe push in CI
 *********************************************************/
/**
 * Example (Bash / CI pseudocode):
 *
 * # Enable cache locally (gradle.properties)
 * echo "org.gradle.caching=true" >> gradle.properties
 *
 * # On CI (push to remote cache on success)
 * ./gradlew assembleRelease \
 *   -Dorg.gradle.caching=true \
 *   -Pgradle.cache.push=true \
 *   --no-daemon
 *
 * # On developer machines, prefer daemon: gradle.properties has org.gradle.daemon=true
 */

/*********************************************************
 * SECTION 12 — SECURITY & POLICY (remote cache)
 *********************************************************/
/**
 * - Only allow pushing to remote cache from trusted pipelines (CI main branch builds).
 * - Use tokens/scoped credentials for cache access; do NOT commit secrets into repo.
 * - Consider cache encryption/ACL depending on org policy.
 */

/*********************************************************
 * SECTION 13 — COMMON PITFALLS & GOTCHAS
 *********************************************************/
/**
 * - Configuration cache incompatibility: some third-party plugins are not safe yet.
 * - Over-aggressive parallelization can cause race conditions in non-thread-safe tasks.
 * - Pushing untrusted artifacts into remote cache can poison builds — validate before push.
 * - Incorrect inputs/outputs declarations will lead to cache misses.
 */

/*********************************************************
 * SECTION 14 — INTERVIEW Q&A (copy to flashcards)
 *********************************************************/
/**
 * Q1: What does org.gradle.daemon=true do and why use it?
 * A1: Runs Gradle as a background JVM process to avoid per-build JVM startup; improves repeated build times. :contentReference[oaicite:5]{index=5}
 *
 * Q2: How do you enable Gradle build cache?
 * A2: Set org.gradle.caching=true in gradle.properties and configure remote/local cache in settings.gradle. :contentReference[oaicite:6]{index=6}
 *
 * Q3: What is the configuration cache?
 * A3: A mechanism that caches the configuration phase so subsequent builds can bypass configuration, reducing build time. Requires plugin compatibility. :contentReference[oaicite:7]{index=7}
 *
 * Q4: When should you use a remote build cache vs local?
 * A4: Use remote cache to share reusable outputs between CI agents or developers. Local cache helps individual dev machines; remote cache increases cache hit across agents. :contentReference[oaicite:8]{index=8}
 *
 * Q5: What risks come with parallel build and configure-on-demand?
 * A5: Race conditions, plugin incompatibility, and unpredictable behaviour if tasks/plugins are not thread safe; thorough testing required. :contentReference[oaicite:9]{index=9}
 */

/*********************************************************
 * END OF NOTES — keep this file in repo/doc for reference
 *********************************************************/
